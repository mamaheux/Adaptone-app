import Component from '@ember/component';
import {observer} from '@ember/object';

export default Component.extend({
  volumeChanged: observer('volume', function() {
    this.onVolumeChange(this.volume);
  }),

  gainChanged: observer('gain', function() {
    this.onGainChange(this.gain);
  }),

  actions: {
    onIsMutedChange(value) {
      this.get('onIsMutedChange')(value);
    },

    onIsSoloChange(value) {
      this.get('onIsSoloChange')(value);
    }
  }
});
