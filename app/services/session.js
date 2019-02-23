import Service from '@ember/service';
import {computed} from '@ember/object';
import config from 'adaptone-front/config/environment';

export default Service.extend({
  configuration: computed({
    get() {
      const configuration = localStorage.getItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE);
      if (!configuration) return {};

      return JSON.parse(configuration);
    },

    set(_, configuration) {
      localStorage.setItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE, JSON.stringify(configuration));

      return configuration;
    }
  }),

  loadFromFile() {
    // use filesystem service here
    const configuration = '';
    this.set('configuration', configuration);
  },

  remove() {
    const session = config.APP.LOCAL_STORAGE.SESSION_NAMESPACE;
    localStorage.removeItem(session);
  }
});
