import Ember from 'ember';
import ENV from 'vilive/config/environment';
import Base from 'ember-simple-auth/authenticators/base';

const { RSVP, run } = Ember;

export default Base.extend({
  /*
    https://github.com/simplabs/ember-simple-auth/blob/1.0.1/addon/authenticators/base.js#L86
    For now just assuming it's valid so the sesion isn't invalidated.

    Maybe in the future we have some route that verifies tokens,
    but I'm not sure it matters becuase if the hits a api that requires
    a token and it's invalid it will issue a 401 which will be handled
  */
  restore(data) {
    return new RSVP.Promise((resolve) => {
      resolve(data);
    });
  },

  /**
   * changed it up a bit, now it just takes a in request
   * that is constructed in the session manager.
   *
   * don't care how it was constructed but this request will return
   * the authentication token and username.
   */
  authenticate(request) {
    return new RSVP.Promise((resolve, reject) => {
      request.then((response) => {
        if (response.data) {
          run(null, resolve, {
            username: response.data.attributes.username,
            token: response.data.attributes.token
          });
        }
        else {
          // jsonapi could have meta data
          // probably should just pass the whole response
          //
          // also the serve may have return 200, but not json...
          // not sure what to do here to be robust yet...
          run(null, reject, response);
        }
      }, (xhr) => {
        console.log(xhr.responseJson || xhr.responseText);
        run(null, reject, xhr.responseJson || xhr.responseText);
      });
    });
  },

  makeRequest(data, path) {
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
});

