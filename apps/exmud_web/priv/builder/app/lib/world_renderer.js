function WorldRenderer() {
    this.cubeSize = 30;
    this.gridStepSize = 50;

    var width = window.innerWidth,
        height = window.innerHeight - $('header').outerHeight(true);

    var renderer = new THREE.WebGLRenderer(),
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000),
        scene = new THREE.Scene(),
        controls = new THREE.OrbitControls(camera, renderer.domElement),
        ambient = new THREE.AmbientLight(0x404040),
        top = new THREE.DirectionalLight(0xaaaaaa),
        bottom = new THREE.DirectionalLight(0x777777);

    var axis = new THREE.AxisHelper(100);
    axis.position.set(0, 0, 0);
    scene.add(axis);

    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);

    camera.position.set(0, 0, 500);
    scene.add(camera);

    ambient.position.set(0, 0, 10000);
    scene.add(ambient);

    top.position.set(1, 1, 1);
    scene.add(top);

    bottom.position.set(-1, -1, -1);
    scene.add(bottom);

    var shadowGeometry = new THREE.CubeGeometry(this.cubeSize,
                                                this.cubeSize,
                                                this.cubeSize);
    var shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x22bb22,
        opacity: 0.5,
        transparent: true
    });

    var shadowCube = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadowCube.visible = false;
    scene.add(shadowCube);

    var cube = {
        shadow: shadowCube,
        //hmmm i have to create a new cube geometry here, trying to reuse the shadow one
        //causes invalid operation webgl errors
        geometry: new THREE.CubeGeometry(this.cubeSize,
                                         this.cubeSize,
                                         this.cubeSize),
        material: new THREE.MeshLambertMaterial({
            emissive: 0x22ff22
        })
    };

    var rollOverGeometry = new THREE.CubeGeometry(this.gridStepSize,
                                                  this.gridStepSize,
                                                  this.gridStepSize);
    var rollOverMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true
    });
    var rollOverMesh = new THREE.Mesh(rollOverGeometry, rollOverMaterial);
    rollOverMesh.position.set(0, 0, 10000);
    scene.add(rollOverMesh);

    //this is used for intersection detection on the grid
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000),
                               new THREE.MeshBasicMaterial({
                                   color: 0x444444,
                                   opacity: 0.15,
                                   transparent: true
                               }));
    //plane.visible = false;
    plane.position.set(0, 0, 0);
    scene.add(plane);

    this.$el = Ember.$(renderer.domElement);
    this.width = this.$el.innerWidth();
    this.height = this.$el.innerHeight();
    this.offset = this.$el.offset();
    this.location = {
        x: 0,
        y: 0,
        z: 0
    };
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.controls = controls;
    this.projector = new THREE.Projector();
    this.cube = cube;
    this.rollOver = rollOverMesh;
    this.plane = plane;
    this.light = {
        ambient: ambient,
        top: top,
        bottom: bottom
    };
    this.mouse2d = new THREE.Vector3(0, 10000, 0.5);
    this.normalMatrix = new THREE.Matrix3();
    this.modelsToCubes = {};
    this.cubesToModels = {};

    this.state('selectingObjects');
    this.animate();
}

WorldRenderer.prototype = {
    _getRealIntersector: function(intersects) {
        var intersector;

        for (var i = 0; i < intersects.length; i++) {
            intersector = intersects[i];

            if (intersector.object != this.rollOver &&
                intersector.object != this.cube.shadow) {
                return intersector;
            }
        }

        return null;
    },

    _calculateGridPosition: function(intersector) {
        if (!intersector.object) return;
        if (!intersector.face || !intersector.face.normal) return;

        var gridStepSize = this.gridStepSize,
            cubeSize = this.cubeSize,
            matrixWorld = intersector.object.matrixWorld;

        this.normalMatrix.getNormalMatrix(matrixWorld);

        var vec = intersector.face.normal.clone();
        vec.applyMatrix3(this.normalMatrix).normalize();

        var pos = new THREE.Vector3();
        pos.addVectors(intersector.point, vec);

        pos.x = Math.floor(pos.x / gridStepSize) * gridStepSize;
        pos.y = Math.floor(pos.y / gridStepSize) * gridStepSize;
        pos.z = Math.floor(pos.z / gridStepSize) * gridStepSize + (cubeSize / 2);

        return pos;
    },

    _render: function(timestamp) {
        if (!this.isLocationLocked()) {
            //calculate normalized device coordinates (-1 to 1)
            //grid squares are centered so have to offset coordinates a bit to make
            //the shadow/rollover follow cursor correctly
            var gridHalfStep = this.gridStepSize / 2,
                ndc = new THREE.Vector3();
            ndc.x = ((this.mouse2d.x - this.offset.left + gridHalfStep) / this.width) * 2 - 1;
            ndc.y = -((this.mouse2d.y - this.offset.top - gridHalfStep) / this.height) * 2 + 1;

            var raycaster = this.projector.pickingRay(ndc, this.camera),
                intersections = raycaster.intersectObjects(this.scene.children),
                intersector;

            if (intersections.length > 0) {
                intersector = this._getRealIntersector(intersections);

                if (intersector) {
                    var pos = this._calculateGridPosition(intersector);
                    if (pos) {
                        this.rollOver.position = pos;
                        this.cube.shadow.position = pos;

                        this.location.x = pos.x / this.gridStepSize;
                        this.location.y = pos.y / this.gridStepSize;
                        this.location.z = (pos.z - (this.cubeSize / 2)) / this.gridStepSize;
                    }
                }
            }

        }

        this.renderer.render(this.scene, this.camera);
    },

    state: function(state) {
        this._state = state;

        if (this.isPickingLocation()) {
            this.rollOver.visible = false;
            this.cube.shadow.visible = true;
        }

        if (this.isSelectingObjects()) {
            this.rollOver.visible = true;
            this.cube.shadow.visible = false;
        }
    },

    isPickingLocation: function() {
        return this._state === 'pickingLocation';
    },

    isLocationLocked: function() {
        return this._state === 'locationLocked';
    },

    isSelectingObjects: function() {
        return this._state === 'selectingObjects';
    },

    animate: function() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this._render();
    },

    resize: function(newWidth, newHeight) {
        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newWidth, newHeight);

        this.width = this.$el.innerWidth();
        this.height = this.$el.innerHeight();
        this.offset = this.$el.offset();
    },

    addCube: function(model) {
        var c = this.modelsToCubes[model];
        if (c) return;

        c = new THREE.Mesh(this.cube.geometry, this.cube.material);
        c.position.set(50 * model.get('x'), 50 * model.get('y'), (50 * model.get('z')) + 15);
        this.scene.add(c);

        this.modelsToCubes[model] = c;
        this.cubesToModels[c] = model;
    },

    removeCube: function(model) {
        var c = this.modelsToCubes[model];
        if (!c) return;

        this.scene.remove(c);
        delete this.modelsToCubes[model];
        delete this.cubesToModels[c];
    }
};

//initialize only once
var gfx = null;

export
default

function() {
    if (gfx === null) gfx = new WorldRenderer();
    return gfx;
}
