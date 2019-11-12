import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

const CHANNEL_GAIN_MAX_VALUE = 100;
const DECIBEL_CONVERT = 10;
const DECIBEL_FACTOR = 20;

export default Component.extend({
  connection: service('connection'),
  session: service('session'),
  packetDispatcher: service('packet-dispatcher'),

  channels: null,
  positions: null,
  currentChannel: null,
  isChannelDetailsVisible: false,
  isUniformizationOn: true,

  allChannels: computed('channels', function() {
    const channels = this.get('channels');

    return [channels.master, ...channels.master.data.inputs, ...channels.auxiliaries];
  }),

  init() {
    this._super(...arguments);

    const configuration = this.get('session').get('configuration');

    this.set('isUniformizationOn', configuration.isUniformizationOn);
    this.set('positions', configuration.positions);
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

  _updateSessionConfiguration() {
    const configuration = this.get('session').get('configuration');
    const channelsData = this.get('channels');

    channelsData.master.data.inputs.forEach(cd => {
      cd.data.isMuted = channelsData.inputs.find(i => i.data.channelId === cd.data.channelId).data.isMuted;
      cd.data.isSolo = channelsData.inputs.find(i => i.data.channelId === cd.data.channelId).data.isSolo;
    });

    configuration.channels = channelsData;

    this.get('session').set('configuration', configuration);
  },

  _getGainSequenceId(channel, isSoloChange) {
    if (channel.isAuxiliaryInput === undefined
      && channel.isMasterInput === undefined
      && channel.isMasterOutput === undefined
      && channel.isAuxiliaryOutput === undefined) return SequenceIds.CHANGE_INPUT_GAIN;

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

      let gain = channel.isMuted ? 0 : Math.pow(DECIBEL_CONVERT, channel.gain / DECIBEL_FACTOR);
      if (seqId !== SequenceIds.CHANGE_INPUT_GAIN) gain = channel.isMuted ? 0 : channel.gain / CHANNEL_GAIN_MAX_VALUE;

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

      this.get('connection').sendMessage(message);
    },

    onChannelSoloChange() {
      this._updateSessionConfiguration();

      const seqId = SequenceIds.CHANGE_INPUTS_GAIN;
      const channels = this.get('channels').inputs;

      const gains = channels.map(currentChannel => {
        let gain = Math.pow(DECIBEL_CONVERT, currentChannel.data.gain / DECIBEL_FACTOR);

        if (channels.some(c => c.data.isSolo
          && c.data.channelId !== currentChannel.data.channelId
          && c.data.isAuxiliaryInput === currentChannel.data.isAuxiliaryInput
          && c.data.isMasterInput === currentChannel.data.isMasterInput)) gain = 0;
        if (currentChannel.data.isSolo) gain = Math.pow(DECIBEL_CONVERT, currentChannel.data.gain / DECIBEL_FACTOR);
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

      this.get('connection').sendMessage(message);
    },

    onGainChange() {
      this._updateSessionConfiguration();
    },

    showChannelDetails(channel) {
      this.set('currentChannel', channel);
      this.set('isChannelDetailsVisible', true);
    },

    hideChannelDetails() {
      this.set('isChannelDetailsVisible', false);
    },

    onUniformizationToggleClick() {
      const configuration = this.get('session').get('configuration');
      configuration.isUniformizationOn = !this.get('isUniformizationOn');

      this.get('connection').sendMessage({
        seqId: SequenceIds.TOGGLE_UNIFORMIZATION,
        data: {
          isUniformizationOn: configuration.isUniformizationOn
        }
      });

      this.get('session').set('configuration', configuration);
    }
  }
});
