import PositionsMap from '../aa-positions-map/component';
import h337 from 'heatmap.js';

const MIC_ICON_X_OFFSET = 15;
const MIC_ICON_Y_OFFSET = 20;

export default PositionsMap.extend({
  radius: null,
  max: null,
  min: null,

  didInsertElement() {
    this._super(...arguments);

    const canvasWrapper = this.element.querySelector('.canvas-wrapper');

    this.generateHeatMap(canvasWrapper);
  },

  generateHeatMap(canvasWrapper) {
    const micPositions = this.get('micPositions');
    const config = {
      container: canvasWrapper,
      backgroundColor: '#00ee7f',
      blur: 0.75,
      radius: this.get('radius'),
      gradient: {
        '0': '#00ee7f',
        '0.5': '#eed200',
        '1': '#ee0038'
      }
    };

    const heatMap = h337.create(config);
    heatMap.setData({
      max: this.get('max'),
      min: this.get('min'),
      data: []
    })

    micPositions.forEach(micPosition => {
      heatMap.addData({
        x: micPosition.x + MIC_ICON_X_OFFSET,
        y: micPosition.y + MIC_ICON_Y_OFFSET,
        value: micPosition.value
      })
    });
  }
});
