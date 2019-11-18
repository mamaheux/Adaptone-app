import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([micPosition, canvas]) {
    if (micPosition.x >= canvas.clientWidth / 2) {
      return 'left';
    }

    return 'right';
  }
});
