import Component from '@ember/component';

export default Component.extend({
  channels: null,
  positions: null,

  actions: {
    onChannelVolumeChange(channel) {
      // Handle channel volume change here
      return channel;
    },

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
