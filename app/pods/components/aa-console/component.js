import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  connection: service('connection'),

  channels: null,
  positions: null,

  init() {
    this._super(...arguments);
  },

  actions: {
    onChannelMuteChange(channel) {
      // Handle channel mute change here
      return channel;
    },

    onChannelSoloChange(channel) {
      // Handle channel solo change here
      return channel;
    }
  }
});
