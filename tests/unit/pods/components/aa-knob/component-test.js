import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import Service from '@ember/service';

const retriveGestures = () => {
  return null;
}

const gesturesServiceStub = Service.extend({
  retrieve: retriveGestures
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
        max: 12000
      });
    });

    describe('computed', () => {
      describe('degreesValue', () => {
        it('should return the normalized degree value from the value', () => {
          component.set('value', 16);
          expect(Math.round(component.get('degreesValue'))).to.equal(4);
          component.set('value', 600);
          expect(Math.round(component.get('degreesValue'))).to.equal(139);
          component.set('value', 1200);
          expect(Math.round(component.get('degreesValue'))).to.equal(149);
        });
      });
    });

    describe('private functions', () => {
      describe('alignTop', () => {
        it('should remove 45 from the angle value', () => {
          const result = component._alignTop(90);

          expect(result).to.equal(45);
        });
      });
    });
  });
});
