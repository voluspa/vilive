import Ember from 'ember';
import GameChannel from 'vilive/utils/game-channel';

export default Ember.Component.extend({
  init() {
    this.set('messages', Ember.makeArray());
    // second argument is a function invoked once the initialization is done
    // onSocketError() is purposely left out, to ensure it's handled.
    GameChannel.init(this.get('session-manager').currentToken(), (err) =>{
      if (err) {
        console.log("error initializing game-channel", err);
        return;
      }

      GameChannel.on('event', payload => {
        this.addServerMessage(payload.message);
      });
      GameChannel.join();
    });
    GameChannel.onSocketError(() => { this.get('session-manager').invalidateSession(); });
    this._super(...arguments);
  },

  actions: {
    sendCommand() {
      const command = this.get('command');

      if (!command || command.length === 0) { return; }

      this.addClientMessage(command);

      GameChannel.push('player_cmd', {text: command});
      this.set('command', null);
    }
  },

  /**
    This does not fire after each message is inserted just when the component
    is inserted, in here we are going to focus on the text box.
  */
  didInsertElement() {
    this.$('#command-input').focus();
  },

  /**
    Need to scroll the div after the message has been rendered.
    otherwise it stops short and scroll to last message inserted
  */
  scrollToBottomMessages() {
    const div = this.$('.panel-body');
    Ember.run.schedule('afterRender', () => {
      div.scrollTop(div.prop("scrollHeight") - div.prop("clientHeight"));
    });
  },

  addClientMessage(text) {
    this.putMessage({
      cssClass: '',
      text: '> ' + text
    });
  },

  addServerMessage(text) {
    this.putMessage({
      cssClass: 'response',
      text: text
    });
  },

  putMessage(msg) {
    this.get('messages').pushObject(msg);
    this.scrollToBottomMessages();
  },

  willDestroy() {
    GameChannel.destroy();
  }
});
