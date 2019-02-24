import Component from '@ember/component';
import {inject as service} from '@ember/service';

import config from 'adaptone-front/config/environment';

export default Component.extend({
  fileSystem: service('file-system'),

  model: null,
  configurations: null,

  init() {
    this._super(...arguments);

    const result = this.get('fileSystem').readFile(config.APP.CONFIGURATION_FILE.FILENAME);
    const configs = result.success ? result.data : [];

    this.set('configurations', configs);
    this.set('model', {
      name: null,
      monitorsNumber: null,
      speakersNumber: null,
      probesNumber: null
    });
  },


  actions: {
    saveConfig() {
      this.configurations.push(this.model);
      this.get('fileSystem').writeFile(config.APP.CONFIGURATION_FILE.FILENAME, this.configurations);
    }
  }
});
