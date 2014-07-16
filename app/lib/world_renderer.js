import Ember from 'ember';
import Room from 'vilive/models/room';

function WorldRenderer() {
    var self = this;

    //need some measurements to start off with
    var width = window.innerWidth,
        height = window.innerHeight - Ember.$('header').outerHeight(true);

    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.projector = new THREE.Projector();
    this.raycaster = new THREE.Raycaster();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this.camera.position.set(0, 0, 500);
    this.scene.add(this.camera);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0xffffff, 1);
    this.$el = Ember.$(this.renderer.domElement);
    this.width = this.$el.innerWidth();
    this.height = this.$el.innerHeight();
    this.offset = this.$el.offset();

    this.cubeSize = 30;
    this.gridStepSize = 50;
    this.normalMatrix = new THREE.Matrix3();
    this.modelsToCubes = {};
    this.cubesToModels = {};
    this._mouse2d = new THREE.Vector3(0, 10000, 0.5);
    this._location = {
        x: 0,
        y: 0,
        z: 0
    };

    this.light = {
        ambient: new THREE.AmbientLight(0x404040),
        top: new THREE.DirectionalLight(0xaaaaaa),
        bottom: new THREE.DirectionalLight(0x777777)
    };

    this.light.ambient.position.set(0, 0, 10000);
    this.light.top.position.set(1, 1, 1);
    this.light.bottom.position.set(-1, -1, -1);

    Object.keys(this.light)
          .forEach(function (key) {
              self.scene.add(self.light[key]);
          });

    this.axis = new THREE.AxisHelper(100);
    this.axis.position.set(0, 0, 0);
    this.scene.add(this.axis);

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
    shadowCube.position.set(0,0,10000);
    this.scene.add(shadowCube);

    this.cube = {
        shadow: shadowCube,
        //hmmm i have to create a new cube geometry here, trying to reuse the shadow one
        //causes invalid operation webgl errors
        geometry: new THREE.CubeGeometry(this.cubeSize,
                                         this.cubeSize,
                                         this.cubeSize)
    };

    //this is used for intersection detection on the grid
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000),
                               new THREE.MeshBasicMaterial({
                                   color: 0x444444,
                                   opacity: 0.15,
                                   transparent: true
                               }));
    //plane.visible = false;
    plane.position.set(0, 0, -(this.cubeSize / 2));
    this.scene.add(plane);
    this.plane = plane;

    this.selectObjects();
    this.animate();
}

WorldRenderer.prototype = {
    _snapToGrid: function (x) {
        var n = x;
        //negate it so the offset and floor work as expected
        if (x < 0) {
          n = -n;
        }

        //grid is cenetered on origin so we have to offset 
        //the coordinate first before snapping to grid
        n = n + (this.gridStepSize / 2);
        var grid =  Math.floor(n / this.gridStepSize) * this.gridStepSize;

        if(x < 0) {
          return -grid;
        }

        return grid;
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

        pos.x = this._snapToGrid(pos.x);
        pos.y = this._snapToGrid(pos.y);
        pos.z = this._snapToGrid(pos.z);

        return pos;
    },

    _clientToNDC: function (coords) {
        //calculate normalized device coordinates (-1 to 1)
        var ndc = new THREE.Vector3();

        ndc.x = ((coords.x - this.offset.left) / this.width) * 2 - 1;
        ndc.y = -((coords.y - this.offset.top) / this.height) * 2 + 1;

        return ndc;
    },

    _getIntersectors: function () {
        var vector = this._clientToNDC(this._mouse2d);
        vector.z = 1;

        this.projector.unprojectVector(vector, this.camera);
        vector.sub(this.camera.position).normalize();

        this.raycaster.set(this.camera.position, vector);

        return this.raycaster.intersectObjects(this.scene.children, true);
    },

    _getRealIntersector: function(intersects) {
        var intersector;

        for (var i = 0; i < intersects.length; i++) {
            intersector = intersects[i];

            if (intersector.object !== this.cube.shadow &&
                intersector.object !== this.axis) {
                return intersector;
            }
        }

        return null;
    },

    _highlightObject: function (intersector) {
        var obj = null;
        if (intersector && intersector.object !== this.plane) obj = intersector.object;

        //clear previous
        if (this._highlighted) {
            this._highlighted.material.emissive.setHex(this._highlighted.origHex);
            this._selected = null;
        }

        this._highlighted = obj;

        if (!obj) return;
        this._selected = obj.userData;
        this._highlighted.origHex = obj.material.emissive.getHex();
        this._highlighted.material.emissive.setHex(0xff0000);
    },

    _updateRollovers: function () {
        if (!this._mouseChange) return;
        this._mouseChange = false;

        var intersections = this._getIntersectors(),
            intersector = this._getRealIntersector(intersections),
            pos;

        this._highlightObject(intersector);

        if (!intersector) return;
        pos = this._calculateGridPosition(intersector);
        if (pos) {
            if (this.cube.shadow.visible) {
                this.cube.shadow.position = pos;
            }

            this._location.x = pos.x / this.gridStepSize;
            this._location.y = pos.y / this.gridStepSize;
            this._location.z = pos.z / this.gridStepSize;
        }
    },

    _render: function() {
        if (!this.isLocationLocked()) {
            this._updateRollovers();
        }

        this.renderer.render(this.scene, this.camera);
    },

    mouse2d: function (x, y) {
        this._mouseChange = true;
        this._mouse2d.x = x;
        this._mouse2d.y = y;
    },

    location: function () {
        if (this._mouseChange) {
            this._updateRollovers();
        }

        return this._location;
    },

    selectedObject: function () {
        if (this._mouseChange) {
            this._updateRollovers();
        }

        return this._selected;
    },

    isPickingLocation: function() {
        return this._state === 'pickingLocation';
    },

    pickLocation: function () {
        this._state = 'pickingLocation';
        this.cube.shadow.visible = true;
    },

    isLocationLocked: function() {
        return this._state === 'locationLocked';
    },

    lockLocation: function () {
        if (this._state !== 'pickingLocation') {
            throw new Error('You can only lock the location when you were picking one');
        }

        this._state = 'locationLocked';
    },

    isSelectingObjects: function() {
        return this._state === 'selectingObjects';
    },

    selectObjects: function () {
        this._state = 'selectingObjects';
        this.cube.shadow.visible = false;
        this.cube.shadow.position.set(0,0,10000);
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

    focus: function(model) {
        if (!model) return this._focus;

        if (this._focus) {
            this._focus.traverse(function (obj) {
                if (obj.userData.type === 'exit') {
                    obj.visible = false;
                }
            });
        }

        this._focus = null;

        var c = this.modelsToCubes[model];
        if (!c) return this._focus;

        this._focus = c;
        this._focus.traverse(function (obj) {
            if (obj.userData.type === 'exit') {
                obj.visible = true;
            }
        });
        this.camera.lookAt(c.position);

        return this._focus;
    },

    addRoom: function(model) {
        var cubeSize = this.cubeSize,
            gridStepSize = this.gridStepSize,
            c = this.modelsToCubes[model],
            loc;

        if (c) return;
        c = new THREE.Object3D();
        loc = model.get('location');

        c.position.x = loc.x * gridStepSize;
        c.position.y = loc.y * gridStepSize;
        c.position.z = loc.z * gridStepSize;

        var cube = new THREE.Mesh(this.cube.geometry,
                                  new THREE.MeshLambertMaterial({
                                      emissive: 0x22ff22
                                  }));
        cube.userData = {
            type: 'room',
            model: model
        };
        c.add(cube);

        Room.EXITS.forEach(function (direction) {
            var exit = new THREE.Mesh(new THREE.CubeGeometry(5, 10, 5),
                                       new THREE.MeshLambertMaterial({
                                           emissive: 0x000000
                                       }));
            exit.visible = false;

            exit.userData = {
                type: 'exit',
                model: null, //an 'open' exit
                direction: direction,
                room: model,
                reverse: null, //reverse of east is west, etc
                target: {
                    x: c.position.x,
                    y: c.position.y,
                    z: c.position.z
                }
            };

            //would be neat to map direction to degrees and calculate everything
            switch(direction) {
                case 'north':
                    exit.position.y = cubeSize / 1.5;

                    exit.userData.target.y += 1;
                    exit.userData.reverse = 'south';
                    break;
                case 'east':
                    exit.position.x = cubeSize / 1.5;
                    exit.rotation.z = Math.PI / 2;

                    exit.userData.target.x += 1;
                    exit.userData.reverse = 'west';
                    break;
                case 'south':
                    exit.position.y = -cubeSize / 1.5;

                    exit.userData.target.y -= 1;
                    exit.userData.reverse = 'north';
                    break;
                case 'west':
                    exit.position.x = -cubeSize / 1.5;
                    exit.rotation.z = Math.PI / 2;

                    exit.userData.target.x -= 1;
                    exit.userData.reverse = 'east';
                    break;
            }

            c.add(exit);
        });


        this.scene.add(c);

        this.modelsToCubes[model] = c;
        this.cubesToModels[c] = model;
    },

    reset: function () {
        var self = this;

        Object.keys(this.cubesToModels)
              .forEach(function (cube) {
                  self.scene.remove(cube);
              });

        this.selectObjects();
        this.modelsToCubes = {};
        this.cubesToModels = {};
    }
};

//initialize only once
var gfx = null;

export
function getRenderer() {
    if (gfx === null) gfx = new WorldRenderer();
    return gfx;
}

export
function create() {
    return new WorldRenderer();
}
