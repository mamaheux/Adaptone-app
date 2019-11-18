import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupComponentTest} from 'ember-mocha';
import {htmlSafe} from '@ember/template'

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
      describe('rangeValues', () => {
        it('should return the biggest and smallest X and Y coordinates', () => {
          expect(component.get('rangeValues').smallestX).to.equal(1);
          expect(component.get('rangeValues').smallestY).to.equal(2);
          expect(component.get('rangeValues').biggestX).to.equal(5);
          expect(component.get('rangeValues').biggestY).to.equal(6);
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
              x: 60,
              y: 61,
              style: htmlSafe('position:absolute;top:61px;left:60px'),
              type: 'm'
            },
            {
              x: 100,
              y: 101,
              style: htmlSafe('position:absolute;top:101px;left:100px'),
              type: 'm'
            }
          ];

          const expectedSpeakerPositions = [
            {
              x: 140,
              y: 141,
              style: htmlSafe('position:absolute;top:142px;left:140px'),
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

          console.log(component.get('speakerPositions'));
          expect(component.get('micPositions')).to.deep.equal(expectedMicPositions);
          expect(component.get('speakerPositions')).to.deep.equal(expectedSpeakerPositions);
        });
      });
    });
  });
});
