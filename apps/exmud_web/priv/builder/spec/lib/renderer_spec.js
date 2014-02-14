/*jshint expr: true */
describe('world renderer', function () {
    var worldRenderer = require('app/lib/world_renderer');

    var renderer = worldRenderer.create();

    beforeEach(function () {
        renderer.resize(500, 500);
    });

    afterEach(function () {
        renderer.reset();
    });

    it('getRenderer only initializes once', function () {
        var renderer1 = worldRenderer.getRenderer(),
            renderer2 = worldRenderer.getRenderer();

        expect(renderer1).to.equal(renderer2);
    });

    it('defaults to selecting objects', function () {
        expect(renderer.isSelectingObjects()).to.be.true;
    });

    it('translate mouse coordinates to grid location in world', function () {
        renderer.mouse2d(53, 128);

        expect(renderer.location()).to.eql({
            x: -3,
            y: 2,
            z: 0
        });
    });

    describe('when selecting objects', function () {
        var room = Ember.Object.create({
            location: {
                x: 1,
                y: 1,
                z: 0
            }
        });

        beforeEach(function () {
            renderer.addRoom(room);
        });

        it('does not allow locking location when selecting objects', function () {
            expect(renderer.isSelectingObjects()).to.be.true;
            expect(function () {
                renderer.lockLocation();
            }).to.throw(Error);
        });

        it("gives back no selected object when the mouse isn't over one", function () {
            renderer.mouse2d(129, 324);
            expect(renderer.selectedObject()).to.not.be.ok;
        });

        it('returns the room as selected when the mouse is over it', function () {
            renderer.mouse2d(259, 254);
            expect(renderer.selectedObject().model).to.equal(room);
        });
    });

    describe('when picking location', function () {
        beforeEach(function () {
            renderer.pickLocation();
        });

        it('translate mouse coordinates to grid location in world', function () {
            renderer.mouse2d(53, 128);

            expect(renderer.location()).to.eql({
                x: -3,
                y: 2,
                z: 0
            });
        });

        it('allows locking the location', function () {
            renderer.mouse2d(153, 28);
            var location = renderer.location();

            renderer.lockLocation();

            renderer.mouse2d(253, 428);

            expect(renderer.location()).to.eql(location);
        });
    });

    describe('when location is locked', function () {
        beforeEach(function () {
            renderer.pickLocation();
            renderer.mouse2d(253, 428);
            renderer.lockLocation();
        });

        it('can go back to picking', function () {
            expect(function () {
                renderer.pickLocation();
            }).to.not.throw(Error);
        });

        it('can go back to selecting', function () {
            expect(function () {
                renderer.selectObjects();
            }).to.not.throw(Error);
        });
    });
});
