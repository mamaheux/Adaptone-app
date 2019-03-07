import PositionsMap from '../aa-positions-map/component';

export default PositionsMap.extend({
  radius: null,
  redThreshold: null,
  yellowThreshold: null,

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.element.querySelector('canvas');

    this.generateHeatGradients(canvas);
  },

  generateHeatGradients(canvas) {
    const micPositions = this.get('micPositions');
    const {yellowThreshold, redThreshold, radius} = this.getProperties('yellowThreshold', 'redThreshold', 'radius');
    let context = canvas.getContext('2d');

    micPositions.forEach(micPosition => {
      let gradient;

      if (yellowThreshold <= micPosition.value && micPosition.value <= redThreshold) {
        gradient = context.createRadialGradient(micPosition.x, micPosition.y, 0, micPosition.x, micPosition.y, radius);
        gradient.addColorStop(0, '#eed200');
        gradient.addColorStop(1, '#00ee7f');
      } else if (micPosition.value > redThreshold) {
        gradient = context.createRadialGradient(micPosition.x, micPosition.y, 0, micPosition.x, micPosition.y, radius);
        gradient.addColorStop(0, '#ee0038');
        gradient.addColorStop(0.5, '#eed200');
        gradient.addColorStop(1, '#00ee7f');
      }

      if (gradient) {
        context.beginPath();
        context.arc(micPosition.x, micPosition.y, radius, 0, 2*Math.PI, false);
        context.fillStyle = gradient;
        context.fill();
      }
    });
  }
});
