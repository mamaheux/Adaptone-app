import Component from '@ember/component';

export default Component.extend({
  isOn: false,

  actions: {
    togglePower() {
      this.set('isOn', !this.get('isOn'));
    }
  }
});
