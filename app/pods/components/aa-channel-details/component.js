import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';

import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;

export default Component.extend({
  connection: service('connection'),
  packetDispatcher: service('packet-dispatcher'),

  isParametric: true,

  parametricEqGraphValues: null,
  graphicEqGraphValues: null,

  inputAfterGain: null,
  inputAfterEq: null,

  userChannelVolume: 0,
  userChannelGain: 0,

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

  actions: {
    onVolumeChange(value) {
      const message = {
        seqId: SequenceIds.CHANGE_MAIN_VOLUME_INPUT,
        data: {
          channelId: this.get('channel').data.channelId,
          gain: value
        }
      };

      debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
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
