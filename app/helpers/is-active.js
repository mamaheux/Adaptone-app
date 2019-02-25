import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([index, active]) {
    return index === active ? 'active' : 'inactive';
  }
});
