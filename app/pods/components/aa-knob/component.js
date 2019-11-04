import Component from '@ember/component';
import {computed} from '@ember/object';
import {htmlSafe} from '@ember/template';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

const STEPS = 18;
const MIN_ROTATION = -132;
const MAX_ROTATION = 132;
const OUTSIDE_BOX_DIVIDER = 184;

export default Component.extend(RecognizerMixin, {
  recognizers: 'pan',
  value: 0,
  lastDragValue: 0,

  panMove(e) {
    const panAmount = e.originalEvent.gesture.deltaX;

    const {
      min,
      mid,
      max,
      value,
      lastDragValue
    } = this.getProperties('min', 'mid', 'max', 'value', 'lastDragValue');

    const newValue = this._getNewValue(panAmount, value, min, mid, max, lastDragValue);

    this.set('lastDragValue', panAmount);
    this.set('value', newValue);
    this.get('onValueChange')(value);
  },

  normalizedValue: computed('value', 'min', 'max', function() {
    const {value, min, max} = this.getProperties('value', 'min', 'max');

    return (value - min) / (max - min) * (MAX_ROTATION - MIN_ROTATION) + MIN_ROTATION;
  }),

  dialStyle: computed('normalizedValue', function() {
    const normalizedValue = this.get('normalizedValue');

    return htmlSafe(`transform: translate(-50%, -50%) rotate(${normalizedValue}deg);`);
  }),

  outerStyle: computed('normalizedValue', function() {
    const normalizedValue = this.get('normalizedValue');
    const dashOffset = OUTSIDE_BOX_DIVIDER - OUTSIDE_BOX_DIVIDER * ((normalizedValue + MAX_ROTATION) / (2 * MAX_ROTATION));

    return htmlSafe(`stroke-dashoffset: ${dashOffset};`);
  }),

  _getNewValue(panAmount, value, min, mid, max, lastDragValue) {
    let newValue = 0;
    let increment = 0;

    if (value <= mid) {
      increment = (mid - min) / STEPS;
      newValue = panAmount > lastDragValue ? value + increment : value - increment;
      newValue = newValue < min ? min : newValue;

      if (newValue > mid) {
        newValue = value + ((max - mid) / STEPS);
      }
    } else {
      increment = (max - mid) / STEPS;
      newValue = panAmount > lastDragValue ? value + increment : value - increment;
      newValue = newValue > max ? max : newValue;

      if (newValue < mid) {
        newValue = value - ((mid - min) / STEPS);
      }
    }

    return newValue;
  }
});
