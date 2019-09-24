import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';
import {computed} from '@ember/object';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;
const CHANNEL_GAIN_MAX_VALUE = 100;

export default Component.extend({
  connection: service('connection'),
  session: service('session'),
  packetDispatcher: service('packet-dispatcher'),

  channels: null,
  positions: null,
  hasNewChanges: false,

  init() {
    this._super(...arguments);

    const configuration = this.get('session').get('configuration');
    this.set('positions', configuration.positions);

    //This is only needed to debug the application
    this.set('positions', {
      seqId: 11,
      data: {
        positions: [
          {
            x: 5,
            y: 5,
            type: 's'
          },
          {
            x: 90,
            y: 5,
            type: 's'
          },
          {
            x: 45,
            y: 10,
            type: 's'
          },
          {
            x: 5,
            y: 10,
            type: 'm',
            errorRate: 0.12
          },
          {
            x: 10,
            y: 15,
            type: 'm',
            errorRate: 0.09
          },
          {
            x: 30,
            y: 30,
            type: 'm',
            errorRate: 0.07
          },
          {
            x: 50,
            y: 15,
            type: 'm',
            errorRate: 0.09
          },
          {
            x: 80,
            y: 30,
            type: 'm',
            errorRate: 0.13
          }
        ]
      }
    });
  },

  didInsertElement() {
    this.get('packetDispatcher').on('error-rates', (data) => {
      this.set('positions', data.positions);
    });

    this._super(...arguments);
  },

  willDestroyElement() {
    this.get('packetDispatcher').off('error-rates');
  },

  allChannels: computed('channels', function() {
    const channels = this.get('channels');

    return [channels.master, ...channels.master.data.inputs, ...channels.auxiliaries];
  }),

  _updateSessionConfiguration() {
    const configuration = this.get('session').get('configuration');
    const channelsData = this.get('channels');

    channelsData.master.data.inputs.forEach(cd => {
      cd.data.isMuted = channelsData.inputs.find(i => i.data.channelId === cd.data.channelId).data.isMuted;
      cd.data.isSolo = channelsData.inputs.find(i => i.data.channelId === cd.data.channelId).data.isSolo;
    });

    configuration.channels = channelsData;

    this.get('session').set('configuration', configuration);
    this.set('hasNewChanges', true);
  },

  _getGainSequenceId(channel, isSoloChange) {
    const currentChannel = this.get('allChannels').find(c => c.data.channelId === channel.channelId).data;

    if (currentChannel.isAuxiliaryInput === true && isSoloChange) return SequenceIds.CHANGE_AUX_VOLUME_INPUTS;
    if (currentChannel.isAuxiliaryInput === true && !isSoloChange) return SequenceIds.CHANGE_AUX_VOLUME_INPUT;
    if (currentChannel.isMasterInput === true && isSoloChange) return SequenceIds.CHANGE_MAIN_VOLUME_INPUTS;
    if (currentChannel.isMasterInput === true && !isSoloChange) return SequenceIds.CHANGE_MAIN_VOLUME_INPUT;
    if (currentChannel.isMasterOutput === true) return SequenceIds.CHANGE_MAIN_VOLUME_OUTPUT;

    return SequenceIds.CHANGE_AUX_VOLUME_OUTPUT;
  },

  actions: {
    onChannelMuteChange(channel) {
      this._updateSessionConfiguration();

      const seqId = this._getGainSequenceId(channel, false);
      let gain = channel.isMuted ? 0 : channel.gain / CHANNEL_GAIN_MAX_VALUE;

      if (this.get('allChannels').some(c => c.data.isSolo
        && c.data.channelId !== channel.channelId
        && c.data.isAuxiliaryInput === channel.isAuxiliaryInput
        && c.data.isMasterInput === channel.isMasterInput
        && c.data.isMasterOutput === channel.isMasterOutput
        && c.data.isAuxiliaryOutput === channel.isAuxiliaryOutput)) gain = 0;

      const message = {
        seqId,
        data: {
          channelId: channel.channelId,
          gain
        }
      };

      debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
    },

    onChannelSoloChange(channel) {
      this._updateSessionConfiguration();

      const seqId = this._getGainSequenceId(channel, true);
      const channels = this.get('allChannels');

      const gains = channels.map(currentChannel => {
        let gain = currentChannel.data.gain / CHANNEL_GAIN_MAX_VALUE;

        if (channels.some(c => c.data.isSolo
          && c.data.channelId !== currentChannel.data.channelId
          && c.data.isAuxiliaryInput === currentChannel.data.isAuxiliaryInput
          && c.data.isMasterInput === currentChannel.data.isMasterInput
          && c.data.isMasterOutput === currentChannel.data.isMasterOutput
          && c.data.isAuxiliaryOutput === currentChannel.data.isAuxiliaryOutput)) gain = 0;
        if (currentChannel.data.isSolo) gain = currentChannel.data.gain / CHANNEL_GAIN_MAX_VALUE;
        if (currentChannel.data.isMuted) gain = 0;

        return {
          channelId: currentChannel.data.channelId,
          gain
        };
      });

      const message = {
        seqId,
        data: {
          gains
        }
      };

      debounce(this.get('connection'), this.get('connection').sendMessage, message, DEBOUNCE_TIME);
    },

    onGainChange(_) {
      this._updateSessionConfiguration();
    },

    saveConfiguration() {
      this.get('session').dumpSessionInFile();
      this.set('hasNewChanges', false);
    }
  }
});
