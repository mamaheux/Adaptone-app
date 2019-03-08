import Component from '@ember/component';
import {inject as service} from '@ember/service';
import Configuration from '../../../models/configuration';
import steps from '../../../models/steps';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),

  configuration: null,

  init() {
    this._super(...arguments);

    this.set('configuration', new Configuration());
  },

  actions: {
    saveConfig() {
      this.configuration.step = steps['probe-positioning'];

      this.get('fileSystem').writeNewConfiguration(this.configuration);
      this.get('session').set('configuration', this.configuration);
      this.get('router').transitionTo('probe-positioning');
    }
  }
});
