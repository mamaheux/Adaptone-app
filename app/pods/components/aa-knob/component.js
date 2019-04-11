import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import $ from 'jquery';

const START_DEG = -225;
const DEG_RANGE = 270;
const STEPS = 35;
const ALIGN_TOP_DEGREES = 45;
const SET_VALUE_DEGREES = 90;

export default Component.extend(RecognizerMixin, {
  recognizers: 'pan',
  value: 0,
  lastDragValue: 0,

  init() {
    this._super(...arguments);
    this.set('value', this.get('min'));
  },

  degreesValue: computed('value', 'min', 'mid', 'max', function() {
    const {
      min,
      mid,
      max,
      value
    } = this.getProperties('min', 'mid', 'max', 'value');

    const halfDegValue = DEG_RANGE / 2;
    const firstHalfRange = mid - min;
    const secondHalfRange = max - mid
    let degValue;

    if (value <= mid) {
      degValue = (value - min) / firstHalfRange * halfDegValue;
    } else {
      degValue = halfDegValue + (value - mid) / secondHalfRange * halfDegValue;
    }

    return degValue;
  }),

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
    this._setValue(this.get('degreesValue'));
  },

  didRender() {
    this._super(...arguments);
    this._setValue(this.get('degreesValue'));
  },

  displayedValue: computed('value', function() {
    return parseFloat(this.get('value')).toFixed(2);
  }),

  valueChanged: observer('degreesValue', function() {
    this._setValue(this.get('degreesValue'));
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
  },

  _alignTop(degrees) {
    return degrees - ALIGN_TOP_DEGREES;
  },

  _rotate(templateElement, degrees) {
    const deg = this._alignTop(degrees);
    templateElement.css('transform', `rotate(${deg}deg)`);
  },

  _setValue(value) {
    const parent = this;
    let quarterNumber = 1;

    $(`#${this.elementId}`).find('.knob').find('.quarter').each(function() {
      const angle = Math.min(quarterNumber * SET_VALUE_DEGREES, value);
      parent._rotate($(this), START_DEG + angle);
      quarterNumber++;
    });

    this.get('onValueChange')(value);
  }
});
