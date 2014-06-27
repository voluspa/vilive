export default Ember.Controller.extend({
  reset: function () {
    this.set('username', '');
    this.set('password', '');
  }
});
