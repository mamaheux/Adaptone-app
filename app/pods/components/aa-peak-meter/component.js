import Component from '@ember/component';
import {computed} from '@ember/object';

const DEFAULT_YELLOW_LIMIT = 0.65;
const DEFAULT_RED_LIMIT = 0.85;

const Peak = function(delay, fallDuration) {
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
  proxyDelay: 65,
  proxyFallDuration: 200,
  min: 0,
  max: 1,
  peakWidth: 2,
  meterElements: null,

  _values: null,

  values: computed({
    get() {
      return this.get('_values');
    },

    set(_, value) {
      this.set('_values', value);

      return value;
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this._initializeMeterElements(this.element);
    this.renderPeakMeter();
  },

  renderPeakMeter(values = this.get('_values')) {
    console.log('RENDERING PEAK METERS -----------------------------------');

    let value = 0;
    value = this.get('meterElements').proxy.valye.update(value);

    value = {
      value: value,
      peak: this.get('meterElements').peak.update(value)
    };

    console.log(JSON.stringify(this.get('meterElements')));

    this.drawPeakMeter(value);
  },

  _initializeMeterElements() {
    this.set('meterElements', {
      green: this.element.querySelector('.green'),
      yellow: this.element.querySelector('.yellow'),
      red: this.element.querySelector('.red'),
      peak: this.element.querySelector('.peak'),
      height: this.element.querySelector('.peak-meter').clientHeight,
      proxy: {
        value: new Peak(this.get('proxyDelay'), this.get('proxyFallDuration'))
      }
    });

    this.get('meterElements').yellow.style.bottom = this._formatValue(this.get('yellowLimit'));
    this.get('meterElements').red.style.bottom = this._formatValue(this.get('redLimit'));
    this.get('meterElements').proxy.peak = new Peak();
  },

  _formatValue(value) {
    return `${Math.round(value*this.get('meterElements').size)}px`
  }
 });
