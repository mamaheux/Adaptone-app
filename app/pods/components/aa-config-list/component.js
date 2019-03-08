import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from '../../../models/steps';

import config from 'adaptone-front/config/environment';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),

  configurations: null,

  init() {
    this._super(...arguments);

    const result = this.get('fileSystem').readFile(config.APP.CONFIGURATION_FILE.FILENAME);
    const configs = result.success ? result.data : [];

    this.set('configurations', configs);
  },

  actions: {
    addConfig() {
      this.get('router').transitionTo('initial-parameters');
    },

    removeConfig(configurationId) {
      let configurations = this.get('fileSystem').removeConfiguration(configurationId);

      this.set('configurations', configurations);
    },

    selectConfig(configuration) {
      this.get('session').set('configuration', configuration);
      this._routeStep(configuration.step);
    }
  },

  _routeStep(configurationStep) {
    const stepRoute = Object.keys(steps).find(key => steps[key] === configurationStep);

    this.router.transitionTo(stepRoute);
  }
});
