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

    function findForm() {
        return find('form.room');
    }

    function findInForm(selector) {
        return find(selector, findForm());
    }

    beforeEach(function() {
        visit('/room/new');
    });

    it('displays a blank form', function() {
        expect(findForm()).to.be.not.empty;
    });

    it('has a title input', function() {
        var roomTitle = findInForm('#roomTitle')[0];
        expect(roomTitle).to.satisfy(emptyInput);
    });

    it('has a description input', function() {
        var roomDescription = findInForm('#roomDescription')[0];
        expect(roomDescription).to.be.an.instanceof(HTMLTextAreaElement);
        expect(roomDescription.value).to.be.empty;
    });

    describe('when canceling', function() {
        beforeEach(function() {
            click('[name=cancel]');
        });

        it('removes the form', function() {
            expect(findForm().length).to.be.eql(0);
        });

        describe('creating a new room afterwards', function() {
            beforeEach(function() {
                visit('/room/new');
            });

            it('cleared all the fields', function() {
                var roomTitle = findInForm('#roomTitle')[0];
                expect(roomTitle).to.satisfy(emptyInput);

                var roomDescription = findInForm('#roomDescription')[0];
                expect(roomDescription).to.be.an.instanceof(HTMLTextAreaElement);
                expect(roomDescription.value).to.be.empty;
            });
        });
    });
});
