export
default Ember.View.extend({
    classNames: ['world-viewer'],

    init: function() {
        var gfx = require('app/lib/world_renderer')['default']();

        if (this.get('pickingLocation')) {
            gfx.state('pickingLocation');
        } else {
            gfx.state('selectingObjects');
        }

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
        gfx.mouse2d.x = e.clientX;
        gfx.mouse2d.y = e.clientY;
    },

    mouseDown: function() {
        this.set('selecting', true);
    },

    mouseUp: function(e) {
        if (!this.get('selecting')) return;
        var gfx = this.get('gfx');

        this.set('selecting', false);
        var controller = this.get('controller'),
            grid = gfx.location;

        if (gfx.isPickingLocation()) {
            gfx.state('locationLocked');
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

        gfx.resize(newWidth, newHeight);
    }
});
