import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';

import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;

export default Component.extend({
  connection: service('connection'),
  packetDispatcher: service('packet-dispatcher'),
  session: service('session'),

  isParametric: true,

  parametricEqGraphValues: null,
  graphicEqGraphValues: null,

  inputAfterGain: null,
  inputAfterEq: null,

  userChannelVolume: 0,
  userChannelGain: 0,

  isAuxiliary: computed('channel.data.auxiliaryId', function() {
    if (this.get('channel').data.auxiliaryId !== null) return true;

    return false;
  }),

  isAuxiliaryOutput: computed('channel.data.{auxiliaryId,inputs}', function() {
    if (this.get('channel').data.auxiliaryId !== null && this.get('channel').data.inputs !== undefined) return true;

    return false;
  }),

  isMasterOutput: computed('channel.data.{auxiliaryId,inputs}', function() {
    if (this.get('channel').data.auxiliaryId === null && this.get('channel').data.inputs !== undefined) return true;

    return false;
  }),

  didInsertElement() {
    this.get('packetDispatcher').on('peakmeter-levels', (data) => {
      this.set('inputAfterGain', data.inputAfterGain[this.get('channel').data.channelId]);
      this.set('inputAfterEq', data.inputAfterEq[this.get('channel').data.channelId] * this.get('channel').data.volume / 100);
    });

    this._super(...arguments);
  },

  willDestroyElement() {
    this.get('packetDispatcher').off('peakmeter-levels');
  },

  _updateSessionConfiguration() {
    const configuration = this.get('session').get('configuration');
    const {channel, isAuxiliary, isAuxiliaryOutput, isMasterOutput} = this.getProperties('channel', 'isAuxiliary', 'isAuxiliaryOutput', 'isMasterOutput');

    if (isAuxiliaryOutput) {
      const auxIndex = configuration.channels.auxiliaries.findIndex(aux => aux.data.auxiliaryId === channel.data.auxiliaryId);
      configuration.channels.auxiliaries[auxIndex] = channel;
    } else if (isMasterOutput) {
      configuration.channels.master = channel;
    } else if (isAuxiliary) {
      const auxIndex = configuration.channels.auxiliaries.findIndex(aux => aux.data.auxiliaryId === channel.data.auxiliaryId);
      const inputIndex = configuration.channels.auxiliaries[auxIndex].data.inputs.findIndex(input => input.data.channelId === channel.data.channelId);

      configuration.channels.auxiliaries[auxIndex].data.inputs[inputIndex] = channel;
    } else {
      const inputIndex = configuration.channels.master.data.inputs.findIndex(input => input.data.channelId === channel.data.channelId);
      configuration.channels.master.data.inputs[inputIndex] = channel;
    }

    this.get('session').set('configuration', configuration);
  },

  actions: {
    onEqChange() {
      this._updateSessionConfiguration();
    },

    onVolumeChange(value) {
      const seqId = this._getVolumeSequenceId();

      const message = {
        seqId,
        data: {
          auxiliaryId: this.get('channel').data.auxiliaryId,
          channelId: this.get('channel').data.channelId,
          gain: value
        }
      };

      debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
      debounce(this, this._updateSessionConfiguration, DEBOUNCE_TIME);
      return value;
    },

    onGainChange(value) {
      const message = {
        seqId: SequenceIds.CHANGE_INPUT_GAIN,
        data: {
          channelId: this.get('channel').data.channelId,
          gain: value
        }
      };

      debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
      debounce(this, this._updateSessionConfiguration, DEBOUNCE_TIME);

      return value;
    },

    onIsMutedChange(value) {
      this._updateSessionConfiguration();
      return value;
    },

    onIsSoloChange(value) {
      this._updateSessionConfiguration();
      return value;
    }
  },

  _getVolumeSequenceId() {
    if (this.get('isAuxiliaryOutput')) return SequenceIds.CHANGE_AUX_VOLUME_OUTPUT;
    if (this.get('isMasterOutput')) return SequenceIds.CHANGE_MAIN_VOLUME_OUTPUT;
    if (this.get('isAuxiliary')) return SequenceIds.CHANGE_AUX_VOLUME_INPUT;

    return SequenceIds.CHANGE_MAIN_VOLUME_INPUT;
  }
});
