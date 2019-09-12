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
| 14  | [Changer le volume d'une entrée dans un mixage auxilière](#changer-le-volume-dune-entrée-dans-un-mixage-auxilière) |
| 15  | [Changer les gains de l'EQ des sorties principales](#changer-les-gains-de-leq-des-sorties-principales) |
| 16  | [Changer les gains de l'EQ d'une sortie auxiliaire](#changer-les-gains-de-leq-dune-sortie-auxiliaire) |
| 17  | [Changer le volume des sorties principales](#changer-le-volume-des-sorties-principales) |
| 18  | [Changer le volume d'une sortie auxiliaire](#changer-le-volume-dune-sortie-auxiliaire) |
| *Échanges de données* |
| 19 | [Taux erreur](#taux-erreur) |
| 20 | [Spectre sonore des entrées](#spectre-sonore-des-entrées) |
| 21 | [Niveaux sonores (peakmeter)](#niveaux-sonores-peakmeter) |
| *Structure d'un channel* |
| 22 | [Mère](#structure-mère) |
| 23 | [Master](#structure-master) |
| 24 | [Auxiliaire](#structure-auxiliaire) |
| 25 | [Entrée master](#structure-entrée-master) |
| 26 | [Entrée auxiliaire](#structure-entrée-auxiliaire) |

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

### Changer le volume d'une entrée dans un mixage auxiliaire

```json
{
  "seqId": 14,
  "data": {
    "channelId": 0,
    "auxiliaryId": 0,
    "gain": 1.0
  }
}
```

### Changer les gains de l'EQ des sorties principales

```json
{
  "seqId": 15,
  "data": {
    "gains": [1.0, 1.2, 1.23]
  }
}
```

### Changer les gains de l'EQ d'une sortie auxiliaire

```json
{
  "seqId": 16,
  "data": {
    "channelId": 0,
    "gains": [1.0, 1.2, 1.23]
  }
}
```

### Changer le volume des sorties principales

```json
{
  "seqId": 17,
  "data": {
    "gain": 1.0
  }
}
```

### Changer le volume d'une sortie auxiliaire

```json
{
  "seqId": 18,
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
  "seqId": 19,
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
  "seqId": 20,
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
  "seqId": 21,
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

## Structure d'un channel

### Structure mère
```json
{
  "master": master,
  "auxiliaries": []
}
```

### Structure Master
```json
{
  "data": {
    "channelId": 0,
    "auxiliaryId": null,
    "channelName": "Master",
    "gain": 3.00,
    "volume": 50,
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
    "auxiliaryId": 1,
    "channelName": "Aux 1",
    "gain": 3.00,
    "volume": 50,
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
    "channelId": 2,
    "auxiliaryId": null,
    "channelName": "Input 1",
    "gain": 3.00,
    "volume": 50,
    "isMuted": false,
    "isSolo": false
  }
}
```

### Structure entrée auxiliaire
```json
{
  "data": {
    "channelId": 3,
    "auxiliaryId": 1,
    "channelName": "Input 2",
    "gain": 3.00,
    "volume": 50,
    "isMuted": false,
    "isSolo": false
  }
}
```
