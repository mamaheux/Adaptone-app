import { expect } from 'chai';
import {describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';

describe('Unit | Component | aa-positions-map', function() {
  setupComponentTest('aa-positions-map', {
    unit: true
  });

  let component;

  describe('with positions', () => {
    beforeEach(function() {
      const positions = [
        {
          x: 1,
          y: 2,
          type: 'm'
        },
        {
          x: 3,
          y: 4,
          type: 'm'
        },
        {
          x: 5,
          y: 6,
          type: 's'
        }
      ];

      component = this.subject();
      component.set('positions', positions);
    });

    describe('computed', () => {
      describe('maxima', () => {
        it('should return the biggest X and Y coordinates', () => {
          expect(component.get('maxima').biggestX).to.equal(5);
          expect(component.get('maxima').biggestY).to.equal(6);
        });
      });
    });

    describe('functions', () => {
      describe('setMicPositions', () => {
        it('should properly set the mic positions', () => {
          component.setMicPositions();

          expect(component.get('micPositions').length).to.equal(2);
          expect(component.get('micPositions')).to.deep.equal([
            {
              x: 1,
              y: 2,
              type: 'm'
            },
            {
              x: 3,
              y: 4,
              type: 'm'
            }
          ]);
        });
      });

      describe('setSpeakerPositions', () => {
        it('should properly set the mic positions', () => {
          component.setSpeakerPositions();

          expect(component.get('speakerPositions').length).to.equal(1);
          expect(component.get('speakerPositions')).to.deep.equal([
            {
              x: 5,
              y: 6,
              type: 's'
            }
          ]);
        });
      });

      describe('adjustPositions', () => {
        it('should assign the proper mic and speaker position and styles', () => {
          const expectedMicPositions = [
            {
              x: 30,
              y: 51,
              style: 'position:absolute;top:51px;left:30px',
              type: 'm'
            },
            {
              x: 90,
              y: 101,
              style: 'position:absolute;top:101px;left:90px',
              type: 'm'
            }
          ];

          const expectedSpeakerPositions = [
            {
              x: 150,
              y: 152,
              style: 'position:absolute;top:152px;left:150px',
              type: 's'
            }
          ];

          const canvas = {
            clientWidth: 200,
            clientHeight: 202
          };

          component.setMicPositions();
          component.setSpeakerPositions();
          component.adjustPositions(canvas);

          expect(component.get('micPositions')).to.deep.equal(expectedMicPositions);
          expect(component.get('speakerPositions')).to.deep.equal(expectedSpeakerPositions);
        });
      });
    });
  });
});
