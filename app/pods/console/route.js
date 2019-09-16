import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default Route.extend({
  session: service('session'),

  model(params) {
    const configuration = this.get('session').get('configuration');

    if (configuration.channels === undefined) {
      this.controllerFor('console').set('channels', configuration.channels);
    } else {
      const inputs = [
        {
          data: {
            channelId: 2,
            auxiliaryChannelId: null,
            channelName: 'Input 1',
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
          data: {
            channelId: 3,
            auxiliaryChannelId: null,
            channelName: 'Input 2',
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
          portId: 1,
          data: {
            channelId: 4,
            auxiliaryChannelId: 1,
            channelName: 'Input 3',
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
          data: {
            channelId: 5,
            auxiliaryChannelId: 1,
            channelName: 'Input 4',
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
        }
      ];

      const masterInputs = [
        {
          data: {
            channelId: 2,
            auxiliaryChannelId: null,
            channelName: 'Master input 1',
            gain: 3.00,
            isMuted: false,
            isSolo: false
          }
        },
        {
          data: {
            channelId: 3,
            auxiliaryChannelId: null,
            channelName: 'Master input 2',
            gain: 3.00,
            isMuted: false,
            isSolo: false
          }
        }];

      const auxInputs = [
        {
          portId: 1,
          data: {
            channelId: 4,
            auxiliaryChannelId: 1,
            channelName: 'Aux 1 input 3',
            gain: 3.00,
            isMuted: false,
            isSolo: false
          }
        },
        {
          data: {
            channelId: 5,
            auxiliaryChannelId: 1,
            channelName: 'Aux 1 input 4',
            gain: 3.00,
            isMuted: false,
            isSolo: false
          }
        }];

      const master = {
        data: {
          channelId: 0,
          auxiliaryChannelId: null,
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
          data: {
            channelId: 1,
            auxiliaryChannelId: 1,
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
      ];

      this.controllerFor('console').set('channels', {
        inputs,
        master,
        auxiliaries
      });
    }

    return params;
  }
});
