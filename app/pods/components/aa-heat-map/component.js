import Component from '@ember/component';
import {computed, set} from '@ember/object';
import {htmlSafe} from '@ember/template'

// Constants
const MIC_TYPE = 'm';
const SPEAKER_TYPE = 's';
const CANVAS_PADDING = 50;

export default Component.extend({

  micPositions: null,
  speakerPositions: null,
  radius: null,
  redThreshold: null,
  yellowThreshold: null,

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.element.querySelector('canvas');

    this.setMicPositions();
    this.setSpeakerPositions();

    this.adjustPositions(canvas);
    this.generateHeatGradients(canvas);
  },

  maxima: computed('positions', function() {
    const xPositions = this.get('positions').map(position => position.x);
    const yPositions = this.get('positions').map(position => position.y);

    const biggestX = Math.max(...xPositions);
    const biggestY = Math.max(...yPositions)

    return {biggestX, biggestY};
  }),

  adjustPositions(canvas) {
    const {maxima, micPositions, speakerPositions} = this.getProperties('maxima', 'micPositions', 'speakerPositions');

    const widthRatio = (canvas.clientWidth - CANVAS_PADDING) / (maxima.biggestX);
    const heightRatio = (canvas.clientHeight - CANVAS_PADDING) / (maxima.biggestY);

    micPositions.forEach((micPosition, i) => {
      const currentMicPosition = micPositions.objectAt(i);

      set(currentMicPosition, 'x', Math.round(micPosition.x * widthRatio));
      set(currentMicPosition, 'y', Math.round(micPosition.y * heightRatio));
      set(currentMicPosition, 'value', micPosition.value);
      set(currentMicPosition, 'style', htmlSafe(`position:absolute;top:${micPosition.y}px;left:${micPosition.x}px`));
    });

    speakerPositions.forEach((speakerPosition, i) => {
      const currentSpeakerPosition = speakerPositions.objectAt(i);

      set(currentSpeakerPosition, 'x', Math.round(speakerPosition.x * widthRatio));
      set(currentSpeakerPosition, 'y', Math.round(speakerPosition.y * heightRatio));
      set(currentSpeakerPosition, 'style', htmlSafe(`position:absolute;top:${speakerPosition.y}px;left:${speakerPosition.x}px`));
    });
  },

  setMicPositions() {
    this.set('micPositions', this.get('positions').filter(position => position.type === MIC_TYPE));
  },

  setSpeakerPositions() {
    this.set('speakerPositions', this.get('positions').filter(position => position.type === SPEAKER_TYPE));
  },

  generateHeatGradients(canvas) {
    const micPositions = this.get('micPositions');
    const {yellowThreshold, redThreshold, radius} = this.getProperties('yellowThreshold', 'redThreshold', 'radius');
    const height = canvas.clientHeight;
    const width = canvas.clientWidth;
    let context = canvas.getContext('2d');

    micPositions.forEach(micPosition => {
      let gradient = null;

      if (yellowThreshold < micPosition.value < redThreshold) {
        gradient = context.createRadialGradient(micPosition.x, micPosition.y, radius, micPosition.x, micPosition.y, radius + 100);
        gradient.addColorStop(0, '#eed200');
        gradient.addColorStop(1, '#00ee7f');
      } else if (micPosition.value > redThreshold) {
        gradient = context.createRadialGradient(micPosition.x, micPosition.y, radius, micPosition.x, micPosition.y, radius + 100);
        gradient.addColorStop(0, '#ee0038');
        gradient.addColorStop(0.5, '#eed200');
        gradient.addColorStop(1, '#00ee7f');
      }

      if (gradient) {
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
      }
    });
  }
});
