import PositionsMap from '../aa-positions-map/component';
import h337 from 'heatmap.js';

const MIC_ICON_X_OFFSET = 15;
const MIC_ICON_Y_OFFSET = 20;

const GREEN_GRADIENT_COLOR = '#00ee7f';
const YELLOW_GRADIENT_COLOR = '#eed200';
const RED_GRADIENT_COLOR = '#ee0038';

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
      backgroundColor: GREEN_GRADIENT_COLOR,
      radius: this.get('radius'),
      gradient: {
        0: GREEN_GRADIENT_COLOR,
        0.5: YELLOW_GRADIENT_COLOR,
        1: RED_GRADIENT_COLOR
      }
    };

    const heatMap = h337.create(config);
    heatMap.setData({
      max: this.get('max'),
      min: this.get('min'),
      data: []
    });

    micPositions.forEach(micPosition => {
      heatMap.addData({
        x: micPosition.x + MIC_ICON_X_OFFSET,
        y: micPosition.y + MIC_ICON_Y_OFFSET,
        value: micPosition.errorRate
      });
    });
  }
});
