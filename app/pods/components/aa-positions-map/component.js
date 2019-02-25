import Component from '@ember/component';
import {computed} from '@ember/object';

// Constants
const MIC_TYPE = 'm';
const SPEAKER_TYPE = 's';
const CANVAS_PADDING = 50;

export default Component.extend({

  micPositions: null,
  speakerPositions: null,

  didInsertElement() {
    this._super(...arguments);

    const canvas = this.element.querySelector('canvas');

    this._setMicPositions();
    this._setSpeakerPositions();

    this._adjustPositions(canvas);
  },

  maxima: computed('positions', function() {
    const xPositions = this.get('positions').map(position => position.x);
    const yPositions = this.get('positions').map(position => position.y);

    const biggestX = Math.max(...xPositions);
    const biggestY = Math.max(...yPositions)

    return {biggestX, biggestY};
  }),

  _adjustPositions(canvas) {
    const maxima = this.get('maxima');
    const micPositions = this.get('micPositions');
    const speakerPositions = this.get('speakerPositions');

    const widthRatio = (canvas.clientWidth - CANVAS_PADDING) / (maxima.biggestX);
    const heightRatio = (canvas.clientHeight - CANVAS_PADDING) / (maxima.biggestY);

    micPositions.forEach((micPosition, i) => {
      micPositions[i].x = Math.round(micPosition.x * widthRatio);
      micPositions[i].y = Math.round(micPosition.y * heightRatio);
      micPositions[i].style = `position:absolute;top:${micPosition.y}px;left:${micPosition.x}px`;
    });

    speakerPositions.forEach((speakerPosition, i) => {
      speakerPositions[i].x = Math.round(speakerPosition.x * widthRatio);
      speakerPositions[i].y = Math.round(speakerPosition.y * heightRatio);
      speakerPositions[i].style = `position:absolute;top:${speakerPosition.y}px;left:${speakerPosition.x}px`;
    });

    this.set('micPositions', micPositions);
    this.set('speakerPositions', speakerPositions);
  },

  _setMicPositions() {
    this.set('micPositions', this.get('positions').filter(position => position.type === MIC_TYPE));
  },

  _setSpeakerPositions() {
    this.set('speakerPositions', this.get('positions').filter(position => position.type === SPEAKER_TYPE));
  }
});
