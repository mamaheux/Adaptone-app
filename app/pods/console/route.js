import Route from '@ember/routing/route';

export default Route.extend({
    model(params) {
      if (this.controllerFor('console').get('channels') === null) {
        const masterInputs = [
        {
          seqId: 10,
          data: {
            channelId: 2,
            portId: 0,
            channelName: 'Input 1',
            gain: 3.00,
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
            portId: 0,
            channelName: 'Input 2',
            gain: 3.00,
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
        }];

        const auxInputs = [
        {
          seqId: 10,
          portId: 1,
          data: {
            channelId: 4,
            portId: 1,
            channelName: 'Input 3',
            gain: 3.00,
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
            channelId: 5,
            portId: 1,
            channelName: 'Input 4',
            gain: 3.00,
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
        }];

        const master = {
          seqId: 10,
          data: {
            channelId: 0,
            channelName: 'Master',
            gain: 3.00,
            volume: 50,
            isMuted: false,
            isSolo: false,
            inputs: masterInputs,
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
        };

        const auxiliaries = [
          {
            seqId: 10,
            data: {
              channelId: 1,
              channelName: 'Aux 1',
              gain: 3.00,
              volume: 50,
              isMuted: false,
              isSolo: false,
              inputs: auxInputs,
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
        ]

        this.controllerFor('console').set('channels', {
          master,
          auxiliaries
        });

        return params;
      }
    }
});
