import Ember from 'ember';
import ajax from 'ic-ajax';

export default function ajaxWrapper(opts) {
  opts.url = (Ember.ENV.serverUrl || '') + opts.url;
  return ajax(opts);
}
