import Component from '@ember/component';
import {set} from '@ember/object';
import nj from 'numjs';

const CENTER_FREQUENCIES = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
const FIVE_BANDS_FREQUENCIES = [60, 230, 910, 3000, 14000];

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
    },

    onGainChange(value) {
      this.get('onGainChange')(value);
    },

    onQChange(value) {
      this.get('onQChange')(value);
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

      // Send interpolated data to the Jetson here
    }
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
  }
});
