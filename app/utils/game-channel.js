import { Socket } from 'vilive/utils/phoenix';
import ENV from 'vilive/config/environment';

let socket = null;
let game_channel = null;
let player_channel = null;

export default {
  init (token, done) {
    socket = new Socket(ENV.yggdrasil.socket + '/socket',
                        {params: {token: token}});
    socket.connect();
    socket.onError((err) => { console.log("socket error", err); });

    // Now that you are connected, you can join channels with a topic:
    game_channel = socket.channel("game:lobby");
    game_channel.join()
      .receive("ok", resp => {
        player_channel = socket.channel(resp.topic);
        player_channel.join()
          .receive("ok", resp => { done(null, resp); })
          .receive("error", resp => { done(new Error(resp.error)); });
      });
  },

  push (message, payload) {
    player_channel.push(message, payload);
  },

  on (event, callback) {
    game_channel.on(event, callback);
    player_channel.on(event, callback);
  },

  join () {
    player_channel.push("join_game");
  },

  onSocketError(callback) {
    socket.onError(callback);
  },

  destroy() {
    console.log('destroyed game object');
    game_channel.disconnect();
    player_channel.disconnect();
  }
};
