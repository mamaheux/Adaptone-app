import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';

import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;

export default Component.extend({
  connection: service('connection'),

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

  channelVolumeChanged: observer('channel.data.volume', function() {
    const formattedVolume = this.get('channel').data.volume / 100;

    const seqId = this._getVolumeSequenceId();

    const message = {
      seqId,
      data: {
        auxiliaryId: this.get('channel').data.auxiliaryId,
        channelId: this.get('channel').data.channelId,
        gain: formattedVolume
      }
    };

    debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
  }),

  stringifiedChannel: computed('channel', function() {
    return JSON.stringify(this.channel);
  }),

  _getVolumeSequenceId() {
    if (this.get('isAuxiliaryOutput')) return SequenceIds.CHANGE_AUX_VOLUME_OUTPUT;
    if (this.get('isMasterOutput')) return SequenceIds.CHANGE_MAIN_VOLUME_OUTPUT;
    if (this.get('isAuxiliary')) return SequenceIds.CHANGE_AUX_VOLUME_INPUT;

    return SequenceIds.CHANGE_MAIN_VOLUME_INPUT;
  }
});
