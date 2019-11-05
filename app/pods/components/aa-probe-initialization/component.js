import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  router: service('router'),
  packetDispatcher: service('packet-dispatcher'),

  init() {
    this._super(...arguments);
    this.get('packetDispatcher').one('positions', (data) => {
      this.get('router').transitionTo('probe-positions', {queryParams: {positions: JSON.stringify(data)}});
    });
  }
});
