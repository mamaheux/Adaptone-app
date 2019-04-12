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

    onQChange(value) {
      return value;
    },

    onOnOffChange(filter) {
      const filterToModify = this.get('channel').data.paramEq.find(f => f.id === filter.id);
      set(filterToModify, 'gain', 0);
    }
  }
});
