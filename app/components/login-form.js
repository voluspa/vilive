import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    authenticate() {
      const { username, password } = this.getProperties('username', 'password');

      this.get('session-manager')
          .login(username, password)
          .then(() => {
            this.setProperties({
              username: null,
              password: null,
              errors: null
            });
          })
          .catch((resp) => {
            this.set('password', null);
            this.set('errors', resp.errors);
          });
    }
  }
});
