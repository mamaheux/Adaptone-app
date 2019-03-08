import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from '../../../models/steps';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),

  isOptimizing: false,

  actions: {
    startOptimization() {
      this.set('isOptimizing', true);
    },

    loadConsole() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['console-loading:'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);
      this.router.transitionTo('console-loading');
    }
  }
});
