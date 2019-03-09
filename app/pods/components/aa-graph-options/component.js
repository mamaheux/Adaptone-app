import Component from '@ember/component';

const ROWS_PER_COLUMN = 3;

export default Component.extend({
  options: null,
  columns: null,

  willRender() {
    this._super(...arguments);

    this.set('columns', this.splitIntoColumns());
  },

  splitIntoColumns() {
    const options = this.get('options');
    const columns = {};
    let columnIndex = 0;
    let rowCount = 0;
    columns[columnIndex] = [];

    options.forEach((option, i) => {
      if (rowCount >= ROWS_PER_COLUMN || i === options.length - 1) {
        columnIndex++;
        columns[columnIndex] = [];
        rowCount = 0;
      }

      columns[columnIndex].push(option);
      rowCount++;
    });

    return columns;
  }
});
