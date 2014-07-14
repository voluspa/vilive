import Ember from 'ember';
import DS from 'ember-data';

console.log(Ember.ENV.serverUrl);

export default DS.RESTAdapter.extend({
    namespace: 'api',
    host: Ember.ENV.serverUrl || ''
});
