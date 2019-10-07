import Component from '@ember/component';
import {inject as service} from '@ember/service';
import Configuration from 'adaptone-front/models/configuration';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';
import Channels from 'adaptone-front/constants/channels';
import {copy} from '@ember/object/internals';

const INPUT_COUNT = 4;

const generateRange = (start, end) => Array.from({length: (end - start)}, (_, k) => k + start);

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  configuration: null,
  currentChannelId: 1,

  init() {
    this._super(...arguments);

    this.set('configuration', new Configuration());
  },

  actions: {
    saveConfig() {
      this.configuration.step = steps['probe-positioning'];
      this.set('configuration.monitorsNumber', +this.configuration.monitorsNumber);
      this.set('configuration.speakersNumber', +this.configuration.speakersNumber);
      this.set('configuration.probesNumber', +this.configuration.probesNumber);

      const inputChannelIds = generateRange(this.currentChannelId, this.currentChannelId + INPUT_COUNT);
      this.currentChannelId += inputChannelIds.length;

      const auxiliaryChannelIds = generateRange(this.currentChannelId, this.currentChannelId + this.configuration.monitorsNumber);
      this.currentChannelId += auxiliaryChannelIds.length;

      const auxiliaries = auxiliaryChannelIds.map((auxId, index) => {
        const auxiliary = copy(Channels.auxiliaryTemplate, true);

        auxiliary.data.channelId = auxId;
        auxiliary.data.auxiliaryChannelId = index;
        auxiliary.data.channelName = `Aux ${index + 1}`;
        auxiliary.data.inputs.forEach(i => i.data.auxiliaryChannelId = auxId);

        return auxiliary;
      });

      const configChannels = {
        inputs: Channels.inputs,
        master: Channels.master,
        auxiliaries
      };

      this.set('configuration', {
        ...this.configuration,
        inputCount: INPUT_COUNT,
        inputChannelIds,
        auxiliaryChannelIds,
        channels: configChannels
      });

      this.get('fileSystem').writeNewConfiguration(this.configuration);
      this.get('session').set('configuration', this.configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.INITIAL_PARAMS,
        data: this.configuration
      });

      this.get('router').transitionTo('console');
      // TODO: Re-enable this when we actually want to navigate through the steps
      // this.get('router').transitionTo('probe-positioning');
    }
  }
});
