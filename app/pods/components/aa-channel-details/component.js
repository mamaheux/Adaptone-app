import Component from '@ember/component';
import {set} from '@ember/object';

export default Component.extend({
  channel: null,
  isParametric: true,

  parametricEqGraphValues: null,
  graphicEqGraphValues: null,

  userChannelVolume: 0,
  userChannelGain: 0,

  init() {
    this._super(...arguments);

    this.set('graphicEqGraphValues', {});

    this.set('channel', {
      seqId: 10,
      data: {
        channelId: 1,
        channelName: 'Master',
        gain: 6,
        volume: 60,
        isMuted: false,
        isSolo: false,
        paramEq: [
          {
            id: 0,
            on: true,
            freq: 100,
            q: 1,
            gain: -10
          },
          {
            id: 1,
            on: true,
            freq: 300,
            q: 5,
            gain: 5
          },
          {
            id: 2,
            on: true,
            freq: 800,
            q: 5,
            gain: -8
          },
          {
            id: 3,
            on: true,
            freq: 1500,
            q: 5,
            gain: 12
          },
          {
            id: 4,
            on: true,
            freq: 8000,
            q: 1,
            gain: 2
          }
        ],
        graphEq: [
          {
            id: 0,
            value: -3
          },
          {
            id: 0,
            value: 3
          },
          {
            id: 0,
            value: 6
          },
          {
            id: 0,
            value: 8
          },
          {
            id: 0,
            value: 10
          }
        ]
      }
    });
  },

  actions: {
    onVolumeChange(value) {
      // debounce(this, this.sendVolumeChange, channelVolume, DEBOUNCE_TIME)
      return value;
    },

    onGainChange(value) {
      // debounce(this, this.sendVolumeChange, channelVolume, DEBOUNCE_TIME)
      return value;
    },

    onIsMutedChange(value) {
      return value;
    },

    onIsSoloChange(value) {
      return value;
    },

    onFrequencyChange(value) {
      // debounce(this, this.sendVolumeChange, channelVolume, DEBOUNCE_TIME)
      return value;
    },

    onQChange(value) {
      // debounce(this, this.sendVolumeChange, channelVolume, DEBOUNCE_TIME)
      return value;
    },

    onOnOffChange(filter) {
      const filterToModify = this.get('channel').data.paramEq.find(f => f.id === filter.id);
      set(filterToModify, 'gain', 0);
    }
  }
});
