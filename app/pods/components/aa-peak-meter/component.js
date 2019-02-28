import Component from '@ember/component';
import {observer} from '@ember/object';

const DEFAULT_YELLOW_LIMIT = 0.65;
const DEFAULT_RED_LIMIT = 0.85;

let Peak = function(delay, fallDuration) {
  this.value = 0;
  this.lastTime = 0;
  this.falling = null;

  if (!fallDuration) {
    fallDuration = 200;

    if (!delay) {
      delay = 1000;
    }
  }

  this.delay = delay;
  this.fallDuration = fallDuration;
}

export default Component.extend({
  yellowLimit: DEFAULT_YELLOW_LIMIT,
  redLimit: DEFAULT_RED_LIMIT,
  proxyDelay: 60,
  proxyFallDuration: 200,
  min: 0,
  max: 1,
  peakWidth: 2,
  meterElements: null,
  value: null,

  valueChanged: observer('value', function() {
    this.renderPeakMeter(this.get('meterValue'));
    return this.get('meterValue');
  }),

  didInsertElement() {
    this._super(...arguments);
    this._initializeMeterElements(this.element);

    this.renderPeakMeter();
  },

  renderPeakMeter(value = this.get('value')) {
    console.log('RENDERING PEAK METERS -----------------------------------');

    value = {
      value: value,
      peak: this._updatePeakValue(this.get('meterElements').proxy.value, value)
    };

    this.drawPeakMeter(value);
  },

  drawPeakMeter(value) {
    console.log('DRAWING PEAK METERS -----------------------------------');

    let peak = this._normalize(value.peak.value);
    console.log(peak);
    value = value.value;

    value = this._normalize(value);

    let dom = this.get('meterElements');

    dom.green.style.width = this._formatValue(value);

    if (value > this.get('yellowLimit')) {
      dom.yellow.style.width = this._formatValue(value - this.get('yellowLimit'));
    } else {
      dom.yellow.style.width = 0;
    }

    if (value > this.get('redLimit')) {
        dom.red.style.width = this._formatValue(value - this.get('redLimit'));
    } else {
        dom.red.style.width = 0;
    }

    dom.peak.style.left = `${Math.round(peak * dom.size - dom.peak.style.width)}px`;
  },

  _normalize(value) {
    if (value > this.get('max')) {
        return this.get('max');
    } else if (value < this.get('min') || isNaN(value)) {
        return this.get('min');
    } else {
        return (value - this.get('min') / this.get('max') - this.get('min'));
    }
  },

  _updatePeakValue(peak, value) {
    console.log('UPDATING PEAK VALUE -----------------------------------');
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

  _initializeMeterElements() {
    console.log('INITIALIZING METER ELEMENTS ----------------');
    this.set('meterElements', {
      green: this.element.querySelector('.green'),
      yellow: this.element.querySelector('.yellow'),
      red: this.element.querySelector('.red'),
      peak: this.element.querySelector('.peak'),
      size: this.element.querySelector('.peak-meter').clientWidth,
      proxy: {
        value: new Peak(this.get('proxyDelay'), this.get('proxyFallDuration'))
      }
    });

    this.get('meterElements').yellow.style.left = this._formatValue(this.get('yellowLimit'));
    this.get('meterElements').red.style.left = this._formatValue(this.get('redLimit'));
    this.get('meterElements').proxy.peak = new Peak();
  },

  _formatValue(value) {
    return `${Math.round(value*this.get('meterElements').size)}px`
  }
 });
