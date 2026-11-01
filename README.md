# Mammotion Luba Card

Eine Lovelace-Custom-Card für Mammotion Luba-Mähroboter in Home Assistant. Zunächst wird der Luba 2 Mini unterstützt; weitere Luba-Modelle sollen folgen.

Sie nutzt die [Mammotion-HA-Integration](https://github.com/mikey0000/Mammotion-HA) und orientiert sich gestalterisch an der [Vacuum Card](https://github.com/juju35/ha-vacuum-card).

## Installation über HACS

1. HACS → ⋮ → Benutzerdefinierte Repositories.
2. `domwu0001/ha-mammotion-luba-card` hinzufügen.
3. Kategorie **Dashboard** auswählen und installieren.
4. Dashboard neu laden.

## Konfiguration

```yaml
type: custom:ha-mammotion-luba-card
entity: lawn_mower.luba_2_mini
```

Optionale Sensoren und Darstellungseinstellungen findest du im README und in der visuellen Kartenkonfiguration. Die Entity-IDs hängen von deiner Mammotion-Integration ab.

## Entwicklung

```bash
npm run check
npm test
```

Ein GitHub Release wird durch einen Tag im Format `v*.*.*` erstellt. Der Workflow veröffentlicht `dist/ha-mammotion-luba-card.js`.

MIT License. Nicht mit Mammotion verbunden oder von Mammotion unterstützt.
