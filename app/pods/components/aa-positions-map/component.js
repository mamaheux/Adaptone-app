import Component from '@ember/component';
import {computed, set} from '@ember/object';
import {htmlSafe} from '@ember/template';
import {copy} from '@ember/object/internals';

// Constants
const MIC_TYPE = 'm';
const SPEAKER_TYPE = 's';
const CANVAS_PADDING = 60;

export default Component.extend({
  micPositions: null,
  speakerPositions: null,

  didInsertElement() {
    this._computePositions();
    this._super(...arguments);
  },

  maxima: computed('positions', function() {
    const xPositions = this.get('positions').map(position => position.x);
    const yPositions = this.get('positions').map(position => position.y);

    const biggestX = Math.max(...xPositions);
    const biggestY = Math.max(...yPositions);

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
    const micPositions = this.get('positions').filter(position => position.type === MIC_TYPE);
    this.set('micPositions', copy(micPositions, true));
  },

  setSpeakerPositions() {
    const speakerPositions = this.get('positions').filter(position => position.type === SPEAKER_TYPE);
    this.set('speakerPositions', copy(speakerPositions, true));
  },

  _computePositions() {
    const canvas = this.element.querySelector('canvas');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.setMicPositions();
    this.setSpeakerPositions();

    this.adjustPositions(canvas);
  }
});
