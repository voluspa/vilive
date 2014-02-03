var worldRenderer = require('app/lib/world_renderer')['default'];

describe('world renderer', function () {
    it('only initializes once', function () {
        var world1 = worldRenderer(),
            world2 = worldRenderer();

        expect(world1).to.be(world2);
    });
});
