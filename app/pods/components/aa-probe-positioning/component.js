import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  router: service('router'),

  actions: {
    initializeProbes() {
      this.get('router').transitionTo('probe-initialization');
    }
  }
});
