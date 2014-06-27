/*jshint expr: true */
describe('user login', function () {
  beforeEach(function () {
    visit('login');
  });

  afterEach(function () {
    App.reset();
  });

  it('renders a login form when visiting /login', function () {
    var form = find('form.login')[0];
    expect(form).to.be.ok;
    expect(form.hidden).to.not.be.ok;
  });

  it('clears fields when leaving and coming back', function () {
    fillIn('form.login .username', 'ralph');
    fillIn('form.login .password', 'ninja Skillz');
    visit('/');
    visit('login');
    andThen(function () {
      expect(find('.username', 'form.login').val()).to.be.empty;
      expect(find('.password', 'form.login').val()).to.be.empty;
    });
  });
});
