/* globals blanket, module */

var options = {
  modulePrefix: 'vilive',
  filter: '//.*vilive/.*/',
  antifilter: '//.*(tests|session-stores|template|initializers|services/session$|services/ajax|helpers|controllers/object|controllers/array|app-version|utils/phoenix|config/environment).*/',
  loaderExclusions: [],
  enableCoverage: true,
  cliOptions: {
    lcovOptions: {
      outputFile: 'lcov.data',
      renamer: function(moduleName) {
        var expression = /^vilive/;
        return moduleName.replace(expression, 'app') + '.js';
      }
    },
    reporters: ['lcov'],
    autostart: true
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
