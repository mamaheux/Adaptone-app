import Component from '@ember/component';
import {inject as service} from '@ember/service';

import config from 'adaptone-front/config/environment';

export default Component.extend({
  fileSystem: service('file-system'),

  model: null,

  init() {
    this._super(...arguments);

    this.set('model', {
      name: null,
      monitorsNumber: null,
      speakersNumber: null,
      probesNumber: null
    });
  },


  actions: {
    saveConfig() {
      this.get('fileSystem').writeFile(config.APP.CONFIGURATION_FILE.FILENAME, this.model);
    }
  }
});
