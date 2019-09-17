import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  session: service('session'),

  model(params) {
    const configuration = this.get('session').get('configuration');

    if (configuration.channels !== undefined) {
      this.controllerFor('console').set('channels', configuration.channels);
    }

    return params;
  }
});
