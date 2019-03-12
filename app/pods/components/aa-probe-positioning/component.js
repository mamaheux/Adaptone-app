import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  actions: {
    initializeProbes() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['probe-initialization'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.RUN_INIT
      });

      this.get('router').transitionTo('probe-initialization');
    }
  }
});
