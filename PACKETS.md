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
| 10  | [Channel infos](#channel-infos) |
| *Échanges de données* |
| 11 | [Taux erreur](#taux-erreur) |
| 12 | [Spectre sonore entrée](#spectre-sonore-entrée)

## Étapes

### Choix de configuration

```json
{
  "seqId": 0,
  "data": {
    "id": 10,
    "name": "super nom",
    "monitorsNumber": 5,
    "speakersNumber": 4,
    "probesNumber": 8,
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
    "monitorsNumber": 5,
    "speakersNumber": 4,
    "probesNumber": 8
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
    "gains": [1.0, 1.2, 1.23]
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

### Changer le volume d'une entrée dans un mixage auxilière

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

### Changer les gains de l'EQ des sorties auxiliaires

```json
{
  "seqId": 16,
  "data": {  
    "auxiliaryId": 0,
    "gains": [1.0, 1.2, 1.23]
  }
}
```

## Échanges de données

### Taux erreur

```json
{
  "seqId": 17,
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

L'amplitude est en dB.

```json
{
  "seqId": 18,
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
  "seqId": 19,
  "data": {
    "inputAfterGain": [0.5, 1.5],
    "inputAfterEq": [0.5, 1.5],
    "outputAfterGain": [0.5, 1.5]
  }
}
```
