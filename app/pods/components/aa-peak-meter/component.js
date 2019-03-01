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
      peak: this.updatePeakValue(this.get('meterElements').peakParameters, value)
    };

    this.drawPeakMeter(meterValue);
  },

  drawPeakMeter(meterValue) {
    let peak = this.normalize(meterValue.peak.value);

    let value = meterValue.currentValue;

    value = this.normalize(value);

    let dom = this.get('meterElements');

    dom.green.style.width = this.formatValue(value);

    if (value > this.get('yellowLimit')) {
      dom.yellow.style.width = this.formatValue(value - this.get('yellowLimit'));
    } else {
      dom.yellow.style.width = 0;
    }

    if (value > this.get('redLimit')) {
        dom.red.style.width = this.formatValue(value - this.get('redLimit'));
    } else {
        dom.red.style.width = 0;
    }

    dom.peak.style.left = this.formatValue(peak - dom.peak.style.width);
  },

  updatePeakValue(peak, value) {
    let now = (new Date()).getTime();

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

        let fallRatio = Math.min(1, (now - peak.falling.startTime) / peak.fallDuration);
        peak.value = peak.falling.from - (peak.falling.from - peak.falling.to) * fallRatio;
    }

    return peak;
  },

  normalize(value) {
    if (value > this.get('max')) {
        return this.get('max');
    } else if (value < this.get('min') || isNaN(value)) {
        return this.get('min');
    } else {
        return (value - this.get('min') / this.get('max') - this.get('min'));
    }
  },

  formatValue(value) {
    let ratio = this.get('meterElements').size / this.get('max');
    return `${Math.round(value*ratio)}px`
  }
 });
