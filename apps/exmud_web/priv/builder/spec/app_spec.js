/*jshint expr: true, globalstrict: false */
/*globals
  expect
  describe beforeEach afterEach it
  App visit
 */

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
                "x": 1,
                "y": 1,
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
});
