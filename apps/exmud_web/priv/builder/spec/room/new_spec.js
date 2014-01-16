/*jshint expr: true */
/*globals
  expect
  describe beforeEach afterEach it
  App visit
 */

describe('creating a new room', function() {

    function emptyInput(input) {
        expect(input).to.be.an.instanceof(HTMLInputElement);
        expect(input.value).to.be.empty;
        return true;
    }

    beforeEach(function() {
        visit('/rooms/new');
    });

    it('displays a blank form', function() {
        expect(find('#new-room')).to.be.not.empty;
    });

    it('has a title input', function() {
        var roomTitle = find('#roomTitle')[0];
        expect(roomTitle).to.satisfy(emptyInput);
    });

    it('has a description input', function() {
        var roomDescription = find('#roomDescription')[0];
        expect(roomDescription).to.be.an.instanceof(HTMLTextAreaElement);
        expect(roomDescription.value).to.be.empty;
    });

    describe('when canceling', function() {
        beforeEach(function() {
            click('[name=cancel]', find('#new-room'));
        });

        it('removes the form', function() {
            expect(find('#new-room').length).to.be.eql(0);
        });
    });
});
