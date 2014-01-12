/*jshint expr: true, globalstrict: false */
/*globals
  describe beforeEach afterEach it
  App visit
 */

var expect = chai.expect;

describe('when no rooms exist', function() {

    beforeEach(function() {
        setFixtures('room', []);
        visit('/');
    });

    it('displays help information', function() {
        expect(find('.help'))
            .to.have.length(1);
    });
});
