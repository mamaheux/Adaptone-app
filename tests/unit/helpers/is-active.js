import {isActive} from 'adaptone-front/helpers/is-active';
import {expect} from 'chai';
import {describe, it} from 'mocha';

describe('Unit | Helper | is active', () => {
  it('should return active if the parameters are the same', () => {
    expect(isActive(2, 2)).to.equal('active');
  });

  it('should return inactive if the parameters are the same', () => {
    expect(isActive(1, 2)).to.equal('inactive');
  });
});
