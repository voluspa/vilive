import { getRenderer } from 'app/lib/world_renderer';

export
default Ember.View.extend({
    classNames: ['world-viewer'],
    rooms: Ember.computed.alias('controller.model'),

    init: function() {
        var gfx = getRenderer();
        this.set('gfx', gfx);

        this.setState();

        this._super();
    },

    setState: function () {
        var gfx = this.get('gfx');
        if (this.get('controller.pickingLocation')) {
            gfx.pickLocation();
            if (this.get('controller.location')) {
                gfx.lockLocation();
            }
        } else {
            gfx.selectObjects();
        }
    }.observes('controller.pickingLocation', 'controller.location'),

    focus: function () {
        var gfx = this.get('gfx');
        gfx.focus(this.get('controller.focus'));
    }.observes('controller.focus'),

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

    renderRooms: function() {
        var self = this,
            rooms = this.get('rooms');

        rooms.forEach(function(room) {
            self.get('gfx').addRoom(room);
        });
    }.observes('rooms.[]').on('init'),

    mouseMove: function(e) {
        var gfx = this.get('gfx'),
            $el = this.get('$el');

        e.preventDefault();
        gfx.mouse2d(e.clientX, e.clientY);
    },

    mouseDown: function() {
        this.set('selecting', true);
    },

    mouseUp: function(e) {
        if (!this.get('selecting')) return;
        var gfx = this.get('gfx'),
            controller = this.get('controller'),
            selectedObject = gfx.selectedObject();

        this.set('selecting', false);

        if (gfx.isPickingLocation()) {
            gfx.lockLocation();
            controller.set('location', gfx.location());
        } else if (selectedObject){
            controller.send('selected', selectedObject);
        }
    },

    resize: function() {
        var gfx = this.get('gfx'),
            newWidth = $(this.get('element')).innerWidth(),
            newHeight = window.innerHeight - $('header').outerHeight(true);

        gfx.resize(newWidth, newHeight);
    }
});
