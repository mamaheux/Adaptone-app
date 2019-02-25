import Component from '@ember/component';
import {inject as service} from '@ember/service';

import config from 'adaptone-front/config/environment';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
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

    removeConfig(currentConfig) {
      let configs = this.get('configurations').filter(configuration => configuration !== currentConfig);
      this.get('fileSystem').writeFile(config.APP.CONFIGURATION_FILE.FILENAME, configs);

      this.set('configurations', configs);
    }
  }
});