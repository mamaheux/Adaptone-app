import Component from '@ember/component';
import {set} from '@ember/object';

export default Component.extend({
  isParametric: true,

  parametricEqGraphValues: null,
  graphicEqGraphValues: null,

  userChannelVolume: 0,
  userChannelGain: 0,

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
