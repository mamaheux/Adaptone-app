import Component from '@ember/component';

export default Component.extend({
  channels: null,
  positions: null,

  init() {
    this._super(...arguments);

    this.set('channels', [
      {
        seqId: 10,
        data: {
          channelId: 1,
          channelName: 'Vocals',
          gain: 75,
          volume: 100,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq: 1000,
              q: 4.4,
              gain: 20
            }
          ],
          graphEq: [
            {
              id: 0,
              value: 50
            }
          ]
        }
      },
      {
        seqId: 10,
        data: {
          channelId: 1,
          channelName: 'Guitar',
          gain: 40,
          volume: 60,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq: 1000,
              q: 4.4,
              gain: 20
            }
          ],
          graphEq: [
            {
              id: 0,
              value: 50
            }
          ]
        }
      },
      {
        seqId: 10,
        data: {
          channelId: 1,
          channelName: 'Bass',
          gain: 20,
          volume: 10,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq: 1000,
              q: 4.4,
              gain: 20
            }
          ],
          graphEq: [
            {
              id: 0,
              value: 50
            }
          ]
        }
      },
      {
        seqId: 10,
        data: {
          channelId: 2,
          channelName: 'Drum',
          gain: 10,
          volume: 40,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq: 1000,
              q: 4.4,
              gain: 20
            }
          ],
          graphEq: [
            {
              id: 0,
              value: 50
            }
          ]
        }
      },
      {
        seqId: 10,
        data: {
          channelId: 1,
          channelName: 'Master',
          gain: 40,
          volume: 60,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq: 1000,
              q: 4.4,
              gain: 20
            }
          ],
          graphEq: [
            {
              id: 0,
              value: 50
            }
          ]
        }
      }
    ]);

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
    onChannelVolumeChange(channel) {
      // Handle channel volume change here
      // debounce(this, this.sendVolumeChange, channelVolume, DEBOUNCE_TIME)
      return channel;
    },

    onChannelMuteChange(channel) {
      // Handle channel mute change here
      return channel;
    },

    onChannelSoloChange(channel) {
      // Handle channel solo change here
      return channel;
    }
  }
});
