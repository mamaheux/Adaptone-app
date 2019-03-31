import Component from '@ember/component';
import $ from 'jquery';
import {run} from '@ember/runloop';

const {remote} = requireNode('electron');

export default Component.extend({
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
        remote.app.quit();
      });
    });
  }
});
