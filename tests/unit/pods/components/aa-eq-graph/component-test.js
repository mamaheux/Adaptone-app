import {expect} from 'chai';
import {afterEach, describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';

describe('Unit | Component | aa-eq-graph', function() {
  setupTest();

  let component;
  const originalDebounce = Ember.run.debounce;
  
  beforeEach(function() {
    const parametricEqValues = [
      [0, 0],
      [100, 1],
      [1000, 2],
      [10000, 3],
    ];

    const graphicEqValues = [
      [0, 4],
      [100, 5],
      [1000, 6],
      [10000, 7],
    ];

    const spectrums = [
      {
        channelId: 1,
        points: [
          {
            freq: 500,
            amplitude: 4
          },
          {
            freq: 1000,
            amplitude: 2
          },
          {
            freq: 2000,
            amplitude: 8
          },
          {
            freq: 4000,
            amplitude: 2
          }
        ]
      },
      {
        channelId: 2,
        points: [
          {
            freq: 500,
            amplitude: 1
          },
          {
            freq: 1000,
            amplitude: 7
          },
          {
            freq: 2000,
            amplitude: 6
          },
          {
            freq: 4000,
            amplitude: 0
          }
        ]
      },
      {
        channelId: 3,
        points: [
          {
            freq: 500,
            amplitude: 1
          },
          {
            freq: 1000,
            amplitude: 3
          },
          {
            freq: 2000,
            amplitude: 12
          },
          {
            freq: 4000,
            amplitude: 5
          }
        ]
      },
      {
        channelId: 4,
        points: [
          {
            freq: 500,
            amplitude: 6
          },
          {
            freq: 1000,
            amplitude: 1
          },
          {
            freq: 2000,
            amplitude: 3
          },
          {
            freq: 4000,
            amplitude: 2
          }
        ]
      }
    ];

    component = this.owner.factoryFor('component:aa-eq-graph').create({
      channelInfos: {
        data: {
          channelId: 1
        }
      },
      parametricEqValues,
      graphicEqValues,
      isOutput: false,
      spectrums
    });

    Ember.run.debounce = function(target, func, arg, _) {
      func.call(target, arg);
    }
  });

  afterEach(function() {
    Ember.run.debounce = originalDebounce;
  });

  describe('computed', () => {
    describe('currentChannelId', () => {
      it('should return the correct channel id', () => {
        expect(component.get('currentChannelId')).to.equal(1);
      });
    });

    describe('eqGains', () => {
      describe('when the eq is parametric', () => {
        it('should return the sliced and formatted parametric data', () => {
          component.set('isParametric', true);

          expect(component.get('eqGains').length).to.equal(3);
          expect(component.get('eqGains')[0][1]).to.equal(1);
        });
      });

      describe('when the eq is graphic', () => {
        it('should return the sliced and formatted graphic data', () => {
          component.set('isParametric', false);

          expect(component.get('eqGains').length).to.equal(3);
          expect(component.get('eqGains')[0][1]).to.equal(5);
        });
      });
    });

    describe('channelSpectrums', () => {
      describe('when the channel is not an output', () => {
        it('should return the correctly formatted, normalized and decibel current channel spectrum', () => {
          const expectedSpectrumData = [
            [1000, 5.6054933102079],
            [2000, 8.8164799306237],
            [4000, 5.6054933102079]
          ];

          expect(component.get('channelSpectrums')).to.deep.equal(expectedSpectrumData);
        });
      });

      describe('when the channel is an output', () => {
        it ('should not return anything', () => {
          component.set('spectrums', []);
          component.set('isOutput', true);

          expect(component.get('channelSpectrums')).to.be.undefined;
        });
      });
    });
    
    describe('addedChannelsSpectrums', () => {
      describe('when the channel is not an output', () => {
        it('should return the correctly formatted, normalized and decibel current channel spectrum', () => {
          const expectedSpectrumData = [
            [1000, 9.554094320843866],
            [2000, 11.051836238580904],
            [4000, 8.507189546742703]
          ];

          expect(component.get('addedChannelsSpectrums')).to.deep.equal(expectedSpectrumData);
        });
      });

      describe('when the channel is an output', () => {
        it ('should not return anything', () => {
          component.set('spectrums', []);
          component.set('isOutput', true);

          expect(component.get('addedChannelsSpectrums')).to.be.undefined;
        });
      });
    });
  });
});
