import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';

import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;
const WRITE_IN_SESSION_DEBOUNCE_TIME = 20;
const GAIN_MAX_VALUE = 100;

export default Component.extend({
  connection: service('connection'),
  packetDispatcher: service('packet-dispatcher'),

  peakMeterValue: null,

  isAuxiliaryInput: computed('channel.data.isAuxiliaryInput', function() {
    return this.get('channel').data.isAuxiliaryInput === true;
  }),

  isAuxiliaryOutput: computed('channel.data.isAuxiliaryOutput', function() {
    return this.get('channel').data.isAuxiliaryOutput === true;
  }),

  isMasterOutput: computed('channel.data.isMasterOutput', function() {
    return this.get('channel').data.isMasterOutput === true;
  }),

  isOutput: computed('channel.data.{isMasterOutput,isAuxiliaryOutput}', function() {
    return this.get('channel').data.isMasterOutput === true || this.get('channel').data.isAuxiliaryOutput === true;
  }),

  gainValue: computed('masterInputs', function() {
    const {masterInputs, channel} = this.getProperties('masterInputs', 'channel');

    let gain = channel.data.gain * GAIN_MAX_VALUE;

    if (masterInputs) {
      const masterInput = masterInputs.find(m => m.data.channelId === channel.data.channelId);
      gain = masterInput.data.gain * GAIN_MAX_VALUE;
    }

    return gain;
  }),

  channelGainChanged: observer('gainValue', function() {
    debounce(this, this.onGainChange, WRITE_IN_SESSION_DEBOUNCE_TIME);

    const {channel, masterInputs, gainValue} = this.getProperties('channel', 'masterInputs', 'gainValue');
    const seqId = this._getGainSequenceId();
    const channelId = channel.data.channelId;

    const formattedGain = gainValue / GAIN_MAX_VALUE;

    if (masterInputs) {
      masterInputs.find(mi => mi.data.channelId === channelId).data.gain = formattedGain;
      this.set('masterInputs', masterInputs);
    } else {
      this.set('channel.data.gain', formattedGain);
    }

    if (channel.data.isMuted) return;
    if (!channel.data.isSolo && masterInputs && masterInputs.some(mi => mi.data.channelId !== channelId && mi.data.isSolo === true)) return;

    const message = {
      seqId,
      data: {
        channelId,
        auxiliaryChannelId: channel.data.auxiliaryChannelId || null,
        gain: formattedGain
      }
    };

    debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
  }),

  didInsertElement() {
    const currentChannelId = this.get('channel').data.channelId;

    if (!this.get('isOutput')) {
      // For the input peak meter, we have to multiply the channel's gain with the inputAfterEq level
      this.get('packetDispatcher').on('peakmeter-levels', (data) => {
        if (!data) return;

        const currentChannelGain = this.get('gainValue') / GAIN_MAX_VALUE;

        this.set('peakMeterValue',
          data.inputAfterEq.find(input => input.channelId === currentChannelId).level * currentChannelGain);
      });
    } else {
      this.get('packetDispatcher').on('peakmeter-levels', (data) => {
        if (!data) return;

        this.set('peakMeterValue',
          data.outputAfterGain.find(input => input.channelId === currentChannelId).level);
      });
    }

    this._super(...arguments);
  },

  willDestroyElement() {
    this.get('packetDispatcher').off('peakmeter-levels');
  },

  _getGainSequenceId() {
    if (this.get('isAuxiliaryOutput')) return SequenceIds.CHANGE_AUX_VOLUME_OUTPUT;
    if (this.get('isMasterOutput')) return SequenceIds.CHANGE_MAIN_VOLUME_OUTPUT;
    if (this.get('isAuxiliaryInput')) return SequenceIds.CHANGE_AUX_VOLUME_INPUT;

    return SequenceIds.CHANGE_MAIN_VOLUME_INPUT;
  },

  actions: {
    onShowChannelDetailsClick() {
      this.get('showChannelDetails')(this.get('channel'));
    }
  }
});
