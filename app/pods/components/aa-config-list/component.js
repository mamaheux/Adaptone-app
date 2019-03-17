import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

import config from 'adaptone-front/config/environment';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

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
      const configurations = this.get('fileSystem').removeConfiguration(configurationId);

      this.set('configurations', configurations);
    },

    selectConfig(configuration) {
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.CONFIG_CHOICE,
        data: configuration
      });

      this._routeStep(configuration.step);
    }
  },

  _routeStep(configurationStep) {
    const stepRoute = Object.keys(steps).find(key => steps[key] === configurationStep);

    this.router.transitionTo(stepRoute);
  }
});
