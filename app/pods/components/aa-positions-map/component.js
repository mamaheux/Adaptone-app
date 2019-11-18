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

  rangeValues: computed('positions', function() {
    const xPositions = this.get('positions').map(position => position.x);
    const yPositions = this.get('positions').map(position => position.y);

    const biggestX = Math.max(...xPositions);
    const biggestY = Math.max(...yPositions);
    const smallestX = Math.min(...xPositions);
    const smallestY = Math.min(...yPositions);

    return {smallestX, biggestX, smallestY, biggestY};
  }),

  adjustPositions(canvas) {
    const {rangeValues, micPositions, speakerPositions} = this.getProperties('rangeValues', 'micPositions', 'speakerPositions');

    const realClientWidth = canvas.clientWidth - (2 * CANVAS_PADDING);
    const realClientHeight = canvas.clientHeight - (2 * CANVAS_PADDING);

    micPositions.forEach((micPosition, i) => {
      const currentMicPosition = micPositions.objectAt(i);

      let normalizedX;
      let normalizedY;

      if (realClientWidth > realClientHeight) {
        normalizedX = (micPosition.x - rangeValues.smallestX) / (rangeValues.biggestX - rangeValues.smallestX) * realClientHeight + CANVAS_PADDING + ((canvas.clientWidth - canvas.clientHeight) / 2);
        normalizedY = (micPosition.y - rangeValues.smallestY) / (rangeValues.biggestY - rangeValues.smallestY) * realClientHeight + CANVAS_PADDING;
      } else {
        normalizedX = (micPosition.x - rangeValues.smallestX) / (rangeValues.biggestX - rangeValues.smallestX) * realClientWidth + CANVAS_PADDING;
        normalizedY = (micPosition.y - rangeValues.smallestY) / (rangeValues.biggestY - rangeValues.smallestY) * realClientWidth + CANVAS_PADDING + ((canvas.clientHeight - canvas.clientWidth) / 2);
      }

      set(currentMicPosition, 'x', Math.round(normalizedX));
      set(currentMicPosition, 'y', Math.round(normalizedY));
      set(currentMicPosition, 'value', micPosition.value);
      set(currentMicPosition, 'style', htmlSafe(`position:absolute;top:${normalizedY}px;left:${normalizedX}px`));
    });

    speakerPositions.forEach((speakerPosition, i) => {
      const currentSpeakerPosition = speakerPositions.objectAt(i);

      let normalizedX;
      let normalizedY;

      if (realClientWidth > realClientHeight) {
        normalizedX = (speakerPosition.x - rangeValues.smallestX) / (rangeValues.biggestX - rangeValues.smallestX) * realClientHeight + CANVAS_PADDING + ((canvas.clientWidth - canvas.clientHeight) / 2);
        normalizedY = (speakerPosition.y - rangeValues.smallestY) / (rangeValues.biggestY - rangeValues.smallestY) * realClientHeight + CANVAS_PADDING;
      } else {
        normalizedX = (speakerPosition.x - rangeValues.smallestX) / (rangeValues.biggestX - rangeValues.smallestX) * realClientWidth + CANVAS_PADDING;
        normalizedY = (speakerPosition.y - rangeValues.smallestY) / (rangeValues.biggestY - rangeValues.smallestY) * realClientWidth + CANVAS_PADDING + ((canvas.clientHeight - canvas.clientWidth) / 2);
      }

      set(currentSpeakerPosition, 'x', Math.round(normalizedX));
      set(currentSpeakerPosition, 'y', Math.round(normalizedY));
      set(currentSpeakerPosition, 'style', htmlSafe(`position:absolute;top:${normalizedY}px;left:${normalizedX}px`));
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
