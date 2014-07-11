import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
import { defineFixture as defineAjaxFixture } from "ic-ajax";

var App;
module('integration: User login', {
  setup: function () {
    App = startApp();
  },
  teardown: function () {
    Ember.run(App, App.destroy);
  }
});

test('renders a login form when visiting /login', function () {
  expect(1);
  visit('login').then(function () {
    equal(find('form.login').length, 1);
  });
});

test('when visiting /login no validation errors are visible', function () {
  expect(1);
  visit('login').then(function () {
    equal(find('.error-message', 'form.login').length, 0);
  });
});

test('input fields are cleared when leaving and returning', function () {
  expect(3);

  visit('login');
  fillIn('form.login .username', 'ralph');
  fillIn('form.login .password', 'ninja Skillz');
  visit('/');
  visit('login');
  andThen(function () {
    equal(find('.username', 'form.login').val(), '');
    equal(find('.password', 'form.login').val(), '');
    equal(find('.error-message', 'form.login').length, 0);
  });
});

test('requires a username to be entered', function () {
  expect(1);

  visit('login');
  fillIn('form.login .password', 'ninja Skillz');
  click('form.login .submit');
  andThen(function () {
    equal(find('.username.error-message', 'form.login').length, 1);
  });
});

test('clears the username error when the user types in the username input', function () {
  expect(1);

  visit('login');
  click('form.login .submit');
  fillIn('form.login .username', 'ralph');
  andThen(function () {
    equal(find('.username.error-message', 'form.login').length, 0);
  });
});

test('requires a password to be entered', function () {
  expect(1);

  visit('login');
  fillIn('form.login .username', 'ralph');
  click('form.login .submit');
  andThen(function () {
    equal(find('.password.error-message', 'form.login').length, 1);
  });
});

test('clears the password error when the user types in the password input', function () {
  expect(1);

  visit('login');
  click('form.login .submit');
  fillIn('form.login .password', 'ninja Skillz');
  andThen(function () {
    equal(find('.password.error-message', 'form.login').length, 0);
  });
});

test('displays an error if the server returns one', function () {
  expect(1);

  visit('login');
  fillIn('form.login .username', 'login-error-user');
  fillIn('form.login .password', 'login-error-user');
  click('form.login .submit');
  andThen(function () {
    equal(find('.error-message', 'form.login').length, 1);
  });
});

test("redirects to /worlds on success when there isn't a stored transition", function () {
  expect(1);

  visit('login');
  fillIn('form.login .username', 'login-success-user');
  fillIn('form.login .password', 'login-success-user');
  click('form.login .submit');
  andThen(function () {
    equal(currentRouteName(), 'worlds');
  });
});
