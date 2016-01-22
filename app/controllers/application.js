import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    transitionToLoginRoute() {
      this.transitionToRoute('login');
    },
    transitionToRegisterRoute() {
      this.transitionToRoute('register');
    }
  }
});
