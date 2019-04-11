import Component from '@ember/component';

export default Component.extend({
  isOn: false,

  actions: {
    togglePower() {
      this.toggleProperty('isOn');

      if (!this.get('isOn')) this.get('onChange')();
    }
  }
});
