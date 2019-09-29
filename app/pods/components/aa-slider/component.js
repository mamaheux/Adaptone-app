import Component from '@ember/component';
import {computed} from '@ember/object';
import {htmlSafe} from '@ember/template';

export default Component.extend({
  rangeStyle: computed('min', 'max', 'value', function() {
    const {min, max, value} = this.getProperties('min', 'max', 'value');
    return htmlSafe(`--min: ${min}; --max: ${max}; --val: ${value}`);
  }),

  input(e) {
    this.set('value', e.target.value);
  }
});
