/* eslint-disable no-magic-numbers */

import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {debounce} from '@ember/runloop';
import {set} from '@ember/object';
import {inject as service} from '@ember/service';

import mathjs from 'mathjs';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

const CENTER_FREQUENCIES = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
const FIVE_BANDS_FREQUENCIES = [60, 230, 910, 3000, 14000];
const FREQUENCIES_PER_DECADE = 10;

const SAMPLE_FREQUENCY = 44100;

const MAX_FREQUENCY = 20000;
const MIN_FREQUENCY = 20;

const DESIGNER_DEBOUNCE_TIME = 5;
const SEND_MESSAGE_DEBOUNCE_TIME = 20;

Number.prototype.between = function(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return this > min && this <= max;
};

export default Component.extend({
  connection: service('connection'),

  channelId: null,
  auxiliaryId: null,
  graphicEqFreqs: null,
  isParametric: false,

  parametricFilters: null,
  graphicFilters: null,

  parametricEqGraphValues: null,
  graphicEqGraphValues: null,

  isMasterOutput: false,
  isAuxiliaryOutput: false,

  biquadCoefficients: computed('graphicFilters', function() {
    const coefficients = [];

    for (let i = 0; i < this.get('graphicFilters').length; i++) {
      coefficients.push({});
    }

    return coefficients;
  }),

  graphicFiltersChanged: observer('graphicFilters.@each.value', function() {
    debounce(this, this.processInterpolatedData, DESIGNER_DEBOUNCE_TIME);
  }),

  currentFilterChanged: observer('currentFilter', function() {
    const parametricFilters = this.get('parametricFilters');
    let currentFilterIndex = parametricFilters.findIndex(filter => filter.id === this.currentFilter.id);

    if (currentFilterIndex === -1) {
      set(parametricFilters[0], 'isSelected', true);
      currentFilterIndex = 0;
    }

    if (currentFilterIndex === 0) {
      set(this.currentFilter, 'maxFrequency', Math.round(parametricFilters[currentFilterIndex + 1].freq));
      set(this.currentFilter, 'midFrequency', Math.round((parametricFilters[currentFilterIndex + 1].freq - MIN_FREQUENCY) / 2));
      set(this.currentFilter, 'minFrequency', MIN_FREQUENCY);
    } else if (currentFilterIndex === parametricFilters.length - 1) {
      set(this.currentFilter, 'maxFrequency', MAX_FREQUENCY);
      set(this.currentFilter, 'midFrequency', Math.round((MAX_FREQUENCY - parametricFilters[currentFilterIndex - 1].freq) / 2));
      set(this.currentFilter, 'minFrequency', Math.round(parametricFilters[currentFilterIndex - 1].freq));
    } else {
      set(this.currentFilter, 'maxFrequency', Math.round(parametricFilters[currentFilterIndex + 1].freq));
      set(this.currentFilter, 'midFrequency', Math.round((parametricFilters[currentFilterIndex + 1].freq - parametricFilters[currentFilterIndex - 1].freq) / 2));
      set(this.currentFilter, 'minFrequency', Math.round(parametricFilters[currentFilterIndex - 1].freq));
    }
  }),

  init() {
    this._super(...arguments);

    this.set('graphicEqFreqs', FIVE_BANDS_FREQUENCIES);
  },

  didInsertElement() {
    this.updateParametricEqDesigner(this.get('parametricFilters'));
    this.set('graphicEqGraphValues', this.interpolateData(this.getLogspaceFrequencies()));

    this._super(...arguments);
  },

  actions: {
    onFilterClick(selectedFilter) {
      const previouslySelectedFilter = this.get('parametricFilters').find(filter => filter.isSelected === true);
      if (previouslySelectedFilter) set(previouslySelectedFilter, 'isSelected', false);

      set(selectedFilter, 'isSelected', true);
      this.set('currentFilter', selectedFilter);
    },

    onFrequencyChange() {
      debounce(this, this.updateParametricEqDesigner, this.get('parametricFilters'), DESIGNER_DEBOUNCE_TIME);
    },

    onGainChange() {
      debounce(this, this.updateParametricEqDesigner, this.get('parametricFilters'), DESIGNER_DEBOUNCE_TIME);
    },

    onQChange() {
      debounce(this, this.updateParametricEqDesigner, this.get('parametricFilters'), DESIGNER_DEBOUNCE_TIME);
    },

    triggerEqChange() {
      this.get('onEqChange')();
    },

    onOnOffChange(filter) {
      set(filter, 'gain', 0);
      this.updateParametricEqDesigner(this.get('parametricFilters'));
    }
  },

  updateParametricEqDesigner(parameters) {
    this.get('onEqChange')();

    const biquadCoefficients = this.get('biquadCoefficients');

    if (this.get('graphicFilters').length === parameters.length) {
      this.designLowShelvingFilter(biquadCoefficients[0], parameters[0]);
      this.designHighShelvingFilter(biquadCoefficients[parameters.length - 1], parameters[parameters.length - 1]);

      for (let i = 1; i < parameters.length - 1; i++) {
        this.designPeakFilter(biquadCoefficients[i], parameters[i]);
      }
    }

    // Send graphic EQ gains to the Jetson
    this.sendEqGainsToJetson(this.parametricEqDesignGainsDb(CENTER_FREQUENCIES));

    // Send graphic EQ gains to the graphic EQ graph
    const logspaceFrequencies = this.getLogspaceFrequencies();
    const parametricEqGraphGains = this.parametricEqDesignGainsDb(logspaceFrequencies);
    this.set('parametricEqGraphValues', []);

    logspaceFrequencies.forEach((logspaceFrequency, index) => {
      this.get('parametricEqGraphValues').pushObject([logspaceFrequency, parametricEqGraphGains[index]]);
    });
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
    const wC = 2 * Math.PI * parameter.freq / SAMPLE_FREQUENCY;
    const mu = Math.pow(10, parameter.gain / 20);
    const kQ = 4 / (1 + mu) * Math.tan(wC / (2 * parameter.q));
    const cPk = (1 + kQ * mu) / (1 + kQ);

    set(biquadCoefficients, 'b0', cPk);
    set(biquadCoefficients, 'b1', cPk * (-2 * Math.cos(wC) / (1 + kQ * mu)));
    set(biquadCoefficients, 'b2', cPk * (1 - kQ * mu) / (1 + kQ * mu));

    set(biquadCoefficients, 'a1', -2 * Math.cos(wC) / (1 + kQ));
    set(biquadCoefficients, 'a2', (1 - kQ) / (1 + kQ));
  },

  parametricEqDesignGainsDb(frequencies) {
    const w = mathjs.divide(mathjs.multiply(2 * Math.PI, mathjs.matrix(frequencies)), SAMPLE_FREQUENCY);

    const j = mathjs.complex(0, -1);

    const jw = mathjs.multiply(j, w);
    const jw2 = mathjs.multiply(2, jw);

    let h = mathjs.ones(frequencies.length);

    this.get('biquadCoefficients').forEach(coefficient => {
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

    const gains = mathjs.dotMultiply(20, mathjs.log10(mathjs.abs(h)));

    return gains._data;
  },

  interpolateData(frequencies) {
    const interpolatedData = [];
    const graphicFilters = this.get('graphicFilters');

    const firstBandFrequency = FIVE_BANDS_FREQUENCIES[0];
    const secondBandFrequency = FIVE_BANDS_FREQUENCIES[1];
    const thirdBandFrequency = FIVE_BANDS_FREQUENCIES[2];
    const fourthBandFrequency = FIVE_BANDS_FREQUENCIES[3];
    const fifthBandFrequency = FIVE_BANDS_FREQUENCIES[4];

    for (let i = 0; i < frequencies.length; i++) {
      const currentFrequency = frequencies[i];

      switch (true) {
        case currentFrequency <= firstBandFrequency:
          interpolatedData[i] = [currentFrequency, graphicFilters[0].value];
          break;
        case currentFrequency.between(firstBandFrequency, secondBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(0, 1, currentFrequency);
          break;
        case currentFrequency.between(secondBandFrequency, thirdBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(1, 2, currentFrequency);
          break;
        case currentFrequency.between(thirdBandFrequency, fourthBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(2, 3, currentFrequency);
          break;
        case currentFrequency.between(fourthBandFrequency, fifthBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(3, 4, currentFrequency);
          break;
        case currentFrequency >= fifthBandFrequency:
          interpolatedData[i] = [currentFrequency, graphicFilters[4].value];
          break;
      }
    }

    return interpolatedData;
  },

  pushInterpolatedData(firstIndex, secondIndex, currentFrequency) {
    const graphicFilters = this.get('graphicFilters');

    const xs = [FIVE_BANDS_FREQUENCIES[firstIndex], FIVE_BANDS_FREQUENCIES[secondIndex]];
    const ys = [graphicFilters[firstIndex].value, graphicFilters[secondIndex].value];

    return [currentFrequency, this.linearInterpolation(xs, ys, currentFrequency)];
  },

  linearInterpolation(xs, ys, x) {
    return ys[0] + (x - xs[0]) * ((ys[1] - ys[0]) / (xs[1] - xs[0]));
  },

  getLogspaceFrequencies() {
    const numberOfDecades = Math.round(mathjs.log10(MAX_FREQUENCY / MIN_FREQUENCY));
    const stepSize = mathjs.pow(10, 1 / FREQUENCIES_PER_DECADE);

    const frequencies = [];
    for (let i = 0; i < numberOfDecades * FREQUENCIES_PER_DECADE; i++) {
      if (i === 0) {
        frequencies[i] = MIN_FREQUENCY;
      } else if (i === numberOfDecades * FREQUENCIES_PER_DECADE - 1) {
        frequencies[i] = MAX_FREQUENCY;
      } else {
        frequencies[i] = frequencies[i - 1] * stepSize;
      }
    }

    return frequencies;
  },

  processInterpolatedData() {
    // Send this to the Jetson
    const interpolatedCenterFrequenciesGains = [];
    const centerFrequenciesGains = this.interpolateData(CENTER_FREQUENCIES);

    for (let i = 0; i < centerFrequenciesGains.length; i++) {
      interpolatedCenterFrequenciesGains.push(centerFrequenciesGains[i][1]);
    }

    debounce(this, this.sendEqGainsToJetson, interpolatedCenterFrequenciesGains, SEND_MESSAGE_DEBOUNCE_TIME);

    // Send this to the graphic EQ graph
    this.set('graphicEqGraphValues', this.interpolateData(this.getLogspaceFrequencies()));
  },

  sendEqGainsToJetson(gains) {
    gains = gains.map(gain => Math.pow(10, gain / 20));

    const seqId = this._getEqGainsSequenceId();

    const message = {
      seqId,
      data: {
        auxiliaryId: this.get('auxiliaryId'),
        channelId: this.get('channelId'),
        gains
      }
    };

    debounce(this.get('connection'), this.get('connection').sendMessage, message, SEND_MESSAGE_DEBOUNCE_TIME);
  },

  _getEqGainsSequenceId() {
    if (this.get('isAuxiliaryOutput')) return SequenceIds.CHANGE_AUX_EQ_OUTPUT_GAINS;
    if (this.get('isMasterOutput')) return SequenceIds.CHANGE_MAIN_EQ_OUTPUT_GAINS;

    return SequenceIds.CHANGE_INPUT_EQ_GAIN;
  }
});
