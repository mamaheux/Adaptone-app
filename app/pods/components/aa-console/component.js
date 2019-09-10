import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  connection: service('connection'),
  session: service('session'),

  channels: null,
  positions: null,

  init() {
    this._super(...arguments);

    // TODO : Remove this but leave it in for now as it makes testing the whole app easier
    this.set('positions', {
      seqId: 11,
      data: {
        positions: [
          {
            x: 5,
            y: 5,
            type: 's'
          },
          {
            x: 90,
            y: 5,
            type: 's'
          },
          {
            x: 45,
            y: 10,
            type: 's'
          },
          {
            x: 5,
            y: 10,
            type: 'm',
            errorRate: 0.12
          },
          {
            x: 10,
            y: 15,
            type: 'm',
            errorRate: 0.09
          },
          {
            x: 30,
            y: 30,
            type: 'm',
            errorRate: 0.07
          },
          {
            x: 50,
            y: 15,
            type: 'm',
            errorRate: 0.09
          },
          {
            x: 80,
            y: 30,
            type: 'm',
            errorRate: 0.13
          }
        ]
      }
    });
  },

  _updateSessionConfiguration() {
    const configuration = this.get('session').get('configuration');
    const channelsData = this.get('channels');

    configuration.channels = channelsData;

    this.get('session').set('configuration', configuration);
  },

  actions: {
    onChannelMuteChange(_) {
      this._updateSessionConfiguration();
      // Handle channel mute change here
    },

    onChannelSoloChange(_) {
      this._updateSessionConfiguration();
      // Handle channel solo change here
    },

    onVolumeChange(_) {
      this._updateSessionConfiguration();
    },

    saveConfiguration() {
      this.get('session').dumpSessionInFile();
    }
  }
});
