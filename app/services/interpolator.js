/* eslint-disable no-magic-numbers */
import Service from '@ember/service';
import mathjs from 'mathjs';

const FREQUENCIES_PER_DECADE = 10;
const FIVE_BANDS_FREQUENCIES = [60, 230, 910, 3000, 14000];
const MAX_FREQUENCY = 20000;
const MIN_FREQUENCY = 20;

Number.prototype.between = function(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return this > min && this <= max;
};

export default Service.extend({
  interpolateData(frequencies, graphicFilters) {
    const interpolatedData = [];

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
          interpolatedData[i] = this.pushInterpolatedData(0, 1, currentFrequency, graphicFilters);
          break;
        case currentFrequency.between(secondBandFrequency, thirdBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(1, 2, currentFrequency, graphicFilters);
          break;
        case currentFrequency.between(thirdBandFrequency, fourthBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(2, 3, currentFrequency, graphicFilters);
          break;
        case currentFrequency.between(fourthBandFrequency, fifthBandFrequency):
          interpolatedData[i] = this.pushInterpolatedData(3, 4, currentFrequency, graphicFilters);
          break;
        case currentFrequency >= fifthBandFrequency:
          interpolatedData[i] = [currentFrequency, graphicFilters[4].value];
          break;
      }
    }

    return interpolatedData;
  },

  pushInterpolatedData(firstIndex, secondIndex, currentFrequency, graphicFilters) {
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
  }
});
