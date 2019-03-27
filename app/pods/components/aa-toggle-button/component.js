import Component from '@ember/component';

export default Component.extend({
  isActive: false,

  actions: {
    toggleActive() {
      this.toggleProperty('isActive');

      if (this.get('onButtonClick')) {
        this.get('onButtonClick')();
      }
    }
  }
});
