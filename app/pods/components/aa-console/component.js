import Component from '@ember/component';

export default Component.extend({
  channels: null,
  positions: null,

  actions: {
    onChannelVolumeChange(channel) {
      // Handle channel volume change here
    },

    onChannelMuteChange(channel) {
      // Handle channel mute change here
    },

    onChannelSoloChange(channel) {
      // Handle channel solo change here
    }
  }
});
