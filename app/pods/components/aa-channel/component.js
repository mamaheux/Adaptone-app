import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';

import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;

export default Component.extend({
  connection: service('connection'),

  isAuxiliaryInput: computed('channel.data.isAuxiliaryInput', function() {
    return this.get('channel').data.isAuxiliaryInput === true;
  }),

  isAuxiliaryOutput: computed('channel.data.isAuxiliaryOutput', function() {
    return this.get('channel').data.isAuxiliaryOutput === true;
  }),

  isMasterOutput: computed('channel.data.isMasterOutput', function() {
    return this.get('channel').data.isMasterOutput === true;
  }),

  gainValue: computed('masterInputs', function() {
    const {masterInputs, channel} = this.getProperties('masterInputs', 'channel');

    let gain = channel.data.gain;

    if (masterInputs) {
      const masterInput = masterInputs.find(m => m.data.channelId === channel.data.channelId);
      gain = masterInput.data.gain;
    }

    return gain;
  }),

  channelVolumeChanged: observer('gainValue', function() {
    const gainValue = this.get('gainValue');
    const seqId = this._getVolumeSequenceId();
    const channelId = this.get('channel').data.channelId;

    const message = {
      seqId,
      data: {
        auxiliaryId: this.get('channel').data.auxiliaryId,
        channelId: channelId,
        gain: gainValue / 100
      }
    };

    const masterInputs = this.get('masterInputs');
    if (masterInputs) {
      masterInputs.find(mi => mi.data.channelId === channelId).data.gain = gainValue;
      this.set('masterInputs', masterInputs);
    } else {
      const channel = this.get('channel');
      channel.data.gain = gainValue;
      this.set('channel', channel);
    }

    debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
  }),

  stringifiedChannel: computed('channel', function() {
    return JSON.stringify(this.channel);
  }),

  _getVolumeSequenceId() {
    if (this.get('isAuxiliaryOutput')) return SequenceIds.CHANGE_AUX_VOLUME_OUTPUT;
    if (this.get('isMasterOutput')) return SequenceIds.CHANGE_MAIN_VOLUME_OUTPUT;
    if (this.get('isAuxiliaryInput')) return SequenceIds.CHANGE_AUX_VOLUME_INPUT;

    return SequenceIds.CHANGE_MAIN_VOLUME_INPUT;
  }
});
