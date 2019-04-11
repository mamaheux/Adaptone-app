import Component from '@ember/component';
import {set} from '@ember/object';
import mathjs from 'mathjs';

const CENTER_FREQUENCIES = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
const FIVE_BANDS_FREQUENCIES = [60, 230, 910, 3000, 14000];

const SAMPLE_FREQUENCY = 44100;
const FILTER_COUNT = 5;

Number.prototype.between = function(a, b) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  return this > min && this <= max;
};

export default Component.extend({
  isParametric: false,
  parametricFilters: null,
  graphicFilters: null,
  currentFilter: null,

  biquadCoefficients: [{}, {}, {}, {}, {}],

  init() {
    this._super(...arguments);

    this._setGraphicFiltersFrequencies();

    if (this.get('isParametric')) this._setCurrentFilter();
  },

  actions: {
    onFilterClick(selectedFilter) {
      const previouslySelectedFilter = this.get('parametricFilters').find(filter => filter.isSelected === true);
      if (previouslySelectedFilter) set(previouslySelectedFilter, 'isSelected', false);

      set(selectedFilter, 'isSelected', true);
      this.set('currentFilter', selectedFilter);
    },

    onFrequencyChange(value) {
      this.get('onFrequencyChange')(value);
      this.updateParametricEqDesigner(this.get('parametricFilters'));
    },

    onGainChange(value) {
      this.get('onGainChange')(value);
      this.updateParametricEqDesigner(this.get('parametricFilters'));
    },

    onQChange(value) {
      this.get('onQChange')(value);
      this.updateParametricEqDesigner(this.get('parametricFilters'));
    },

    onGraphicFilterChange() {
      let interpolatedData = [];
      const graphicFilters = this.get('graphicFilters');

      const firstBandFrequency = FIVE_BANDS_FREQUENCIES[0];
      const secondBandFrequency = FIVE_BANDS_FREQUENCIES[1];
      const thirdBandFrequency = FIVE_BANDS_FREQUENCIES[2];
      const fourthBandFrequency = FIVE_BANDS_FREQUENCIES[3];
      const fifthBandFrequency = FIVE_BANDS_FREQUENCIES[4];

      for (let i = 0; i < CENTER_FREQUENCIES.length; i++) {
        let currentFrequency = CENTER_FREQUENCIES[i];

        switch (true) {
          case currentFrequency <= firstBandFrequency:
            interpolatedData[i] = [currentFrequency, graphicFilters[0].value];
            break;
          case currentFrequency.between(firstBandFrequency, secondBandFrequency):
            interpolatedData[i] = this._pushInterpolatedData(0, 1, currentFrequency);
            break;
          case currentFrequency.between(secondBandFrequency, thirdBandFrequency):
            interpolatedData[i] = this._pushInterpolatedData(1, 2, currentFrequency);
            break;
          case currentFrequency.between(thirdBandFrequency, fourthBandFrequency):
            interpolatedData[i] = this._pushInterpolatedData(2, 3, currentFrequency);
            break;
          case currentFrequency.between(fourthBandFrequency, fifthBandFrequency):
            interpolatedData[i] = this._pushInterpolatedData(3, 4, currentFrequency);
            break;
          case currentFrequency >= fifthBandFrequency:
            interpolatedData[i] = [currentFrequency, graphicFilters[4].value];
            break;
        }
      }
    }
  },

  updateParametricEqDesigner(parameters) {
    const biquadCoefficients = this.get('biquadCoefficients');

    if (FILTER_COUNT === parameters.length) {
      this.designLowShelvingFilter(biquadCoefficients[0], parameters[0]);
      this.designHighShelvingFilter(biquadCoefficients[4], parameters[4]);

      for (let i = 1; i < parameters.length - 1; i++) {
        this.designPeakFilter(biquadCoefficients[i], parameters[i]);
      }
    }

    console.log(biquadCoefficients);

    this.parametricEqDesignGainsDb(CENTER_FREQUENCIES);
  },

  parametricEqDesignGainsDb(frequencies) {
    const w = mathjs.divide(mathjs.multiply(2 * Math.PI, mathjs.matrix(frequencies)), SAMPLE_FREQUENCY);

    const j = mathjs.complex(0, -1);

    const jw = mathjs.multiply(j, w);
    const jw2 = mathjs.multiply(2, jw);

    let h = mathjs.ones(frequencies.length);

    this.get('biquadCoefficients').forEach((coefficient, i) => {
      const a = mathjs.add(
        mathjs.add(
          coefficient.b0,
          mathjs.multiply(
            coefficient.b1,
            mathjs.exp(jw)
          )
        ),
        mathjs.multiply(coefficient.b2, mathjs.exp(jw2))
      );

      const b = mathjs.add(
        mathjs.add(1, mathjs.multiply(coefficient.a1, mathjs.exp(jw))),
        mathjs.multiply(coefficient.a2, mathjs.exp(jw2))
      );

      h = mathjs.dotMultiply(
        h,
        mathjs.dotDivide(a, b)
      );
    });


    //console.log(mathjs.dotMultiply(20, mathjs.log(mathjs.abs(h))));


    //return nj.multiply(20, nj.log(nj.abs(h)));
  },

  designLowShelvingFilter(biquadCoefficients, parameter) {
    const k = Math.tan((Math.PI * parameter.freq) / SAMPLE_FREQUENCY);
    let v0 = Math.pow(10, parameter.gain / 20);
    const root2 = 1 / parameter.q;

    if (v0 < 1) {
      v0 = 1 / v0;
    }

    if (parameter.gain > 0) {
      set(biquadCoefficients, 'b0', (1 + Math.sqrt(v0) * root2 * k + v0 * k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b1', (2 * (v0 * k * k - 1)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b2', (1 - Math.sqrt(v0) * root2 * k + v0 * k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a1', (2 * (k * k - 1)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a2', (1 - root2 * k + k * k) / (1 + root2 * k + k * k));
    } else if (parameter.gain < 0) {
      set(biquadCoefficients, 'b0', (1 + root2 * k + k * k) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'b1', (2 * (k * k - 1)) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'b2', (1 - root2 * k + k * k) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'a1', (2 * (v0 * k * k - 1)) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
      set(biquadCoefficients, 'a2', (1 - root2 * Math.sqrt(v0) * k + v0 * k * k) / (1 + root2 * Math.sqrt(v0) * k + v0 * k * k));
    } else {
      set(biquadCoefficients, 'b0', v0);
      set(biquadCoefficients, 'b1', 0);
      set(biquadCoefficients, 'b2', 0);
      set(biquadCoefficients, 'a1', 0);
      set(biquadCoefficients, 'a2', 0);
    }
  },

  designHighShelvingFilter(biquadCoefficients, parameter) {
    const k = Math.tan((Math.PI * parameter.freq) / SAMPLE_FREQUENCY);
    let v0 = Math.pow(10, parameter.gain / 20);
    const root2 = 1 / parameter.q;

    if (v0 < 1) {
      v0 = 1 / v0;
    }

    if (parameter.gain > 0) {
      set(biquadCoefficients, 'b0', (v0 + root2 * Math.sqrt(v0) * k + k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b1', (2 * (k * k - v0)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'b2', (v0 - root2 * Math.sqrt(v0) * k + k * k) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a1', (2 * (k * k - 1)) / (1 + root2 * k + k * k));
      set(biquadCoefficients, 'a2', (1 - root2 * k + k * k) / (1 + root2 * k + k * k));
    } else if (parameter.gain < 0) {
      set(biquadCoefficients, 'b0', (1 + root2 * k + k * k) / (v0 + root2 * Math.sqrt(v0) * k + k * k));
      set(biquadCoefficients, 'b1', (2 * (k * k - 1)) / (v0 + root2 * Math.sqrt(v0) * k + k * k));
      set(biquadCoefficients, 'b2', (1 - root2 * k + k * k) / (v0 + root2 * Math.sqrt(v0) * k + k * k));
      set(biquadCoefficients, 'a1', (2 * ((k * k) / v0 - 1)) / (1 + root2 / Math.sqrt(v0) * k + (k * k) / v0));
      set(biquadCoefficients, 'a2', (1 - root2 / Math.sqrt(v0) * k + (k * k) / v0) / (1 + root2 / Math.sqrt(v0) * k + (k * k) / v0));
    } else {
      set(biquadCoefficients, 'b0', v0);
      set(biquadCoefficients, 'b1', 0);
      set(biquadCoefficients, 'b2', 0);
      set(biquadCoefficients, 'a1', 0);
      set(biquadCoefficients, 'a2', 0);
    }
  },

  designPeakFilter(biquadCoefficients, parameter) {
    const w_c = (2 * Math.PI * parameter.freq / SAMPLE_FREQUENCY);
    const mu = Math.pow(10, parameter.gain / 20);
    const k_q = 4 / (1 + mu) * Math.tan(w_c / (2 * parameter.q));
    const C_pk = (1 + k_q * mu) / (1 + k_q);

    set(biquadCoefficients, 'b0', C_pk);
    set(biquadCoefficients, 'b1', C_pk * (-2 * Math.cos(w_c) / (1 + k_q * mu)));
    set(biquadCoefficients, 'b2', C_pk * (1 - k_q * mu) / (1 + k_q * mu));

    set(biquadCoefficients, 'a1', -2 * Math.cos(w_c) / (1 + k_q));
    set(biquadCoefficients, 'a2', (1 - k_q) / (1 + k_q));
  },

  _pushInterpolatedData(firstIndex, secondIndex, currentFrequency) {
    const graphicFilters = this.get('graphicFilters');

    const xs = [FIVE_BANDS_FREQUENCIES[firstIndex], FIVE_BANDS_FREQUENCIES[secondIndex]];
    const ys = [graphicFilters[firstIndex].value, graphicFilters[secondIndex].value];

    return [currentFrequency, this._linearInterpolation(xs, ys, currentFrequency)];
  },

  _linearInterpolation(xs, ys, x) {
    return ys[0] + (x - xs[0]) * ((ys[1] - ys[0]) / (xs[1] - xs[0]));
  },

  _setGraphicFiltersFrequencies() {
    let graphicFilters = this.get('graphicFilters');

    graphicFilters.forEach((graphicFilter, index) => {
      set(graphicFilter, 'frequency', FIVE_BANDS_FREQUENCIES[index]);
    });
  },

  _setCurrentFilter() {
    const parametricFilters = this.get('parametricFilters');
    const selectedFilter = parametricFilters.find(filter => filter.isSelected === true);
    if (selectedFilter) {
      this.set('currentFilter', selectedFilter);
    } else {
      this.parametricFilters[0].isSelected = true;
      this.set('currentFilter', parametricFilters[0]);
    }
  },
});
