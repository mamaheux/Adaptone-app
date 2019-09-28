# Format des paquets envoyés par le socket entre l'application et le serveur C++.

Chaque paquet comprend un **seqId** qui permet de rapidement identifier la nature du paquet. Le reste des données comprises dans le paquet dépend de son type.

| seqId | paquet |
| --- | --- |
| *Étapes* |
| 0  | [Choix d'une configuration](#choix-de-configuration) |
| 1  | [Création paramètres initiaux](#création-paramètres-initiaux) |
| 2  | [Lancer routine initialisation](#lancer-routine-initialisation)  |
| 3  | [Confirmation des positions](#confirmation-des-positions) |
| 4  | [Relancer initialisation](#relancer-initialisation)  |
| 5  | [Confirmation](#confirmation)  |
| 6  | [Optimiser les emplacements](#optimiser-les-emplacements) |
| 7  | [Emplacements optimisés](#emplacements-optimisés)  |
| 8  | [Relancer optimisation des positions](#relancer-optimisation-des-positions) |
| 9  | [Confirmation finale](#confirmation-finale) |
| *Inputs utilisateurs* |
| 10  | [Changer le gain d'une entrée](#changer-le-gain-dune-entrée) |
| 11  | [Changer le gain des entrées](#changer-le-gain-des-entrées) |
| 12  | [Changer les gains de l'EQ d'une entrée](#changer-les-gains-de-leq-dune-entrée) |
| 13  | [Changer le volume d'une entrée dans le mixage principal](#changer-le-volume-dune-entrée-dans-le-mixage-principal) |
| 14  | [Change le volume des entrées dans le mixage principal](#changer-le-volume-des-entrées-dans-le-mixage-pricipal) |
| 15  | [Changer le volume d'une entrée dans un mixage auxilière](#changer-le-volume-dune-entrée-dans-un-mixage-auxilière) |
| 16  | [Changer le volume des entrées dans un mixage auxilière](#changer-le-volume-des-entrées-dans-un-mixage-auxilière) |
| 17  | [Changer les gains de l'EQ des sorties principales](#changer-les-gains-de-leq-des-sorties-principales) |
| 18  | [Changer les gains de l'EQ d'une sortie auxiliaire](#changer-les-gains-de-leq-dune-sortie-auxiliaire) |
| 19  | [Changer le volume des sorties principales](#changer-le-volume-des-sorties-principales) |
| 20  | [Changer le volume d'une sortie auxiliaire](#changer-le-volume-dune-sortie-auxiliaire) |
| 24  | [Charger une configuration](#charger-une-configuration) |
| *Échanges de données* |
| 21 | [Taux erreur](#taux-erreur) |
| 22 | [Spectre sonore des entrées](#spectre-sonore-des-entrées) |
| 23 | [Niveaux sonores (peakmeter)](#niveaux-sonores-peakmeter) |
| *Structure d'un channel* |
| 24 | [Mère](#structure-mère) |
| 25 | [Entrée](#structure-entrée) |
| 26 | [Master](#structure-master) |
| 27 | [Auxiliaire](#structure-auxiliaire) |
| 28 | [Entrée master](#structure-entrée-master) |
| 29 | [Entrée auxiliaire](#structure-entrée-auxiliaire) |

## Étapes

### Choix de configuration

```json
{
  "seqId": 0,
  "data": {
    "id": 10,
    "name": "super nom",
    "inputChannelIds": [1, 2, 3, 5],
    "speakersNumber": 4,
    "auxiliaryChannelIds": [6, 7, 8, 9],
    "positions": [
      {
        "x": 140,
        "y": 340,
        "type": "s"
      }
    ]
  }
}
```

### Création paramètres initiaux

```json
{
  "seqId": 1,
  "data": {
    "id": 10,
    "name": "super nom",
    "inputChannelIds": [1, 2, 3, 5],
    "speakersNumber": 4,
    "auxiliaryChannelIds": [6, 7, 8, 9]
  }
}
```

### Lancer routine initialisation

```json
{
  "seqId": 2
}
```

### Confirmation des positions

```json
{
  "seqId": 3,
  "data": {
    "firstSymmetryPositions": [
      {
        "x": 140,
        "y": 340,
        "type": "s"
      }
    ],
    "secondSymmetryPositions": [
      {
        "x": 340,
        "y": 140,
        "type": "s"
      }
    ]
  }
}
```

### Relancer initialisation

```json
{
  "seqId": 4
}
```

### Confirmation

```json
{
  "seqId": 5,
  "data": {
    "symmetry": 0
  }
}
```

### Optimiser les emplacements

```json
{
  "seqId": 6
}
```

### Emplacements optimisés

```json
{
  "seqId": 7,
  "data": {
    "positions": [
      {
        "x": 140,
        "y": 340,
        "type": "s"
      }
    ]
  }
}
```

### Relancer optimisation des positions

```json
{
  "seqId": 8
}
```

### Confirmation finale

```json
{
  "seqId": 9
}
```

## Inputs utilisateur

Les gains ne sont pas en dB.

### Changer le gain d'une entrée

```json
{
  "seqId": 10,
  "data": {
    "channelId": 0,
    "gain": 1.2
  }
}
```

### Changer le gain des entrées

```json
{
  "seqId": 11,
  "data": {
    "gains": [
      {
        "channelId": 1,
        "gain" : 0.2
      },      
      {
        "channelId": 5,
        "gain" : 0.2
      }
    ]
  }
}
```

### Changer les gains de l'EQ d'une entrée

```json
{
  "seqId": 12,
  "data": {
    "channelId": 0,
    "gains": [1.0, 1.2, 1.23]
  }
}
```

### Changer le volume d'une entrée dans le mixage principal

```json
{
  "seqId": 13,
  "data": {
    "channelId": 0,
    "gain": 1.0
  }
}
```

### Changer le volume des entrées dans le mixage pricipal

```json
{
  "seqId": 14,
  "data": {
    "gains": [
      {
        "channelId": 1,
        "gain" : 0.2
      },      
      {
        "channelId": 5,
        "gain" : 0.2
      }
    ]
  }
}
```

### Changer le volume d'une entrée dans un mixage auxiliaire

```json
{
  "seqId": 15,
  "data": {
    "channelId": 0,
    "auxiliaryChannelId": 0,
    "gain": 1.0
  }
}
```

### Changer le volume des entrées dans un mixage auxilière

```json
{
  "seqId": 16,
  "data": {
    "auxiliaryChannelId": 0,
    "gains": [
      {
        "channelId": 1,
        "gain" : 0.2
      },      
      {
        "channelId": 5,
        "gain" : 0.2
      }
    ]
  }
}
```

### Changer les gains de l'EQ des sorties principales

```json
{
  "seqId": 17,
  "data": {
    "gains": [1.0, 1.2, 1.23]
  }
}
```

### Changer les gains de l'EQ d'une sortie auxiliaire

```json
{
  "seqId": 18,
  "data": {
    "channelId": 0,
    "gains": [1.0, 1.2, 1.23]
  }
}
```

### Changer le volume des sorties principales

```json
{
  "seqId": 19,
  "data": {
    "gain": 1.0
  }
}
```

### Changer le volume d'une sortie auxiliaire

```json
{
  "seqId": 20,
  "data": {
    "channelId": 0,
    "gain": 1.0
  }
}
```

## Échanges de données

### Taux erreur

```json
{
  "seqId": 21,
  "data": {
    "positions": [
      {
        "x": 140,
        "y": 340,
        "type": "s",
        "errorRate": 0.12
      }
    ]
  }
}
```

### Spectre sonore des entrées

L'amplitude n'est pas en dB.

```json
{
  "seqId": 22,
  "data": {
    "spectrums": [
      {
        "channelId": 0,
        "points": [
          {
            "freq": 500,
            "amplitude": 4
          }
        ]
      }
    ]
  }
}
```

### Niveaux sonores (peakmeter)

Les niveaux sonores ne sont pas en dB.

```json
{
  "seqId": 23,
  "data": {
    "inputAfterGain": [
      {
        "channelId": 1,
        "level": 0.1
      },
      {
        "channelId": 2,
        "level": 0.3
      }
    ],
    "inputAfterEq": [
      {
        "channelId": 1,
        "level": 0.1
      },
      {
        "channelId": 2,
        "level": 0.3
      }
    ],
    "outputAfterGain": [
      {
        "channelId": 1,
        "level": 0.1
      },
      {
        "channelId": 2,
        "level": 0.3
      }
    ]
  }
}
```

### Charger une configuration
```json
{
  "seqId": 24,
  "data": {
    "channels":{
      "inputs":[
        {
          "channelId":1,
          "gain":4.74,
          "isMuted":false,
          "isSolo":false,
          "eqGains": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1]
        },
        {
          "channelId":2,
          "gain":4.74,
          "isMuted":false,
          "isSolo":true,
          "eqGains": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1]
        }
      ],
      "master":{
        "gain":80,
        "isMuted":false,
        "inputs":[
          {
            "channelId":1,
            "gain":48
          },
          {
            "channelId":2,
            "gain":77
          }
        ],
        "eqGains": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1]
      },
      "auxiliaries":[
        {
          "data":{ 
            "auxiliaryChannelId":10,
            "gain":21,
            "isMuted":false,
            "inputs":[
              {
                "channelId":1,
                "gain":46,
              },
              {
                "channelId":2,
                "gain":45,
              }
            ],
            "eqGains": [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1]
          }
        }
      ]
    }
  }
}
```

## Structure d'un channel

### Structure mère
```json
{
  "inputs": [],
  "master": master,
  "auxiliaries": []
}
```

### Structure entrée
```json
{
  "data": {
    "channelId": 1,
    "auxiliaryChannelId": null,
    "channelName": "Input 1",
    "gain": 3.00,
    "volume": 50,   
    "paramEq": [],
    "graphEq": [],
    "isMuted": false,
    "isSolo": false,

  }
}
```

### Structure Master
```json
{
  "data": {
    "channelId": 0,
    "auxiliaryChannelId": null,
    "isMasterOutput": true,
    "channelName": "Master",
    "gain": 3.00,
    "volume": 50,
    "paramEq": [],
    "graphEq": [],
    "isMuted": false,
    "isSolo": false,
    "inputs": []
  }
}
```

### Structure auxiliaire
```json
{
  "data": {
    "channelId": 1,
    "auxiliaryChannelId": 1,
    "isAuxiliaryOutput": true,
    "channelName": "Aux 1",
    "gain": 3.00,
    "volume": 50,
    "paramEq": [],
    "graphEq": [],
    "isMuted": false,
    "isSolo": false,
    "inputs": []
  }
}
```

### Structure entrée Master
```json
{
  "data": {
    "channelId": 1,
    "auxiliaryChannelId": null,
    "isMasterInput": true,
    "gain": 3.00,
    "isMuted": false,
    "isSolo": false
  }
}
```

### Structure entrée auxiliaire
```json
{
  "data": {
    "channelId": 2,
    "auxiliaryChannelId": 1,
    "isAuxiliaryInput": true,
    "gain": 3.00,
    "isMuted": false,
    "isSolo": false
  }
}
```
