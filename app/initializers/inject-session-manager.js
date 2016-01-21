export function initialize(application) {
  application.inject('component', 'session-manager', 'service:session-manager');
}

export default {
  name: 'inject-session-manager',
  initialize,
};
