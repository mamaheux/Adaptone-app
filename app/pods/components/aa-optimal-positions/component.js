import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from '../../../models/steps';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),

  positions: null,

  actions: {
    rerunInitialization() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['optimization'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);
      this.get('router').transitionTo('optimization');
    },

    confirmPositions() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['console-loading:'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);
      this.get('router').transitionTo('console-loading');
    }
  }
});
