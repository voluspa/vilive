/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      //we override the host for ajax calls and enable CORS support
      //in the ember server. this allows the ember test command to
      //run tests that hit ember server enabling tests to hit the api stub
      serverUrl: 'http://localhost:4200',
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };


  if (environment === 'development') {
    // LOG_MODULE_RESOLVER is needed for pre-1.6.0
    ENV.LOG_MODULE_RESOLVER = true;

    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_MODULE_RESOLVER = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'production') {
    ENV.EmberENV.serverUrl = '';
  }

  return ENV;
};
