import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    authenticate() {
      const { username,
              password,
              password_confirmation  } = this.getProperties('username',
                                                            'password',
                                                            'password_confirmation');

      this.get('session-manager')
          .register(username, password, password_confirmation)
          .then(() => {
            this.setProperties({
              username: null,
              password: null,
              errors: null
            });
          })
          .catch((resp) => {
            this.set('password', null);
            this.set('password_confirmation', null);

            let humanized = resp.errors.map((err) => {
              let field = err.source.pointer.split('/').reverse()[0];
              field = field.replace('password-confirmation', 'confirm password');

              err.source.pointer = field;
              return err;
            });

            this.set('errors', humanized);
          });
    }
  }
});
