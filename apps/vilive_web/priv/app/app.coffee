`import Resolver from 'ember/resolver'`

Ember.ENV.LOG_MODULE_RESOLVER = true

Builder = Ember.Application.extend
  LOG_ACTIVE_GENERATION: true
  LOG_MODULE_RESOLVER: true
  LOG_TRANSITIONS: true
  LOG_TRANSITIONS_INTERNAL: true
  LOG_VIEW_LOOKUPS: true
  modulePrefix: 'app'
  Resolver: Resolver['default']

`export default Builder`
