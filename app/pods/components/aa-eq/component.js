/* eslint-disable no-magic-numbers */

import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {debounce} from '@ember/runloop';
import {set} from '@ember/object';
import {inject as service} from '@ember/service';

import SequenceIds from 'adaptone-front/constants/sequence-ids';

const CENTER_FREQUENCIES = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
const FIVE_BANDS_FREQUENCIES = [60, 230, 910, 3000, 14000];

const MAX_FREQUENCY = 20000;
const MIN_FREQUENCY = 20;

const DESIGNER_DEBOUNCE_TIME = 5;
const SEND_MESSAGE_DEBOUNCE_TIME = 20;

export default Component.extend({
  connection: service('connection'),
  filterDesigner: service('filter-designer'),
  interpolator: service('interpolator'),

  channelId: null,
  auxiliaryChannelId: null,
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

    this.set('graphicEqGraphValues', this.get('interpolator').interpolateData(this.get('interpolator').getLogspaceFrequencies(), this.get('graphicFilters')));

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
    const filterDesigner = this.get('filterDesigner');

    this.get('onEqChange')();

    const biquadCoefficients = this.get('biquadCoefficients');

    if (this.get('graphicFilters').length === parameters.length) {
      filterDesigner.designLowShelvingFilter(biquadCoefficients[0], parameters[0]);
      filterDesigner.designHighShelvingFilter(biquadCoefficients[parameters.length - 1], parameters[parameters.length - 1]);

      for (let i = 1; i < parameters.length - 1; i++) {
        filterDesigner.designPeakFilter(biquadCoefficients[i], parameters[i]);
      }
    }

    // Send graphic EQ gains to the Jetson
    this.sendEqGainsToJetson(filterDesigner.parametricEqDesignGainsDb(biquadCoefficients, CENTER_FREQUENCIES));

    // Send graphic EQ gains to the graphic EQ graph
    const logspaceFrequencies = this.get('interpolator').getLogspaceFrequencies();
    const parametricEqGraphGains = filterDesigner.parametricEqDesignGainsDb(biquadCoefficients, logspaceFrequencies);
    this.set('parametricEqGraphValues', []);

    logspaceFrequencies.forEach((logspaceFrequency, index) => {
      this.get('parametricEqGraphValues').pushObject([logspaceFrequency, parametricEqGraphGains[index]]);
    });
  },

  processInterpolatedData() {
    const interpolator = this.get('interpolator');

    // Send this to the Jetson
    const interpolatedCenterFrequenciesGains = [];
    const centerFrequenciesGains = interpolator.interpolateData(CENTER_FREQUENCIES, this.get('graphicFilters'));

    for (let i = 0; i < centerFrequenciesGains.length; i++) {
      interpolatedCenterFrequenciesGains.push(centerFrequenciesGains[i][1]);
    }

    debounce(this, this.sendEqGainsToJetson, interpolatedCenterFrequenciesGains, SEND_MESSAGE_DEBOUNCE_TIME);

    // Send this to the graphic EQ graph
    this.set('graphicEqGraphValues', interpolator.interpolateData(interpolator.getLogspaceFrequencies(), this.get('graphicFilters')));
  },

  sendEqGainsToJetson(gains) {
    gains = gains.map(gain => Math.pow(10, gain / 20));

    const seqId = this._getEqGainsSequenceId();

    const message = {
      seqId,
      data: {
        auxiliaryChannelId: this.get('auxiliaryChannelId'),
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
