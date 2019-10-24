import {percentage} from 'adaptone-front/helpers/percentage';
import {expect} from 'chai';
import {describe, it} from 'mocha';

const ratio = 0.0442;
const ratioToTruncate = 0.04;

describe('Unit | Helper | percentage', () => {
  it('should return a percentage with 2 decimals', () => {
    expect(percentage(ratio, 2)).to.equal('4.42%');
  });

  it('should truncate the decimals on zeros', () => {
    expect(percentage(ratioToTruncate, 2)).to.equal('4%');
  });
});
