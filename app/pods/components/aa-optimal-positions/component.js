import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  positions: null,

  actions: {
    rerunInitialization() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps.optimization;

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.RERUN_OPTIMIZATION
      });

      this.get('router').transitionTo('optimization');
    },

    confirmPositions() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['console-loading:'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.END
      });

      this.get('router').transitionTo('console-loading');
    }
  }
});
