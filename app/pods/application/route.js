import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

import config from 'adaptone-front/config/environment';

export default Route.extend({
  intl: service(),
  connection: service('connection'),

  beforeModel() {
    this.get('connection').createConnection(config.APP.WEBSOCKET_ADDRESS);

    return this.intl.setLocale('fr-ca');
  },

  afterModel() {
    this.transitionTo('configs');
  }
});
