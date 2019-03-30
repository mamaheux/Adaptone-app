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

    $('.close').on('click', () => {
      run(() => {
        remote.app.quit();
      });
    });
  }
});
