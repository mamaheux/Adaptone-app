import Component from '@ember/component';
import $ from 'jquery';
import {run} from '@ember/runloop';
import {inject as service} from '@ember/service';
import config from 'adaptone-front/config/environment';

const {remote} = requireNode('electron');

export default Component.extend({
  connection: service('connection'),
  session: service('session'),

  didRender() {
    this._super(...arguments);

    $('.minimize').on('click', () => {
      run(() => {
        remote.getCurrentWindow().minimize();
      });
    });

    $('.maximize').on('click', () => {
      run(() => {
        const window = remote.getCurrentWindow();

        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
      });
    });

    $('.close').on('click', () => {
      run(() => {
        this.get('session').dumpSessionInFile();
        this.get('connection').disconnect(config.APP.WEBSOCKET_ADDRESS);
        remote.app.quit();
      });
    });
  },

  willDestroyElement() {
    $('.minimize').off('click');
    $('.maximize').off('click');
    $('.close').off('click');
  },
});
