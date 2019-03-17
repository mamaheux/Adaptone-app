import Component from '@ember/component';
import {observer} from '@ember/object';

const DEFAULT_PEAK_FALL_DELAY = 2000;
const DEFAULT_PEAK_FALL_DURATION = 500;

export default Component.extend({
  max: null,
  meterElements: null,
  min: null,
  redLimit: null,
  value: null,
  yellowLimit: null,

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
    const meterValue = {
      currentValue: value,
      peak: this.updatePeak(this.get('meterElements').peakParameters, value)
    };

    this.drawPeakMeter(meterValue);
  },

  drawPeakMeter(meterValue) {
    const {
      meterElements,
      yellowLimit,
      redLimit
    } = this.getProperties('meterElements', 'yellowLimit', 'redLimit');

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

    const peak = this.normalize(meterValue.peak.value);
    dom.peak.style.left = this.formatValue(peak - dom.peak.style.width);
  },

  updatePeak(peak, value) {
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
      return max;
    } else if (value < min || isNaN(value)) {
      return min;
    } else {
      return value;
    }
  },

  formatValue(value) {
    const ratio = this.get('meterElements').size / this.get('max');
    return `${Math.round(value * ratio)}px`;
  }
});
