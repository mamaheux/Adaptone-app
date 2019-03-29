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

  init() {
    this._super(...arguments);
    this.set('channel', {
      seqId: 10,
      data: {
        channelId: 1,
        channelName: "Master",
        gain: 75,
        volume: 100,
        isMuted: false,
        isSolo: false,
        paramEq: [
          {
            id: 0,
            on: true,
            freq:  1000,
            q: 4.4,
            gain: 20
          }
        ],
        graphEq: [
          {
            id: 0,
            value: -10
          },
          {
            id: 1,
            value: 2
          },
          {
            id: 2,
            value: 11
          }
        ]
      }
    });
  },

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
