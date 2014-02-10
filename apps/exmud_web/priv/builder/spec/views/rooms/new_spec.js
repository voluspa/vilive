/*jshint expr: true */
/*globals
  expect
  describe beforeEach afterEach it
  App visit
 */

describe('new room view', function() {
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

    function setLocation() {
        renderer.mouse2d(20, 25);
        click('div.world-viewer');
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

        beforeEach(function () {
            save = findInForm('[name=save]')[0];
        });


        it('disables the save button when there is no location', function (done) {
            fillIn('#roomTitle', 'A cold creepy cave');
            fillIn('#roomDescription', "It's so creepy.");
            wait()
            .then(function () {
                expect(save.disabled).to.be.true;
                done();
            });
        });

        it('disables the save button when there is no title', function (done) {
            setLocation();
            fillIn('#roomTitle', 'A cold creepy cave');
            wait()
            .then(function () {
                expect(save.disabled).to.be.true;
                done();
            });
        });

        it('disables the save button when there is no description', function (done) {
            setLocation();
            fillIn('#roomDescription', "It's so creepy.");
            wait()
            .then(function () {
                expect(save.disabled).to.be.true;
                done();
            });
        });

        it('enables the save button when the required fields are provided', function (done) {
            setLocation();
            fillIn('#roomTitle', 'A cold creepy cave');
            fillIn('#roomDescription', "It's so creepy.");
            wait()
            .then(function () {
                expect(save.disabled).to.be.false;
                done();
            });
        });
    });

    describe('when navigating away', function () {
        beforeEach(function() {
            fillIn('#roomTitle', 'A cold creepy cave');
            fillIn('#roomDescription', "It's so creepy.");
            visit('/');
        });

        it('removes the form', function() {
            expect(findForm().length).to.be.eql(0);
        });

        describe('then returning to the new room form', function() {
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

        it('removes the form', function() {
            expect(findForm().length).to.be.eql(0);
        });

        describe('then returning to the new room form', function() {
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

    describe('when saving', function () {
        var previousRoomCount,
            store;

        beforeEach(function(done) {
            store = getStore();
            store.find('room')
                 .then(function (data) {
                    previousRoomCount = data.content.length;

                    setLocation();
                    fillIn('#roomTitle', 'A cold creepy cave');
                    fillIn('#roomDescription', "It's so creepy.");
                    click('[name=save]');
                    wait().then(done);
                 });

        });

        it('increases the number of rooms', function (done) {
            store.find('room')
                 .then(function (data) {
                    expect(data.content.length).to.be.above(previousRoomCount);
                    done();
                 });
        });
    });
});
