import Service, {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import config from 'adaptone-front/config/environment';

const {ipcRenderer} = requireNode('electron');

export default Service.extend({
  fileSystem: service('file-system'),

  init() {
    this._super(...arguments);

    ipcRenderer.on('save-application-session', () => {
      const config = this.get('configuration');
      this.get('fileSystem').editConfiguration(config);
    });
  },

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

  loadFromFile(filename) {
    const configuration = this.get('fileSystem').readFile(filename);
    this.set('configuration', configuration);
  },

  dumpSessionInFile() {
    const configuration = this.get('configuration');
    this.get('fileSystem').editConfiguration(configuration);
  },

  remove() {
    const session = config.APP.LOCAL_STORAGE.SESSION_NAMESPACE;
    localStorage.removeItem(session);
  }
});
