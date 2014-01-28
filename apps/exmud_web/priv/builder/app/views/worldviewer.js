export
default Ember.View.extend({
    classNames: ['world-viewer'],

    init: function() {
        var gfx = require('app/lib/world_renderer')['default']();
        this.set('gfx', gfx);

        if (this.get('pickingLocation')) {
            gfx.state('pickingLocation');
        } else {
            gfx.state('selectingObjects');
        }

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

    renderRooms: function() {
        var self = this,
            rooms = this.get('controller')
                .get('model');

        rooms.forEach(function(room) {
            self.get('gfx').addRoom(room);
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
        gfx._updateRollovers();

        this.set('selecting', false);
        var controller = this.get('controller'),
            grid = gfx.location;

        if (gfx.isPickingLocation()) {
            gfx.state('locationLocked');
            controller.send('setLocation', grid);
        } else {
            //assuming all visible rooms are loaded
            var rooms = controller.store
                                  .filter('room', function (room) {
                                      var loc = room.get('location');
                                      return loc.x === grid.x &&
                                             loc.y === grid.y &&
                                             loc.z === grid.z;
                                  });

            if (rooms.content.length !== 1) return;
            controller.transitionToRoute('room', rooms.content[0]);
        }
    },

    resize: function() {
        var gfx = this.get('gfx'),
            newWidth = $(this.get('element')).innerWidth(),
            newHeight = window.innerHeight - $('header').outerHeight(true);

        gfx.resize(newWidth, newHeight);
    }
});
