import Component from '@ember/component';
import {observer} from '@ember/object';

export default Component.extend({
  channel: null,
  isParametric: true,

  userChannelVolume: 0,
  userChannelGain: 0,

  graphEqChange: observer('channel.data.graphEq.@each.value', function() {
    return this.channel.data.graphEq;
  }),

  actions: {
    onVolumeChange(value) {
      return value;
    },

    onGainChange(value) {
      return value;
    },

    onIsMutedChange(value) {
      return value;
    },

    onIsSoloChange(value) {
      return value;
    },

    onFrequencyChange(value) {
      return value;
    },

    onGainChange(value) {
      return value;
    },

    onQChange(value) {
      return value;
    }
  }
});
