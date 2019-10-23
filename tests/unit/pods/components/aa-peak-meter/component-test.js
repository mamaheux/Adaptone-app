import {expect} from 'chai';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Component | aa-peak-meter', function() {
  setupComponentTest('aa-peak-meter', {
    unit: true
  });

  let component;
  let now;
  let clock;

  beforeEach(function() {
    component = this.subject();

    component.set('meterElements', {
      green: {
        style: {}
      },
      yellow: {
        style: {}
      },
      red: {
        style: {}
      },
      peak: {
        style: {
          height: 0.1
        }
      },
      size: 100,
      peakParameters: {
        value: 0,
        lastTime: 0,
        falling: null,
        fallDuration: component.get('peakFallDuration'),
        delay: component.get('peakFallDelay')
      }
    });

    component.set('max', 10);
    component.set('min', 0);
    component.set('yellowLimit', 5);
    component.set('redLimit', 8);

    now = new Date();
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  describe('normalize', () => {
    describe('when the value is superior to the max', () => {
      it('should return the normalized max', () => {
        const value = 100;
        const normalizedValue = component.normalize(value);

        expect(normalizedValue).to.equal(1);
      });
    });

    describe('when the value is inferior to the min', () => {
      it('should return the normalized min', () => {
        const value = -100;
        const normalizedValue = component.normalize(value);

        expect(normalizedValue).to.equal(0);
      });
    });

    describe('when the value is between max and min', () => {
      it('should return the value', () => {
        const value = 5;
        const normalizedValue = component.normalize(value);

        expect(normalizedValue).to.equal(0.5);
      });
    });
  });

  describe('formatValue', () => {
    it('should correctly format the value', () => {
      const value = 5;
      const formattedValue = component.formatValue(value);

      expect(formattedValue).to.equal('500px');
    });
  });


  describe('updatePeak', () => {
    describe('when the value is superior to the current peak value', () => {
      it('should correctly update the peak', () => {
        const peak = {
          value: 0.1,
          lastTime: 0,
          falling: null,
          fallDuration: 100,
          delay: 10
        };

        const value = 5;

        const updatedPeak = component.updatePeak(peak, value);

        expect(updatedPeak.value).to.equal(0.5);
        expect(updatedPeak.lastTime).to.equal(clock.now);
        expect(updatedPeak.falling).to.be.null;
      });
    });

    describe('when the value is inferior to the current peak value', () => {
      describe('when the current time is greater than the peak`s last time plus fall delay', () => {
        it('should correctly update the falling of the peak', () => {
          const peak = {
            value: 5,
            lastTime: clock.now - 200,
            falling: null,
            fallDuration: 100,
            delay: 10
          };

          const value = 2;

          const updatedPeak = component.updatePeak(peak, value);

          expect(updatedPeak.falling.from).to.equal(peak.value);
          expect(updatedPeak.falling.to).to.equal(0.2);
          expect(updatedPeak.falling.startTime).to.equal(clock.now);
        });
      });
    });
  });

  describe('drawPeakMeter', () => {
    it('should correctly draw the peak meter', () => {
      const meterValue = {
        currentValue: 9,
        peak: {
          value: 1,
          lastTime: 0,
          falling: null,
          fallDuration: 100,
          delay: 10
        }
      };

      component.drawPeakMeter(meterValue);

      expect(component.get('meterElements').green.style.height).to.equal('50px');
      expect(component.get('meterElements').yellow.style.height).to.equal('30px');
      expect(component.get('meterElements').red.style.height).to.equal('10px');
      expect(component.get('meterElements').peak.style.bottom).to.equal('90px');
    });
  });
});
