import Component from '@ember/component';

export default Component.extend({
  isOptimizing: false,

  actions: {
    startOptimization() {
      this.set('isOptimizing', true);
    }
  }
});
