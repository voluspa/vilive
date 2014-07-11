import Ember from 'ember';

var Router = Ember.Router.extend({
  location: ViliveENV.locationType
});

Router.map(function() {
  this.route('login');
  this.route('worlds');
});

export default Router;
