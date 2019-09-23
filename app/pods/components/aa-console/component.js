import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {debounce} from '@ember/runloop';
import {computed} from '@ember/object';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

const DEBOUNCE_TIME = 20;
const CHANNEL_VOLUME_MAX_VALUE = 100;
const CHANNEL_GAIN_MAX_VALUE = 12;

export default Component.extend({
  connection: service('connection'),
  session: service('session'),

  channels: null,
  positions: null,
  hasNewChanges: false,

  init() {
    this._super(...arguments);

    // TODO : Remove this but leave it in for now as it makes testing the whole app easier
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

  allChannels: computed('channels', function() {
    const channels = this.get('channels');

    const auxInputs = channels.auxiliaries.flatMap(auxiliary => {
      return auxiliary.data.inputs;
    });

    return [channels.master, ...channels.master.data.inputs, ...channels.auxiliaries, ...auxInputs];
  }),

  _updateSessionConfiguration() {
    const configuration = this.get('session').get('configuration');
    const channelsData = this.get('channels');

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
      let gain = channel.isMuted ? 0 : channel.volume / CHANNEL_VOLUME_MAX_VALUE;

      // On à pas l'info de isSolo dans les channels nestés donc ça fonctionne pas
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

      const gains = channels.map(channel => {
        // Faut utiliser le gain des channels nestés
        let gain = channel.data.volume / CHANNEL_VOLUME_MAX_VALUE;

        // Mais ici les solo des channels pas nestés
        if (channels.some(c => c.data.isSolo
          && c.data.channelId !== channel.channelId
          && c.data.isAuxiliaryInput === channel.isAuxiliaryInput
          && c.data.isMasterInput === channel.isMasterInput
          && c.data.isMasterOutput === channel.isMasterOutput
          && c.data.isAuxiliaryOutput === channel.isAuxiliaryOutput)) gain = 0;
        if (channel.data.isSolo) gain = channel.data.volume / CHANNEL_VOLUME_MAX_VALUE;
        if (channel.data.isMuted) gain = 0;

        return {
          channelId: channel.data.channelId,
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

    onVolumeChange(_) {
      this._updateSessionConfiguration();
    },

    saveConfiguration() {
      this.get('session').dumpSessionInFile();
      this.set('hasNewChanges', false);
    }
  }
});
