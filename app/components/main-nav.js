import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  session: service('session'),

  actions: {
    login() {
      this.sendAction('onLogin');
    },

    register() {
      this.sendAction('onRegister');
    },

    logout() {
      this.get('session').invalidate();
    }
  }
});
