function WorldRenderer() {
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

    var shadowGeometry = new THREE.CubeGeometry(30, 30, 30);
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
        geometry: new THREE.CubeGeometry(30, 30, 30),
        material: new THREE.MeshLambertMaterial({
            emissive: 0x22ff22
        })
    };

    var rollOverGeometry = new THREE.CubeGeometry(50, 50, 50);
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

    this.pickingLocation = false;
    this.location = null;
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

        var matrixWorld = intersector.object.matrixWorld;

        this.normalMatrix.getNormalMatrix(matrixWorld);

        var vec = intersector.face.normal.clone();
        vec.applyMatrix3(this.normalMatrix).normalize();

        var pos = new THREE.Vector3();
        pos.addVectors(intersector.point, vec);

        pos.x = Math.floor(pos.x / 50) * 50;
        pos.y = Math.floor(pos.y / 50) * 50;
        pos.z = Math.floor(pos.z / 50) * 50 + 15;

        return pos;
    },

    _render: function(timestamp) {
        if (!this.pickingLocation || !this.location) {
            var raycaster = this.projector.pickingRay(this.mouse2d.clone(), this.camera),
                intersections = raycaster.intersectObjects(this.scene.children),
                intersector;

            if (this.pickingLocation) {
                this.rollOver.visible = false;
                this.cube.shadow.visible = true;
            } else {
                this.rollOver.visible = true;
                this.cube.shadow.visible = false;
            }

            if (intersections.length > 0) {
                intersector = this._getRealIntersector(intersections);

                if (intersector) {
                    var pos = this._calculateGridPosition(intersector);
                    if (pos) {
                        this.rollOver.position = pos;
                        this.cube.shadow.position = pos;
                    }
                }
            }
        }

        this.renderer.render(this.scene, this.camera);
    },

    animate: function() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        this._render();
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
