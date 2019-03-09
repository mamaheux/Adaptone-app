import Component from '@ember/component';

export default Component.extend({
  options: null,
  columns: null,

  init() {
    this._super(...arguments);

    this.set('columns', {});
    this.splitIntoColumns();
  },

  splitIntoColumns() {
    const options = this.get('options');
    let columnIndex = 0;
    let rowCount = 0;
    this.columns[columnIndex] = [];

    options.forEach((option, i) => {
      if (rowCount >= 3 || i === options.length - 1) {
        columnIndex++;
        this.columns[columnIndex] = [];
        rowCount = 0;
      }

      this.columns[columnIndex].push(option);
      rowCount++;
    });
  }
});
