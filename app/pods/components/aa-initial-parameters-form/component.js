import Component from '@ember/component';
import {inject as service} from '@ember/service';
import Configuration from 'adaptone-front/models/configuration';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  configuration: null,

  init() {
    this._super(...arguments);

    this.set('configuration', new Configuration());
  },

  actions: {
    saveConfig() {
      this.configuration.step = steps['probe-positioning'];

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
