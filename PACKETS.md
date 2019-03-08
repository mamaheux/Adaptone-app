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

### Relancer initialisation

```json
{
  "seqId": 4
}
```

### Confirmation

```json
{
  "seqId": 5
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

### Channel infos

```json
{
  "seqId": 10,
  "data": {
    "channelId": 1,
    "channelName": "Master",
    "gain": 75,
    "volume": 100,
    "paramEq": [
      {
        "id": 0,
        "on": true,
        "freq":  1000,
        "q": 4.4,
        "gain": 20
      }
    ],
    "graphEq": [
      {
        "id": 0,
        "value": 50
      }
    ]
  }
}
```

## Échanges de données

### Taux erreur

```json
{
  "seqId": 11,
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

### Spectre sonore entrée

```json
{
  "seqId": 12,
  "data": {
    "channelId": 1,
    "points": [
      {
        "freq": 500,
        "amplitude": 4
      }
    ]
  }
}
```
