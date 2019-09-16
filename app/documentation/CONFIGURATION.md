# Format de la configuration en session et dans le fichier de configurations.

```json
{
  "id": 1,
  "name": "example_config",
  "monitorsNumber": "2",
  "speakersNumber": "345",
  "probesNumber": "5",
  "positions":[],
  "step": 4,
  "channels": {
    "master": {
      "data": {
        "channelId": 0,
        "auxiliaryChannelId": null,
        "channelName": "Master",
        "gain": 3.00,
        "volume": 50,
        "isMuted": false,
        "isSolo": false,
        "inputs": [
          {
            "data": {
              "channelId": 2,
              "auxiliaryChannelId": null,
              "channelName": "Input 1",
              "gain": 3.00,
              "volume": 50,
              "isMuted": false,
              "isSolo": false,
              "paramEq": [
                {
                  "id": 0,
                  "on": true,
                  "freq": 100,
                  "q": 1,
                  "gain": 0
                }
              ],
              "graphEq": [
                {
                  "id": 0,
                  "value": 0
                }
              ]
            }
          }
        ],
        "paramEq": [
          {
            "id": 0,
            "on": true,
            "freq": 100,
            "q": 1,
            "gain": 0
          }
        ],
        "graphEq": [
          {
            "id": 0,
            "value": 0
          }
        ]
      }
    },
    "auxiliaries": [
      {
        "data": {
          "channelId": 1,
          "auxiliaryChannelId": 1,
          "channelName": "Aux 1",
          "gain": 3.00,
          "volume": 50,
          "isMuted": false,
          "isSolo": false,
          "inputs": [
            {
              "portId": 1,
              "data": {
                "channelId": 4,
                "auxiliaryChannelId": 1,
                "channelName": "Input 3",
                "gain": 3.00,
                "volume": 50,
                "isMuted": false,
                "isSolo": false,
                "paramEq": [
                  {
                    "id": 0,
                    "on": true,
                    "freq": 100,
                    "q": 1,
                    "gain": 0
                  }
                ],
                "graphEq": [
                  {
                    "id": 0,
                    "value": 0
                  }
                ]
              }
            }
          ],
          "paramEq": [
            {
              "id": 0,
              "on": true,
              "freq": 100,
              "q": 1,
              "gain": 0
            }
          ],
          "graphEq": [
            {
              "id": 0,
              "value": 0
            }
          ]
        }
      }
    ]
  }
}
```

Le fichier de configuration contient un array de configs.
