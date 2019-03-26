import Component from '@ember/component';
import {set} from '@ember/object';

export default Component.extend({
  isParametric: true,
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
    const selectedFilter = this.get('parametricFilters').find(filter => filter.isSelected === true);
    if (selectedFilter) this.set('currentFilter', selectedFilter);
  }
});
