import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  router: service('router'),
  fileSystem: service('file-system'),
  session: service('session'),

  positions: null,

  init() {
    this._super(...arguments);
  },

  actions: {
    rerunInitialization() {
      this.get('router').transitionTo('probe-initialization');
    },

    confirmPositions() {
      this.get('router').transitionTo('optimization');
    }
  }
});
