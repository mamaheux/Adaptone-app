import Component from '@ember/component';

export default Component.extend({
  actions: {
    onClick() {
      if (this.get('onClick')) {
        this.get('onClick')();
      }
    }
  }
});
