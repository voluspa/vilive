/*jshint expr: true */
/*globals
  expect
  describe beforeEach afterEach it
  App visit
 */

describe('creating a new room', function() {
    var renderer = require('app/lib/world_renderer').getRenderer();

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
        visit('/rooms/new');
    });

    afterEach(function() {
        App.reset();
        renderer.reset();
    });

    it('displays a blank form', function() {
        expect(findForm()).to.be.not.empty;
    });

    it('has a space for the id', function() {
        var id = findInForm('#roomId')[0];
        expect(id).to.be.ok;
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

    describe('when filling out the room details', function () {
        var save;

        function setLocation() {
            renderer.mouse2d(20, 25);
            click('div.world-viewer');
        }

        beforeEach(function () {
            save = findInForm('[name=save]')[0];
        });

        describe('with room title and description given', function () {
            beforeEach(function (){
                fillIn('#roomTitle', 'A cold creepy cave');
                fillIn('#roomDescription', "It's so creepy.");
            });

            it('disables the save button when there is no location', function () {
                expect(save.disabled).to.be.true;
            });
        });


        describe('with the location and title given', function () {
            beforeEach(function () {
                setLocation();
                fillIn('#roomTitle', 'A cold creepy cave');
            });

            it('disables the save button when there is no title', function () {
                expect(save.disabled).to.be.true;
            });
        });

        describe('with the location and description given', function () {
            beforeEach(function () {
                setLocation();
                fillIn('#roomDescription', "It's so creepy.");
            });

            it('disables the save button when there is no description', function () {
                expect(save.disabled).to.be.true;
            });
        });


        describe('with title, description, and location given', function() {
            beforeEach(function () {
                setLocation();
                fillIn('#roomTitle', 'A cold creepy cave');
                fillIn('#roomDescription', "It's so creepy.");
            });

            it('enables the save button when the required fields are provided', function () {
                expect(save.disabled).to.be.false;
            });
        });
    });

    describe('when navigating away', function () {
        beforeEach(function() {
            fillIn('#roomTitle', 'A cold creepy cave');
            fillIn('#roomDescription', "It's so creepy.");
            visit('/');
        });

        afterEach(function() {
            App.reset();
        });

        it('removes the form', function() {
            expect(findForm().length).to.be.eql(0);
        });

        describe('then creating a new room afterwards', function() {
            beforeEach(function() {
                visit('/rooms/new');
            });

            it('all the fields are cleared', function() {
                var roomTitle = findInForm('#roomTitle')[0];
                expect(roomTitle).to.satisfy(emptyInput);

                var roomDescription = findInForm('#roomDescription')[0];
                expect(roomDescription).to.be.an.instanceof(HTMLTextAreaElement);
                expect(roomDescription.value).to.be.empty;
            });
        });
    });

    describe('when canceling', function() {
        beforeEach(function() {
            fillIn('#roomTitle', 'A cold creepy cave');
            fillIn('#roomDescription', "It's so creepy.");
            click('[name=cancel]');
        });

        afterEach(function() {
            App.reset();
        });

        it('removes the form', function() {
            expect(findForm().length).to.be.eql(0);
        });

        describe('then creating a new room afterwards', function() {
            beforeEach(function() {
                visit('/rooms/new');
            });

            it('all the fields are cleared', function() {
                var roomTitle = findInForm('#roomTitle')[0];
                expect(roomTitle).to.satisfy(emptyInput);

                var roomDescription = findInForm('#roomDescription')[0];
                expect(roomDescription).to.be.an.instanceof(HTMLTextAreaElement);
                expect(roomDescription.value).to.be.empty;
            });
        });
    });
});
