import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';

describe('Unit | Services | interpolator', () => {
  setupTest('service:interpolator');

  let service;
  let graphicFilters;
  let biquadCoefficients;

  beforeEach(function() {
    graphicFilters = [
      {
        id: 0,
        value: -3
      },
      {
        id: 0,
        value: 3
      },
      {
        id: 0,
        value: 6
      },
      {
        id: 0,
        value: 8
      },
      {
        id: 0,
        value: 10
      }
    ];

    biquadCoefficients = [{}, {}, {}, {}, {}];

    service = this.subject();
  });

  describe('interpolateData', () => {
    it('should correctly interpolate the data', () => {
      const freqs = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
      const expectedInterpolatedData = [[20, -3], [25, -3], [31.5, -3], [40, -3], [50, -3], [63, -2.8941176470588235], [80, -2.2941176470588234], [100, -1.5882352941176472], [125, -0.7058823529411766], [160, 0.5294117647058822], [200, 1.9411764705882355], [250, 3.088235294117647], [315, 3.375], [400, 3.75], [500, 4.1911764705882355], [630, 4.764705882352941], [800, 5.514705882352941], [1000, 6.086124401913875], [1250, 6.3253588516746415], [1600, 6.660287081339713], [2000, 7.043062200956938], [2500, 7.521531100478469], [3150, 8.027272727272727], [4000, 8.181818181818182], [5000, 8.363636363636363], [6300, 8.6], [8000, 8.909090909090908], [10000, 9.272727272727273], [12500, 9.727272727272727], [16000, 10], [20000, 10]];
      const interpolatedData = service.interpolateData(freqs, graphicFilters);

      expect(interpolatedData).to.deep.equal(expectedInterpolatedData);
    });
  });

  describe('getGraphEqGraphFrequencies', () => {
    it('should return the proper frequencies for a given range', () => {
      const frequencies = service.getLogspaceFrequencies();
      const expectedFrequencies = [20,25.178508235883346,31.697863849222273,39.905246299377595,50.23772863019161,63.2455532033676,79.62143411069947,100.23744672545449,126.1914688960387,158.86564694485637,200.00000000000009,251.78508235883356,316.97863849222284,399.05246299377615,502.37728630191634,632.4555320336763,796.214341106995,1002.3744672545453,1261.9146889603874,1588.6564694485642,2000.0000000000016,2517.8508235883364,3169.78638492223,3990.524629937763,5023.772863019166,6324.555320336766,7962.143411069955,10023.74467254546,12619.146889603882,20000];

      expect(frequencies).to.deep.equal(expectedFrequencies);
    });
  });
});
