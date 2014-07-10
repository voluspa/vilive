/*jshint expr: true */

import { defineFixture as defineAjaxFixture } from "app/lib/ajax";
import loginFixture from "spec/fixtures/login/success";

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

  it('no validation errors appear when visiting /login', function () {
    expect(find('.error-message', 'form.login').text()).to.be.empty;
    expect(find('.alert', 'form.login').text()).to.be.empty;
  });

  it('clears fields when leaving and coming back', function () {
    fillIn('form.login .username', 'ralph');
    fillIn('form.login .password', 'ninja Skillz');
    visit('/');
    visit('login');
    andThen(function () {
      expect(find('.username', 'form.login').val()).to.be.empty;
      expect(find('.password', 'form.login').val()).to.be.empty;
      expect(find('.error-message', 'form.login').text()).to.be.empty;
      expect(find('.alert', 'form.login').text()).to.be.empty;
    });
  });

  it('requires a username to be entered', function () {
    fillIn('form.login .password', 'ninja Skillz');
    click('form.login .submit');
    andThen(function () {
      var errMsg = find('.username.error-message', 'form.login');
      expect(errMsg.text()).to.not.be.empty;
    });
  });

  it('clears the username error when the user types in the username input', function () {
    click('form.login .submit');
    fillIn('form.login .username', 'ralph');
    andThen(function () {
      var errMsg = find('.username.error-message', 'form.login');
      expect(errMsg.text()).to.be.empty;
    });
  });

  it('requires a password to be entered', function () {
    fillIn('form.login .username', 'ralph');
    click('form.login .submit');
    andThen(function () {
      var errMsg = find('.password.error-message', 'form.login');
      expect(errMsg.text()).to.not.be.empty;
    });
  });

  it('clears the password error when the user types in the password input', function () {
    click('form.login .submit');
    fillIn('form.login .password', 'ninja Skillz');
    andThen(function () {
      var errMsg = find('.password.error-message', 'form.login');
      expect(errMsg.text()).to.be.empty;
    });
  });

  it('displays an error if the server returns one', function () {
    defineAjaxFixture('/api/login', {
      response: null,
      textStatus: 'error',
      jqXHR: { responseJSON: { error: "Username/Password is invalid" } }
    });

    fillIn('form.login .username', 'login-error-user');
    fillIn('form.login .password', 'login-error-user');
    click('form.login .submit');
    andThen(function () {
      var errMsg = find('.alert', 'form.login');
      expect(errMsg.text()).to.not.be.empty;
    });
  });

  it("redirects to /worlds on success when there isn't a stored transition", function () {
    defineAjaxFixture('/api/login', {
      response: loginFixture,
      textStatus: 'success',
      jqXHR: { }
    });

    fillIn('form.login .username', 'login-success-user');
    fillIn('form.login .password', 'login-success-user');
    click('form.login .submit');
    andThen(function () {
      expect(currentRouteName()).to.be.eql('worlds');
    });
  });
});
