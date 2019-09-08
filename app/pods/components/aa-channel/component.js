import Component from '@ember/component';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import $ from 'jquery';

export default Component.extend({
  stringifiedChannel: computed('channel', function() {
    return JSON.stringify(this.channel);
  }),

  didRender() {
    this._super(...arguments);

    $('.input').on('input', () => {
      run(() => {
        let newValue = $('.input').text();
        this.set('channel.data.channelName', newValue);
      });
    });
  }
});
