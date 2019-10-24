import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([value, decimals]) {
    const percentage = value * 100;

    return `${percentage.toFixed(percentage % 1 === 0 ? 0 : decimals)}%`;
  }
});
