/*jshint expr: true, globalstrict: false */
/*globals
  expect
  describe beforeEach afterEach it
  App visit
 */

describe('the world view', function () {
    describe('when no rooms exist', function() {
        var renderer = require('app/lib/world_renderer').getRenderer();

        beforeEach(function(done) {
            setFixtures('room', []);
            visit('/').then(done);
        });

        afterEach(function() {
            App.reset();
            renderer.reset();
        });

        it('displays help information', function() {
            expect(find('.help')).to.have.length(1);
        });
    });

    describe('when rooms exist', function() {
        beforeEach(function (done) {
            setFixtures('room', [
                {
                  "title": "A dark cave",
                  "description": "Seriously bring a torch.",
                  "location": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                  },
                  "id": 1
                }
            ]);

            visit('/').then(done);
        });

        afterEach(function() {
            App.reset();
        });

        it('renders the world', function () {
            expect(find('.world-viewer')).to.have.length(1);
        });

        describe('when a user clicks a room', function () {
            var renderer = require('app/lib/world_renderer').getRenderer();

            beforeEach(function () {
                //gotta size it ourselves so that we know how many pixels we are working with
                renderer.resize(500, 500);
                //select the room
                renderer.mouse2d(250, 250);
                click('div.world-viewer');
            });

            it('displays the room form', function () {
                expect(find('form.room')).to.have.length(1);
            });
        });
    });
});
