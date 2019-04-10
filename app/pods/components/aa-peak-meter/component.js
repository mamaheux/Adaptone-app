import Component from '@ember/component';
import {observer} from '@ember/object';

const DEFAULT_PEAK_FALL_DELAY = 2000;
const DEFAULT_PEAK_FALL_DURATION = 500;
const DECIBEL_FACTOR = 20;
const NORMALIZED_MAXIMUM = 1;
const NORMALIZED_MINIMUM = 0;

export default Component.extend({
  max: null,
  min: null,
  redLimit: null,
  yellowLimit: null,
  value: null,

  convertToDecibels: true,

  meterElements: null,

  peakFallDelay: DEFAULT_PEAK_FALL_DELAY,
  peakFallDuration: DEFAULT_PEAK_FALL_DURATION,

  valueChanged: observer('value', function() {
    this.renderPeakMeter(this.get('meterValue'));
  }),

  didInsertElement() {
    this._super(...arguments);
    this.initializeMeterElements(this.element);

    this.renderPeakMeter();
  },

  initializeMeterElements() {
    this.set('yellowLimit', this.normalize(this.get('yellowLimit')));
    this.set('redLimit', this.normalize(this.get('redLimit')));

    this.set('meterElements', {
      green: this.element.querySelector('.green'),
      yellow: this.element.querySelector('.yellow'),
      red: this.element.querySelector('.red'),
      peak: this.element.querySelector('.peak'),
      size: this.element.querySelector('.peak-meter').clientWidth,
      peakParameters: {
        value: 0,
        lastTime: 0,
        falling: null,
        fallDuration: this.get('peakFallDuration'),
        delay: this.get('peakFallDelay')
      }
    });

    this.get('meterElements').yellow.style.left = this.formatValue(this.get('yellowLimit'));
    this.get('meterElements').red.style.left = this.formatValue(this.get('redLimit'));
  },

  renderPeakMeter(value = this.get('value')) {
    if (this.get('convertToDecibels')) {
      value = DECIBEL_FACTOR*Math.log(value);
    }

    const meterValue = {
      currentValue: value,
      peak: this.updatePeak(this.get('meterElements').peakParameters, value)
    };

    this.drawPeakMeter(meterValue);
  },

  drawPeakMeter(meterValue) {
    const {meterElements, yellowLimit, redLimit} = this.getProperties('meterElements', 'yellowLimit', 'redLimit');

    let value = meterValue.currentValue;
    value = this.normalize(value);

    const dom = meterElements;

    dom.green.style.width = this.formatValue(value);

    if (value > yellowLimit) {
      dom.yellow.style.width = this.formatValue(value - yellowLimit);
    } else {
      dom.yellow.style.width = 0;
    }

    if (value > redLimit) {
      dom.red.style.width = this.formatValue(value - redLimit);
    } else {
      dom.red.style.width = 0;
    }

    dom.peak.style.left = this.formatValue(meterValue.peak.value - dom.peak.style.width);
  },

  updatePeak(peak, value) {
    value = this.normalize(value);

    const now = (new Date()).getTime();

    if (value > peak.value) {
      peak.value = value;
      peak.lastTime = now;
      peak.falling = null;
    } else if (now > peak.lastTime + peak.delay) {
      if (peak.falling === null) {
        peak.falling = {
          startTime: now,
          from: peak.value,
          to: value
        };
      }

      const fallRatio = Math.min(1, (now - peak.falling.startTime) / peak.fallDuration);
      peak.value = peak.falling.from - (peak.falling.from - peak.falling.to) * fallRatio;
    }

    return peak;
  },

  normalize(value) {
    const {max, min} = this.getProperties('max', 'min');

    if (value > max) {
      return NORMALIZED_MAXIMUM;
    } else if (value < min || isNaN(value)) {
      return NORMALIZED_MINIMUM;
    }

    return (value - min) / (max - min);
  },

  formatValue(value) {
    return `${Math.round(value * this.get('meterElements').size)}px`;
  }
});
