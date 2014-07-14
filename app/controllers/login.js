import Ember from 'ember';
import ajax from '../lib/ajax';

export default Ember.Controller.extend({
  errors: Ember.Object.create(),

  isValid: function () {
    var usernameValid = this.onUsernameChange().length === 0,
        passwordValid = this.onPasswordChange().length === 0;

    return usernameValid && passwordValid;
  },

  onUsernameChange: function () {
    var username = this.get('username'),
        errors = this.getWithDefault('errors.username', []);

    //reset errors
    errors = [];
    if (!username) {
      errors = ['Username is required'];
    }

    this.set('errors.username', errors);
    return errors;
  }.observes('username'),

  onPasswordChange: function () {
    var password = this.get('password'),
        errors = this.getWithDefault('errors.password', []);

    //reset errors
    errors = [];
    if (!password) {
      errors = ['Password is required'];
    }

    this.set('errors.password', errors);
    return errors;
  }.observes('password'),

  actions: {
    login: function () {
      if (!this.isValid()) {
        return;
      }

      var self = this,
          creds = this.getProperties('username', 'password');

      this.set('errors.login', []);


      ajax({
          method: 'POST',
          url: '/api/login',
          data: creds
      }).then(
        function onSuccess(data) {
          self.set('session', data.response);
          self.transitionToRoute('worlds');
        },
        function onError(data) {
          self.set('errors.login', [data.jqXHR.responseJSON.error]);
        });
    }
  },

  reset: function () {
    this.set('username', '');
    this.set('password', '');
    this.set('errors', Ember.Object.create());
  }
});
