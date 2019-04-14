import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {later} from '@ember/runloop';

export default Component.extend({
  connection: service('connection'),

  channels: null,
  positions: null,

  init() {
    this._super(...arguments);

    later(this, this.initJetson, 500);

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

  actions: {
    onChannelMuteChange(channel) {
      // Handle channel mute change here
      return channel;
    },

    onChannelSoloChange(channel) {
      // Handle channel solo change here
      return channel;
    }
  },

  initJetson() {
    let messages = [];

    messages.push({
      seqId: 11,
      data: {
        gains: [3.0, 3.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
      }
    });

    messages.push({
      seqId: 13,
      data: {
        channelId: 0,
        gain: 1.0
      }
    });

    messages.push({
      seqId: 13,
      data: {
        channelId: 1,
        gain: 1.0
      }
    });

    messages.push({
      seqId: 17,
      data: {
        gain: 1.0
      }
    });

    messages.push({
      seqId: 12,
      data: {
        channelId: 0,
        gains: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      }
    });

    messages.push({
      seqId: 12,
      data: {
        channelId: 1,
        gains: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      }
    });

    messages.push({
      seqId: 15,
      data: {
        gains: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      }
    });

    for (let i = 0; i < messages.length; i++) {
      this.get('connection').sendMessage(messages[i]);
    }
  }
});
