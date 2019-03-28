import Component from '@ember/component';

export default Component.extend({
  channel: null,
  isParametric: true,

  channelVolume: 0,
  channelGain: 0,

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
            value: 50
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
    }
  }
});
