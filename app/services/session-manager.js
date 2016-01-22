import Ember from 'ember';
import ENV from 'vilive/config/environment';

const { service } = Ember.inject;

/**
 * makeRequest and authenticate should not be called
 * outside this module, therfore I defined them here and
 * didn't export them. Keeps things cleaner I think
 */
function makeRequest(data, path) {
  return Ember.$.ajax({
    url: ENV.yggdrasil.endpoint + path,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(data),
    beforeSend(xhr) {
      xhr.setRequestHeader('Accept', 'application/vnd.api+json');
      xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    }
  });
}

/**
 * session is being explicitly passed in here
 * because using service('session') directly
 * doesn't jive well. It's an injected property
 * and some ember majic is done.
 *
 * so left it on the service below and passed it in.
 */
function authenticate(session, user, path) {
  const req = makeRequest(user, path); 
  return session.authenticate('authenticator:yggdrasil', req);
}

export default Ember.Service.extend({
  session: service('session'),

  login(username, password) {
    const user = {
      data: {
        type: "users",
        attributes: {
          username: username,
          password: password
        }
      }
    };

    return authenticate(this.get('session'), user, ENV.yggdrasil.loginPath); 
  },

  register(username, password, password_confirmation) {
    const user = {
      data: {
        type: "users",
        attributes: {
          username: username,
          password: password,
          password_confirmation: password_confirmation
        }
      }
    };

    return authenticate(this.get('session'), user, ENV.yggdrasil.registerPath); 
  },

  invalidateSession() {
    this.get('session').invalidate();
  },

  currentToken() {
    return this.get('session.data.authenticated.token');
  }
});
