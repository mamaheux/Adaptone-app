import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from '../../../models/steps';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),

  actions: {
    initializeProbes() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['PROBE_INITIALIZATON'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);
      this.get('router').transitionTo('probe-initialization');
    }
  }
});
