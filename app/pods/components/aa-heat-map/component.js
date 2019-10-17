import PositionsMap from '../aa-positions-map/component';
import h337 from 'heatmap.js';

const MIC_ICON_X_OFFSET = 15;
const MIC_ICON_Y_OFFSET = 20;

const GREEN_GRADIENT_COLOR = '#09131a';
const YELLOW_GRADIENT_COLOR = '#00254f';
const RED_GRADIENT_COLOR = '#006eee';

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
    const {micPositions, radius} = this.getProperties('micPositions', 'radius');
    const config = {
      container: canvasWrapper,
      backgroundColor: GREEN_GRADIENT_COLOR,
      radius,
      gradient: {
        0: GREEN_GRADIENT_COLOR,
        0.5: YELLOW_GRADIENT_COLOR,
        1: RED_GRADIENT_COLOR
      }
    };

    const heatMap = h337.create(config);
    const {min, max} = this.getProperties('min', 'max');

    heatMap.setData({
      max,
      min,
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
