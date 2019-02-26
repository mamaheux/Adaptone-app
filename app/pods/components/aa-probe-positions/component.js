import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  router: service('router'),
  session: service('session'),

  positions: null,

  actions: {
    rerunInitialization() {
      this.get('router').transitionTo('probe-initialization');
    },

    confirmPositions() {
      this.get('router').transitionTo('optimization');
    }
  }
});
