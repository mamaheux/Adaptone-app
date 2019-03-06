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

    this.setMicPositions();
    this.setSpeakerPositions();

    this.adjustPositions(canvas);
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

      Ember.set(currentMicPosition, 'x', Math.round(micPosition.x * widthRatio));
      Ember.set(currentMicPosition, 'y', Math.round(micPosition.y * heightRatio));
      Ember.set(currentMicPosition, 'value', micPosition.value);
      Ember.set(currentMicPosition, 'style', `position:absolute;top:${micPosition.y}px;left:${micPosition.x}px`);
    });

    speakerPositions.forEach((speakerPosition, i) => {
      const currentSpeakerPosition = speakerPositions.objectAt(i);

      Ember.set(currentSpeakerPosition, 'x', Math.round(speakerPosition.x * widthRatio));
      Ember.set(currentSpeakerPosition, 'y', Math.round(speakerPosition.y * heightRatio));
      Ember.set(currentSpeakerPosition, 'style', `position:absolute;top:${speakerPosition.y}px;left:${speakerPosition.x}px`);
    });
  },

  setMicPositions() {
    this.set('micPositions', this.get('positions').filter(position => position.type === MIC_TYPE));
  },

  setSpeakerPositions() {
    this.set('speakerPositions', this.get('positions').filter(position => position.type === SPEAKER_TYPE));
  }
});
