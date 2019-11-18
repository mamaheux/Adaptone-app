import {tooltipHelper} from 'adaptone-front/helpers/tooltip-helper';
import {expect} from 'chai';
import {describe, it} from 'mocha';

const micPosition = {x: 2};
const canvas = {clientWidth: 6};

describe('Unit | Helper | tooltip-helper', () => {
  describe('when the mic x position is inferior to half the canvas width', () => {
    it('should return right', () => {
      expect(tooltipHelper(micPosition, canvas)).to.equal('right');
    });
  });

  describe('when the mic x position is superior to half the canvas width', () => {
    it('should return right', () => {
      micPosition.x = 5;
      expect(tooltipHelper(micPosition, canvas)).to.equal('left');
    });
  });
});
