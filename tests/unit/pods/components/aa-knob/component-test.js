import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Service from '@ember/service';
import {htmlSafe} from '@ember/template'

const retrieveGestures = () => {
  return null;
}

const gesturesServiceStub = Service.extend({
  retrieve: retrieveGestures
});

describe('Unit | Component | aa-knob', function() {
  setupComponentTest('aa-knob', {
    unit: true
  });

  let component;

  describe('with min, mid and max', () => {
    beforeEach(function() {
      this.register('service:-gestures', gesturesServiceStub);
      component = this.subject();
      component.setProperties({
        min: 16,
        mid: 600,
        max: 12000,
        onValueChange: function() {
          return 0;
        }
      });
    });

    describe('computed', () => {
      describe('normalizedValue', () => {
        it('should return the normalized value from the value', () => {
          component.set('value', 16);
          expect(Math.round(component.get('normalizedValue'))).to.equal(-132);
          component.set('value', 600);
          expect(Math.round(component.get('normalizedValue'))).to.equal(-119);
          component.set('value', 12000);
          expect(Math.round(component.get('normalizedValue'))).to.equal(132);
        });

        it('should return the normalized value from the value on small ranges', () => {
          component.setProperties({
            min: 1,
            mid: 2,
            max: 4,
            onValueChange: function() {
              return 0;
            }
          });

          component.set('value', 1);
          expect(Math.round(component.get('normalizedValue'))).to.equal(-132);
          component.set('value', 2);
          expect(Math.round(component.get('normalizedValue'))).to.equal(-44);
          component.set('value', 4);
          expect(Math.round(component.get('normalizedValue'))).to.equal(132);
        });
      });

      describe('dialStyle', () => {
        it('should return the css values for the dial', () => {
          component.set('normalizedValue', 132);
          expect(component.get('dialStyle')).to.deep.equal(htmlSafe('transform: translate(-50%, -50%) rotate(132deg);'));
        });
      });

      describe('outerStyle', () => {
        it('should return the css values for the dial', () => {
          component.set('normalizedValue', 132);
          expect(component.get('outerStyle')).to.deep.equal(htmlSafe('stroke-dashoffset: 0;'));
        });
      });
    });

    describe('private functions', () => {
      describe('getNewValue', () => {
        it('should be correct in the first sector', () => {
          const result = component._getNewValue(-10, 15, 0, 16, 10000, -10.1);

          expect(Math.round(result)).to.equal(16);
        });

        it('should be correct in the second sector', () => {
          const result = component._getNewValue(10, 5000, 0, 16, 10000, 10.1);

          expect(Math.round(result)).to.equal(4445);
        });
      });
    });
  });
});
