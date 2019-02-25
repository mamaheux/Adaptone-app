import Component from '@ember/component';
import {inject as service} from '@ember/service';

import config from 'adaptone-front/config/environment';

export default Component.extend({
  router: service('router'),
  fileSystem: service('file-system'),
  session: service('session'),

  positions: null,

  init() {
    this._super(...arguments);

    this.set('positions', [
      {
        x: 10,
        y: 23,
        type: 'm'
      },
      {
        x: 5,
        y: 59,
        type: 'm'
      },
      {
        x: 100,
        y: 25,
        type: 'm'
      },
      {
        x: 36,
        y: 63,
        type: 'm'
      },
      {
        x: 140,
        y: 20,
        type: 's'
      },
      {
        x: 50,
        y: 2,
        type: 's'
      },
      {
        x: 65,
        y: 78,
        type: 's'
      },
    ])
  },

  actions: {
    rerunInitialization() {
      this.get('router').transitionTo('probe-initialization');
    },

    confirmPositions() {
      const currentConfig = this.get('session');

      this.get('fileSystem').writeFile(config.APP.CONFIGURATION_FILE.FILENAME, currentConfig);
    }
  }
});
