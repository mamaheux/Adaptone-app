import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  router: service('router'),

  isOptimizing: false,

  actions: {
    startOptimization() {
      this.set('isOptimizing', true);
    },

    loadConsole() {
      this.router.transitionTo('console-loading');
    }
  }
});
