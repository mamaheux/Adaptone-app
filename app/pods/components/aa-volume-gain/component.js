/* eslint-disable no-magic-numbers */

import Component from '@ember/component';
import {observer} from '@ember/object';

export default Component.extend({
  volumeChanged: observer('volume', function() {
    let formattedVolume = this.volume;
    formattedVolume /= 100;

    this.onVolumeChange(formattedVolume);
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
