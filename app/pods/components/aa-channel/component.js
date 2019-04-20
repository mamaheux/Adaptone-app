import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
  stringifiedChannel: computed('channel', function() {
    return JSON.stringify(this.channel);
  })
});
