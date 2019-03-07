import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import $ from 'jquery';

const START_DEG = -225;
const DEG_RANGE = 270;
const STEPS = 35;

export default Component.extend(RecognizerMixin, {
  recognizers: 'pan',
  value: 16,
  lastDragValue: 0,

  degreesValue: computed('value', function() {
    const {
      min,
      mid,
      max,
      value
    } = this.getProperties('min','mid', 'max', 'value');

    if (value <= mid) {
      return (value / (mid - min)) * (DEG_RANGE / 2);
    }

    return (value / (max - mid)) * (DEG_RANGE / 2) + (DEG_RANGE / 2);
  }),

  panMove(e) {
    const panAmount = e.originalEvent.gesture.deltaX;

    const {
      min,
      mid,
      max,
      value,
      lastDragValue
    } = this.getProperties('min','mid', 'max', 'value', 'lastDragValue');
    let newValue = 0;
    let increment = 0;

    if (value <= mid) {
      increment = ((mid - min) / STEPS);
      newValue = panAmount > lastDragValue ? value + increment : value - increment;
      newValue = newValue < min ? min : newValue;

      if (newValue > mid) {
        newValue = value + ((max - mid) / STEPS);
      }
    } else {
      increment = ((max - mid) / STEPS);
      newValue = panAmount > lastDragValue ? value + increment : value - increment;
      newValue = newValue > max ? max : newValue;

      if (newValue < mid) {
        newValue = value - ((mid - min) / STEPS);
      }
    }

    newValue = Math.round(newValue);

    this.set('lastDragValue', panAmount);
    this.set('value', newValue);
    this._setValue(this.get('degreesValue'));
  },

  didRender() {
    this._super(...arguments);
    this._setValue(this.get('degreesValue'));
  },

  valueChanged: observer('degreesValue', function() {
    this._setValue(this.get('degreesValue'));
  }),

  _alignTop(degrees) {
    return degrees - 45;
  },

  _rotate(templateElement, degrees) {
    const deg = this._alignTop(degrees);
    templateElement.css('transform', `rotate(${deg}deg)`);
  },

  _setValue(value) {
    const parent = this;
    let quarterNumber = 1;

    $('.knob').find('.quarter').each(function() {
      const angle = Math.min(quarterNumber * 90, value);
      parent._rotate($(this), START_DEG + angle);
      quarterNumber++;
    });
  }
});
