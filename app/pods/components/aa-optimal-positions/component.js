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

      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.RERUN_OPTIMIZATION
      });

      this.get('fileSystem').editConfiguration(configuration);

      this.get('router').transitionTo('optimization');
    },

    confirmPositions() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['console-loading:'];
      configuration.positions = this.get('positions');
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.END
      });

      this.get('connection').sendMessage({
        seqId: SequenceIds.CONFIG_CHOICE,
        data: configuration
      });

      this.get('fileSystem').editConfiguration(configuration);

      this.get('router').transitionTo('console');
    }
  }
});
