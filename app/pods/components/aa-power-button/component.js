import Component from '@ember/component';

export default Component.extend({
  isOn: false,
  toggleFilter: null,

  actions: {
    togglePower() {
      this.toggleProperty('isOn');
      this.get('toggleFilter')(this.get('isOn'));
    }
  }
});
