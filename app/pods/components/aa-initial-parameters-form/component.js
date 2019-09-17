import Component from '@ember/component';
import {inject as service} from '@ember/service';
import Configuration from 'adaptone-front/models/configuration';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';
import Channels from 'adaptone-front/constants/channels';

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
        const auxiliary = Channels.auxiliaryTemplate;
        auxiliary.channelId = auxId;
        auxiliary.auxiliaryId = index;
        auxiliary.channelName = `Aux ${auxId}`;

        return auxiliary;
      });

      const configChannels = {
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

      this.get('router').transitionTo('probe-positioning');
    }
  }
});
