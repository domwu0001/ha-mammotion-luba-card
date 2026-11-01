# Mammotion Luba Card

Eine Lovelace-Custom-Card für Mammotion Luba-Mähroboter in Home Assistant. Optisch und funktional an die Bedienlogik der [Vacuum Card](https://github.com/juju35/ha-vacuum-card) angelehnt, aber mit den Entitäten und Aktionen der [Mammotion-HA-Integration](https://github.com/mikey0000/Mammotion-HA).

> Aktueller Entwicklungsstand: frühe Entwicklung (0.1.0). Zunächst wird der Mammotion Luba 2 Mini unterstützt. Die Architektur soll später weitere Luba-Modelle aufnehmen. Die Card erwartet eine `lawn_mower`-Entity der [Mammotion-HA-Integration](https://github.com/mikey0000/Mammotion-HA).

## Funktionen

- Statusanzeige (Mäht, pausiert, Rückkehr, Ladestation, bereit)
- Akkuanzeige, Fortschritt und Mähstatistiken
- Start, Pause, Zur Ladestation und Aufgabe abbrechen
- Schnitthöhe, Mähgeschwindigkeit und Satellitenqualität (falls die entsprechenden Sensoren aktiviert sind)
- Selbsttest und optionale Diagnose
- Optionale Kartenansicht über eine Camera- oder Image-Entity
- Light-/Dark-Theme über Home-Assistant-CSS-Variablen
- Konfigurierbare Entity-IDs, da Entity-IDs vom Gerätenamen abhängen

## Installation über HACS

1. Öffne HACS → **⋮** → **Benutzerdefinierte Repositories**.
2. Repository hinzufügen: `domwu0001/ha-mammotion-luba-card`.
3. Kategorie: **Dashboard**.
4. Mammotion Luba Card installieren.
5. Dashboard neu laden (gegebenenfalls Browser-Cache aktualisieren).

Nach Veröffentlichung eines GitHub-Releases stellt der Release-Workflow die gebaute Datei `dist/ha-mammotion-luba-card.js` bereit. HACS verwendet das Repository als Lovelace-Dashboard-Plugin.

## Installation (manuell)

1. Kopiere `dist/ha-mammotion-luba-card.js` nach `/config/www/ha-mammotion-luba-card.js`.
2. Öffne **Einstellungen → Dashboards → Ressourcen**.
3. Füge `/local/ha-mammotion-luba-card.js` mit Typ **JavaScript-Modul** hinzu.
4. Lade den Browser neu.

## Konfiguration

Minimal:

```yaml
type: custom:ha-mammotion-luba-card
entity: lawn_mower.luba_2_mini
```

Empfohlen mit expliziten Sensor-Entities (Beispiel-IDs an die eigenen Entity-IDs anpassen):

```yaml
type: custom:ha-mammotion-luba-card
entity: lawn_mower.luba_2_mini
name: Luba 2 Mini
battery: sensor.luba_2_mini_battery_percent
progress: sensor.luba_2_mini_progress
area: sensor.luba_2_mini_area
elapsed: sensor.luba_2_mini_elapsed_time
remaining: sensor.luba_2_mini_left_time
activity: sensor.luba_2_mini_activity_mode
self_check: sensor.luba_2_mini_self_check
blade_height: sensor.luba_2_mini_blade_height
mowing_speed: sensor.luba_2_mini_mowing_speed
gps_stars: sensor.luba_2_mini_gps_stars
map_entity: camera.luba_2_mini_map
show_map: true
show_details: true
show_controls: true
show_quick_actions: true
show_progress: true
show_diagnostics: false
confirm_stop: true
accent_color: "#5f9b50"
```

### Optionen

| Option | Standard | Beschreibung |
|---|---:|---|
| `entity` | erforderlich | Mammotion `lawn_mower`-Entity |
| `name` | Gerätename | Angezeigter Titel |
| `battery` | automatisch | Akku-Sensor (`battery_percent`) |
| `progress` | automatisch | Aufgabenfortschritt (`progress`) |
| `area` | automatisch | Aktuelle Fläche (`area`) |
| `elapsed` / `remaining` | automatisch | Vergangene bzw. verbleibende Minuten |
| `activity` | automatisch | Aktivitäts-/Status-Sensor (`activity_mode`) |
| `self_check` | automatisch | Selbsttest-Sensor (`self_check`) |
| `blade_height` | automatisch | Schnitthöhe (`blade_height`) |
| `mowing_speed` | automatisch | Mähgeschwindigkeit (`mowing_speed`) |
| `gps_stars` | automatisch | GPS-Satelliten (`gps_stars`) |
| `task` | — | Optionaler Sensor/Entity für den aktuellen Aufgabennamen |
| `map_entity` | — | Camera- oder Image-Entity für eine Karte |
| `map_height` | `230` | Höhe der Karte in Pixel |
| `show_map` | `true` | Kartenbereich anzeigen |
| `show_details` | `true` | Diagnosebereich anzeigen |
| `show_controls` | `true` | Aktionsbuttons anzeigen |
| `show_quick_actions` | `true` | Schnitthöhe, Geschwindigkeit, GPS anzeigen |
| `show_progress` | `true` | Fortschrittsbalken anzeigen |
| `show_diagnostics` | `false` | Zusätzliche Entity-Diagnose anzeigen |
| `compact` | `false` | Kompaktere Darstellung |
| `confirm_stop` | `true` | Abfrage vor Abbruch einer Mähaufgabe |
| `language` | `auto` | `auto`, `de` oder `en` |
| `accent_color` | HA-Primärfarbe | Eigene Akzentfarbe |
| `image` | Emoji-Fallback | URL zu einem eigenen Roboterbild |

## Mammotion-Aktionen

Die Karte ruft die native Home-Assistant-`lawn_mower`-Plattform auf:

- `lawn_mower.start_mowing`
- `lawn_mower.pause`
- `lawn_mower.dock`

Der Stopp-Button verwendet den Mammotion-Service `mammotion.cancel_job` (die Integration verwendet diesen Service für die Bereinigung der laufenden Aufgabe). Die Aktionsbuttons benötigen eine verfügbare `lawn_mower`-Entity.

## Hinweise

- Die automatische Sensorerkennung sucht nach den üblichen Entity-ID-Suffixen anhand des `lawn_mower`-Namens. Da Namen/IDs durch den Gerätenamen und individuelle Anpassungen variieren, können Sensoren explizit konfiguriert werden.
- Die Karten-/Map-Ansicht erwartet eine Camera-/Image-Entity, die ein Bild über `entity_picture` bereitstellt. Die Mammotion-Integration stellt GeoJSON-Services für Karten bereit; diese sind nicht dasselbe wie eine klassische Kamera-Entity. Für eine GeoJSON-Kartenintegration siehe die vom Mammotion-HA-Projekt verlinkten Dashboard-Plugins.
- Die Karte liest keine privaten Mammotion-API-Daten direkt, sondern nutzt ausschließlich die Home-Assistant-Entity-Zustände und Services.

## Entwicklung

```bash
npm run build
npm run check
npm test
```

## Lizenz

MIT. Nicht mit Mammotion verbunden oder von Mammotion unterstützt.
