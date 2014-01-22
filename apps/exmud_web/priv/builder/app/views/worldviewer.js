// todo: yeah need to make a separate object that only manages the rendering
// have the view create/retrieve one and use it instead of all this inline crap
var gfx = null;

function buildGfx() {
    if (gfx) return gfx;

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

    var plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000),
        new THREE.MeshBasicMaterial({
            color: 0x444444,
            opacity: 0.15,
            transparent: true
        }));
    //plane.visible = false;
    //plane.rotation.x = Math.PI / 2;
    plane.position.set(0, 0, 0);
    scene.add(plane);

    gfx = {
        pickingLocation: false,
        location: null,
        renderer: renderer,
        camera: camera,
        scene: scene,
        controls: controls,
        projector: new THREE.Projector(),
        cube: cube,
        rollOver: rollOverMesh,
        plane: plane,
        light: {
            ambient: ambient,
            top: top,
            bottom: bottom
        },
        mouse2d: new THREE.Vector3(0, 10000, 0.5),
        normalMatrix: new THREE.Matrix3(),
        modelsToCubes: {},
        cubesToModels: {}
    };


    animate();
    render();
}

function getRealIntersector(intersects) {
    var intersector;

    for (var i = 0; i < intersects.length; i++) {
        intersector = intersects[i];

        if (intersector.object != gfx.rollOver &&
            intersector.object != gfx.cube.shadow) {
            return intersector;
        }
    }

    return null;
}

function calculateGridPosition(intersector) {
    if (!intersector.object) return;
    if (!intersector.face || !intersector.face.normal) return;

    var matrixWorld = intersector.object.matrixWorld;

    gfx.normalMatrix.getNormalMatrix(matrixWorld);

    var vec = intersector.face.normal.clone();
    vec.applyMatrix3(gfx.normalMatrix).normalize();

    var pos = new THREE.Vector3();
    pos.addVectors(intersector.point, vec);

    pos.x = Math.floor(pos.x / 50) * 50;
    pos.y = Math.floor(pos.y / 50) * 50;
    pos.z = Math.floor(pos.z / 50) * 50 + 15;

    return pos;
}

function animate() {
    requestAnimationFrame(animate);
    gfx.controls.update();
    render();
}

function render(timestamp) {
    if (!gfx.pickingLocation || !gfx.location) {
        var raycaster = gfx.projector.pickingRay(gfx.mouse2d.clone(), gfx.camera),
            intersections = raycaster.intersectObjects(gfx.scene.children),
            intersector;

        if (gfx.pickingLocation) {
            gfx.rollOver.visible = false;
            gfx.cube.shadow.visible = true;
        } else {
            gfx.rollOver.visible = true;
            gfx.cube.shadow.visible = false;
        }

        if (intersections.length > 0) {
            intersector = getRealIntersector(intersections);

            if (intersector) {
                var pos = calculateGridPosition(intersector);
                if (pos) {
                    gfx.rollOver.position = pos;
                    gfx.cube.shadow.position = pos;
                }
            }
        }
    }

    gfx.renderer.render(gfx.scene, gfx.camera);
}

export
default Ember.View.extend({
    classNames: ['world-viewer'],

    init: function() {
        buildGfx();

        gfx.pickingLocation = this.get('picking');
        gfx.location = this.get('controller').get('lastLocation');

        this._super();
    },

    didInsertElement: function() {
        var self = this,
            $el = $(this.get('element'));

        this.set('$el', $el);

        this.set('windowResizeListener', this.resize.bind(this));
        $(window).on('resize', this.get('windowResizeListener'));

        $el.append(gfx.renderer.domElement);

        this.set('controlsChangeListener', this.viewChanged.bind(this));
        gfx.controls.addEventListener('change', this.get('controlsChangeListener'));

        this.resize();
    },

    willDestroyElement: function() {
        $(window).off('resize', this.get('windowResizeListener'));
        gfx.controls.removeEventListener('change', this.get('controlsChangeListener'));
    },

    viewChanged: function() {
        this.set('selecting', false);
    },

    addCube: function(model) {
        var c = gfx.modelsToCubes[model];
        if (c) return;

        c = new THREE.Mesh(gfx.cube.geometry, gfx.cube.material);
        c.position.set(50 * model.get('x'), 50 * model.get('y'), (50 * model.get('z')) + 15);
        gfx.scene.add(c);

        gfx.modelsToCubes[model] = c;
        gfx.cubesToModels[c] = model;
    },

    removeCube: function(model) {
        var c = gfx.modelsToCubes[model];
        if (!c) return;

        gfx.scene.remove(c);
        delete gfx.modelsToCubes[model];
        delete gfx.cubesToModels[c];
    },

    renderCubes: function() {
        var self = this,
            rooms = this.get('controller')
                .get('model');

        rooms.forEach(function(room) {
            self.addCube(room);
        });
    }.observes('controller.model').on('init'),

    mouseMove: function(e) {
        var $el = this.get('$el');

        e.preventDefault();
        //calculate normalized device coordinates (-1 to 1)
        gfx.mouse2d.x = (e.clientX / $el.innerWidth()) * 2 - 1;
        gfx.mouse2d.y = -((e.clientY - 84) / $el.innerHeight()) * 2 + 1;
    },

    mouseDown: function() {
        this.set('selecting', true);
    },

    mouseUp: function(e) {
        if (!this.get('selecting')) return;

        this.set('selecting', false);
        var grid = new THREE.Vector3(gfx.rollOver.position.x / 50,
            gfx.rollOver.position.y / 50, (gfx.rollOver.position.z - 15) / 50);

        var controller = this.get('controller');

        if (gfx.pickingLocation) {
            gfx.location = gfx.rollOver.position;
            controller.send('setLocation', grid);
        } else {
            controller.store
                .find('room', {
                    x: grid.x,
                    y: grid.y,
                    z: grid.z
                })
                .then(function(d) {
                    if (d.content.length !== 1) return;
                    controller.transitionToRoute('room', d.content[0]);
                });
        }
    },

    resize: function() {
        var newWidth = $(this.get('element')).innerWidth(),
            newHeight = window.innerHeight - $('header').outerHeight(true);

        gfx.camera.aspect = newWidth / newHeight;
        gfx.camera.updateProjectionMatrix();
        gfx.renderer.setSize(newWidth, newHeight);
        render();
    }
});
