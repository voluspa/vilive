/*jshint expr: true, globalstrict: false */
/*globals
  describe beforeEach afterEach it
  App visit
 */

var expect = chai.expect;

describe('mocha with ember testing', function() {
    "use strict";

    beforeEach(function() {
        visit('/');
    });

    afterEach(function() {
        App.reset();
    });
});
