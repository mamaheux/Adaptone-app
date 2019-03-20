import Component from '@ember/component';

export default Component.extend({
  channels: null,

  init() {
    this._super(...arguments);

    this.set('channels', [
      {
        seqId: 10,
        data: {
          channelId: 1,
          channelName: "Master",
          gain: 75,
          volume: 100,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq:  1000,
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
        seqId: 11,
        data: {
          channelId: 2,
          channelName: "Bass",
          gain: 60,
          volume: 80,
          isMuted: false,
          isSolo: false,
          paramEq: [
            {
              id: 0,
              on: true,
              freq:  1000,
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
    ]);
  }
});
