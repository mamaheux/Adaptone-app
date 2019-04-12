import Component from '@ember/component';
import {observer} from '@ember/object';

export default Component.extend({
  channel: null,
  isParametric: true,
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
      Ember.set(filterToModify, 'gain', 0);
    }
  }
});
