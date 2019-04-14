import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    if (this.controllerFor('console').get('channels') === null) {
      this.controllerFor('console').set('channels', [
        {
          seqId: 10,
          data: {
            channelId: 0,
            channelName: 'Left',
            gain: 3.00,
            volume: 50,
            isMuted: false,
            isSolo: false,
            paramEq: [
              {
                id: 0,
                on: true,
                freq: 100,
                q: 1,
                gain: 0
              },
              {
                id: 1,
                on: true,
                freq: 300,
                q: 5,
                gain: 0
              },
              {
                id: 2,
                on: true,
                freq: 800,
                q: 5,
                gain: 0
              },
              {
                id: 3,
                on: true,
                freq: 1500,
                q: 5,
                gain: 0
              },
              {
                id: 4,
                on: true,
                freq: 8000,
                q: 1,
                gain: 0
              }
            ],
            graphEq: [
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              }
            ]
          }
        },
        {
          seqId: 10,
          data: {
            channelId: 1,
            channelName: 'Right',
            gain: 3.00,
            volume: 50,
            isMuted: false,
            isSolo: false,
            paramEq: [
              {
                id: 0,
                on: true,
                freq: 100,
                q: 1,
                gain: 0
              },
              {
                id: 1,
                on: true,
                freq: 300,
                q: 5,
                gain: 0
              },
              {
                id: 2,
                on: true,
                freq: 800,
                q: 5,
                gain: 0
              },
              {
                id: 3,
                on: true,
                freq: 1500,
                q: 5,
                gain: 0
              },
              {
                id: 4,
                on: true,
                freq: 8000,
                q: 1,
                gain: 0
              }
            ],
            graphEq: [
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              }
            ]
          }
        },
        {
          seqId: 10,
          data: {
            channelId: 3,
            channelName: 'Master',
            gain: 3.0,
            volume: 50,
            isMuted: false,
            isSolo: false,
            paramEq: [
              {
                id: 0,
                on: true,
                freq: 100,
                q: 1,
                gain: 0
              },
              {
                id: 1,
                on: true,
                freq: 300,
                q: 5,
                gain: 0
              },
              {
                id: 2,
                on: true,
                freq: 800,
                q: 5,
                gain: 0
              },
              {
                id: 3,
                on: true,
                freq: 1500,
                q: 5,
                gain: 0
              },
              {
                id: 4,
                on: true,
                freq: 8000,
                q: 1,
                gain: 0
              }
            ],
            graphEq: [
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              },
              {
                id: 0,
                value: 0
              }
            ]
          }
        }
      ]);
    };

    return params;
  }
});
