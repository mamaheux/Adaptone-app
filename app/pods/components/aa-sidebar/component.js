import Component from '@ember/component';
import {inject as service} from '@ember/service';
import config from 'adaptone-front/config/environment';

const {remote} = requireNode('electron');

export default Component.extend({
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  actions: {
    goToConfigs() {
      this.get('session').dumpSessionInFile();
      this.get('router').transitionTo('configs');
    },

    closeApp() {
      this.get('session').dumpSessionInFile();
      this.get('connection').disconnect(config.APP.WEBSOCKET_ADDRESS);
      remote.app.quit();
    }
  }
});
