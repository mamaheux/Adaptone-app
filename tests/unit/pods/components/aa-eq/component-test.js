import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';

describe('Unit | Component | aa-eq', function () {
  setupComponentTest('aa-eq', {
    unit: true
  });

  let component;

  beforeEach(function () {
    const parametricFilters = [
      {
        id: 0,
        on: true,
        freq: 100,
        q: 1,
        gain: -10
      },
      {
        id: 1,
        on: true,
        freq: 300,
        q: 5,
        gain: 5
      },
      {
        id: 2,
        on: true,
        freq: 800,
        q: 5,
        gain: -8
      },
      {
        id: 3,
        on: true,
        freq: 1500,
        q: 5,
        gain: 12
      },
      {
        id: 4,
        on: true,
        freq: 8000,
        q: 1,
        gain: 2
      }
    ];

    const graphicFilters = [
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

    component = this.subject();
    component.set('parametricFilters', parametricFilters);
    component.set('graphicFilters', graphicFilters);
  });

  describe('interpolateData', () => {
    it('should correctly interpolate the data', () => {
      const expectedInterpolatedData = [[20, -3], [25, -3], [31.5, -3], [40, -3], [50, -3], [63, -2.8941176470588235], [80, -2.2941176470588234], [100, -1.5882352941176472], [125, -0.7058823529411766], [160, 0.5294117647058822], [200, 1.9411764705882355], [250, 3.088235294117647], [315, 3.375], [400, 3.75], [500, 4.1911764705882355], [630, 4.764705882352941], [800, 5.514705882352941], [1000, 6.086124401913875], [1250, 6.3253588516746415], [1600, 6.660287081339713], [2000, 7.043062200956938], [2500, 7.521531100478469], [3150, 8.027272727272727], [4000, 8.181818181818182], [5000, 8.363636363636363], [6300, 8.6], [8000, 8.909090909090908], [10000, 9.272727272727273], [12500, 9.727272727272727], [16000, 10], [20000, 10]];
      const interpolatedData = component.interpolateData();

      expect(interpolatedData).to.deep.equal(expectedInterpolatedData);
    });
  });

  describe('designLowShelvingFilter', () => {
    it('should correctly set the low shelving filter coefficients', () => {
      component.designLowShelvingFilter(component.get('biquadCoefficients')[0], component.get('parametricFilters')[0]);

      expect(component.get('biquadCoefficients')[0].a1).to.equal(-1.974350491173115);
      expect(component.get('biquadCoefficients')[0].a2).to.equal(0.9749843042733946);
      expect(component.get('biquadCoefficients')[0].b0).to.equal(0.9944174859295497);
      expect(component.get('biquadCoefficients')[0].b1).to.equal(-1.974567183072868);
      expect(component.get('biquadCoefficients')[0].b2).to.equal(0.9803501264440918);
    });
  });

  describe('designHighShelvingFilter', () => {
    it('should correctly set the high shelving filter coefficients', () => {
      component.designHighShelvingFilter(component.get('biquadCoefficients')[4], component.get('parametricFilters')[4]);

      expect(component.get('biquadCoefficients')[4].a1).to.equal(-0.5745400084354133);
      expect(component.get('biquadCoefficients')[4].a2).to.equal(0.3752543761825408);
      expect(component.get('biquadCoefficients')[4].b0).to.equal(1.1643280761628507);
      expect(component.get('biquadCoefficients')[4].b1).to.equal(-0.8269656654109927);
      expect(component.get('biquadCoefficients')[4].b2).to.equal(0.4633519569952693);
    });
  });

  describe('designPeakFilter', () => {
    it('should correctly set the high shelving filter coefficients', () => {
      for (let i = 1; i < 4; i++) {
        component.designPeakFilter(component.get('biquadCoefficients')[i], component.get('parametricFilters')[i]);
      }

      expect(component.get('biquadCoefficients')[1].a1).to.equal(-1.9859520180676133);
      expect(component.get('biquadCoefficients')[1].a2).to.equal(0.9877675109025541);
      expect(component.get('biquadCoefficients')[1].b0).to.equal(1.0047601471990337);
      expect(component.get('biquadCoefficients')[1].b1).to.equal(-1.9859520180676131);
      expect(component.get('biquadCoefficients')[1].b2).to.equal(0.9830073637035202);

      expect(component.get('biquadCoefficients')[2].a1).to.equal(-1.9242693227921346);
      expect(component.get('biquadCoefficients')[2].a2).to.equal(0.9368370104559751);
      expect(component.get('biquadCoefficients')[2].b0).to.equal(0.9809913247535235);
      expect(component.get('biquadCoefficients')[2].b1).to.equal(-1.9242693227921346);
      expect(component.get('biquadCoefficients')[2].b2).to.equal(0.9558456857024515);

      expect(component.get('biquadCoefficients')[3].a1).to.equal(-1.921517744290212);
      expect(component.get('biquadCoefficients')[3].a2).to.equal(0.9662499373237833);
      expect(component.get('biquadCoefficients')[3].b0).to.equal(1.050305678452051);
      expect(component.get('biquadCoefficients')[3].b1).to.equal(-1.9215177442902123);
      expect(component.get('biquadCoefficients')[3].b2).to.equal(0.9159442588717325);
    });
  });

  describe('parametricEqDesignGainsDb', () => {
    it('should return the correct gains in dB for a set of frequencies', () => {
      const frequencies = [20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];
      const expectedGains = [-10.112438647075667, -10.172497588801164, -10.264950487037252, -10.40055468721241, -10.553571592160441, -10.650679365283956, -10.317002344353252, -8.846871355230897, -5.840957633744815, -1.9257223192835187, 0.7321300487885828, 3.142267374968081, 5.161589770379974, 1.662923843380855, 0.10243183910529015, -2.0362156080925318, -6.89286622614559, -1.1657154645411472, 4.242832789702436, 9.548630247755451, 2.82894850765166, 1.0226985806300477, 0.3856154340846808, 0.10042691724314917, 0.021990765750448477, 0.3041147996889412, 1.267474177694927, 2.0305526236928655, 2.162896892830319, 2.074012255511736, 2.008225513362384];

      component.designLowShelvingFilter(component.get('biquadCoefficients')[0], component.get('parametricFilters')[0]);
      component.designHighShelvingFilter(component.get('biquadCoefficients')[4], component.get('parametricFilters')[4]);

      for (let i = 1; i < 4; i++) {
        component.designPeakFilter(component.get('biquadCoefficients')[i], component.get('parametricFilters')[i]);
      }

      const gains = component.parametricEqDesignGainsDb(frequencies);

      expect(gains._data).to.deep.equal(expectedGains);
    });
  });
});
