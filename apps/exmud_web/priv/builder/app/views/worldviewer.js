export
default Ember.View.extend({
    classNames: ['world-viewer'],

    init: function() {
        var gfx = require('app/lib/world_renderer')['default']();

        gfx.pickingLocation = this.get('picking');
        gfx.location = this.get('controller').get('lastLocation');

        this.set('gfx', gfx);

        this._super();
    },

    didInsertElement: function() {
        var self = this,
            $el = $(this.get('element')),
            gfx = this.get('gfx');

        this.set('$el', $el);

        this.set('windowResizeListener', this.resize.bind(this));
        $(window).on('resize', this.get('windowResizeListener'));

        $el.append(gfx.renderer.domElement);

        this.set('controlsChangeListener', this.viewChanged.bind(this));
        gfx.controls.addEventListener('change', this.get('controlsChangeListener'));

        this.resize();
    },

    willDestroyElement: function() {
        var gfx = this.get('gfx');
        $(window).off('resize', this.get('windowResizeListener'));
        gfx.controls.removeEventListener('change', this.get('controlsChangeListener'));
    },

    viewChanged: function() {
        this.set('selecting', false);
    },

    addCube: function(model) {
        var gfx = this.get('gfx'),
            c = gfx.modelsToCubes[model];
        if (c) return;

        c = new THREE.Mesh(gfx.cube.geometry, gfx.cube.material);
        c.position.set(50 * model.get('x'), 50 * model.get('y'), (50 * model.get('z')) + 15);
        gfx.scene.add(c);

        gfx.modelsToCubes[model] = c;
        gfx.cubesToModels[c] = model;
    },

    removeCube: function(model) {
        var gfx = this.get('gfx'),
            c = gfx.modelsToCubes[model];
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
        var gfx = this.get('gfx'),
            $el = this.get('$el');

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
        var gfx = this.get('gfx');

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
        var gfx = this.get('gfx'),
            newWidth = $(this.get('element')).innerWidth(),
            newHeight = window.innerHeight - $('header').outerHeight(true);

        gfx.camera.aspect = newWidth / newHeight;
        gfx.camera.updateProjectionMatrix();
        gfx.renderer.setSize(newWidth, newHeight);
    }
});
