import Component from '@ember/component';
import {set} from '@ember/object';

export default Component.extend({
  isParametric: false,
  parametricFilters: null,
  graphicFilters: null,
  currentFilter: null,

  init() {
    this._super(...arguments);

    if (this.get('isParametric')) this._setCurrentFilter();
  },

  actions: {
    onFilterClick(selectedFilter) {
      const previouslySelectedFilter = this.get('parametricFilters').find(filter => filter.isSelected === true);
      if (previouslySelectedFilter) set(previouslySelectedFilter, 'isSelected', false);

      set(selectedFilter, 'isSelected', true);
      this.set('currentFilter', selectedFilter);
    }
  },

  _setCurrentFilter() {
    const parametricFilters = this.get('parametricFilters');
    const selectedFilter = parametricFilters.find(filter => filter.isSelected === true);
    if (selectedFilter) {
      this.set('currentFilter', selectedFilter)
    } else {
      this.parametricFilters[0].isSelected = true;
      this.set('currentFilter', parametricFilters[0])
    }
  }
});
