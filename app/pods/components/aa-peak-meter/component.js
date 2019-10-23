import Component from '@ember/component';
import {observer} from '@ember/object';
import {cancel, later} from '@ember/runloop';

const DEFAULT_PEAK_FALL_DELAY = 2000;
const DEFAULT_PEAK_FALL_DURATION = 500;
const IDLE_DELAY = 1000;
const NORMALIZED_MAXIMUM = 1;
const NORMALIZED_MINIMUM = 0;
const DB_FACTOR = 20;

const convertToDb = (value) => DB_FACTOR * Math.log10(value);

export default Component.extend({
  max: null,
  min: null,
  redLimit: null,
  yellowLimit: null,
  value: null,

  convertToDecibels: true,

  meterElements: null,
  timerInformation: null,

  peakFallDelay: DEFAULT_PEAK_FALL_DELAY,
  peakFallDuration: DEFAULT_PEAK_FALL_DURATION,

  valueChanged: observer('value', function() {
    // Cancel the idle update timer
    const timerInformation = this.get('timerInformation');
    if (timerInformation) {
      cancel(timerInformation);
    }

    this.renderPeakMeter(this.get('meterValue'));

    // Set a timer to update if we stop receiving data
    const newTimerInfo = later(this, function() {
      const min = this.get('min');
      const peak = {
        value: 0,
        lastTime: 0,
        falling: null,
        fallDuration: this.get('peakFallDuration'),
        delay: this.get('peakFallDelay')
      };

      const meterValue = {
        currentValue: min,
        peak
      };

      this.drawPeakMeter(meterValue);
      this.updatePeak(peak, min);
    }, IDLE_DELAY);

    this.set('timerInformation', newTimerInfo);
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
      size: this.element.querySelector('.peak-meter').clientHeight,
      peakParameters: {
        value: 0,
        lastTime: 0,
        falling: null,
        fallDuration: this.get('peakFallDuration'),
        delay: this.get('peakFallDelay')
      }
    });

    this.get('meterElements').yellow.style.bottom = this.formatValue(this.normalize(this.get('yellowLimit') - 1));
    this.get('meterElements').red.style.bottom = this.formatValue(this.normalize(this.get('redLimit') - 1));
  },

  renderPeakMeter(value = this.get('value')) {
    if (this.get('convertToDecibels')) {
      if (value === 0) return;

      value = convertToDb(value);
    }

    const meterValue = {
      currentValue: value,
      peak: this.updatePeak(this.get('meterElements').peakParameters, value)
    };

    this.drawPeakMeter(meterValue);
  },

  drawPeakMeter(meterValue) {
    const meterElements = this.get('meterElements');
    let {yellowLimit, redLimit} = this.getProperties('yellowLimit', 'redLimit');

    yellowLimit = this.normalize(yellowLimit);
    redLimit = this.normalize(redLimit);

    const value = this.normalize(meterValue.currentValue);
    const dom = meterElements;

    const formattedGreenValue = this.formatValue(value);
    let formattedYellowValue;
    let formattedRedValue;

    if (value > yellowLimit) {
      formattedYellowValue = this.formatValue(value - yellowLimit);
    } else {
      formattedYellowValue = '0px';
    }

    if (value > redLimit) {
      formattedRedValue = this.formatValue(value - redLimit);
    } else {
      formattedRedValue = '0px';
    }

    const greenHeight = formattedGreenValue.substring(0, formattedGreenValue.length - 2);
    const yellowHeight = formattedYellowValue.substring(0, formattedYellowValue.length - 2);
    const redHeight = formattedRedValue.substring(0, formattedRedValue.length - 2);

    dom.green.style.height = `${+greenHeight - +yellowHeight}px`;
    dom.yellow.style.height = `${+yellowHeight - +redHeight}px`;
    dom.red.style.height = `${+redHeight}px`;

    dom.peak.style.bottom = this.formatValue(meterValue.peak.value - dom.peak.style.height);
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
