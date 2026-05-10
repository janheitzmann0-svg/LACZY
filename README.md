# LACZY

**LCA, aber entspannt.** Sprich oder tippe — finde sofort den QNG-Code für jeden Baustoff. Eigene Materialien anlegen. Voll offline-fähig. Auf jedem Gerät installierbar.

---

## Was ist drin?

Diese 9 Dateien zusammen sind die fertige App:

```
index.html              — App + 388 QNG-Standardeinträge + 64 Hersteller-Default
manifest.webmanifest    — PWA-Definition (Name, Farben, Icons)
sw.js                   — Service Worker (Offline-Cache + Update-Mechanik)
icon-192.png            — Icon (Android Standard)
icon-512.png            — Icon (Android groß)
icon-512-maskable.png   — Icon (Android adaptive Form)
apple-touch-icon.png    — Icon (iOS Homescreen)
favicon.png             — Browser-Tab Icon
README.md               — diese Datei
```

Alles statisch — kein Server, kein Build-Schritt, kein Backend.

---

## Hosten via GitHub Pages — 5 Minuten

1. **GitHub-Account** anlegen (falls noch nicht vorhanden, gratis)
2. Auf [github.com](https://github.com) auf **„New repository"** klicken
3. Repository-Name: z.B. `laczy` — auf **Public** stellen, **„Create repository"**
4. Im neuen Repo auf **„uploading an existing file"** klicken
5. Alle 9 Dateien aus dem `lca-app/`-Ordner per Drag & Drop hochladen → **„Commit changes"**
6. **Settings** → **Pages** → unter „Branch" `main` und Ordner `/ (root)` wählen → **Save**
7. Nach 1–2 Minuten: deine App läuft unter `https://DEIN-USERNAME.github.io/laczy/`

Diesen Link kannst du teilen — wer ihn auf dem Smartphone öffnet, kann LACZY direkt installieren.

> **Wichtig:** Nur über `https://` aufrufen, nicht `http://`. Service Worker und PWA-Installation funktionieren nur verschlüsselt. GitHub Pages liefert HTTPS automatisch.

---

## Installation auf den Geräten

### Android (Chrome / Edge / Samsung Internet)
- App im Browser öffnen → oben rechts erscheint nach kurzer Zeit ein **„Installieren"**-Knopf
- Alternativ: Browser-Menü → **„App installieren"** oder **„Zum Startbildschirm hinzufügen"**
- LACZY erscheint dann als eigenständige App im Launcher

### iPhone / iPad (Safari)
- App in Safari öffnen *(funktioniert nur in Safari, nicht in Chrome auf iOS)*
- Unten auf das **Teilen**-Symbol (Quadrat mit Pfeil ⬆) tippen
- **„Zum Home-Bildschirm"** wählen → **„Hinzufügen"**
- LACZY zeigt beim ersten Start einen Hinweis mit dieser Anleitung

### Desktop (Chrome / Edge)
- App öffnen → in der Adressleiste rechts erscheint ein kleines Installations-Symbol
- Klicken → **„Installieren"** → LACZY läuft als eigenständiges Fenster

### Firefox
Firefox unterstützt PWA-Installation nicht nativ. Die App läuft trotzdem im Browser, lässt sich nur nicht „installieren". Workaround: Lesezeichen oder Tab-Pin.

---

## Features

### Suche
- **Sprache** (Mikrofon, Dauerhören) oder **Tippen**
- Nach Material-Name, Nummer (z.B. `5.45`), Kategorie, Notiz
- Filter-Pills nach Kategorie

### Standard / Eigene / Alles (Tabs)
- **Standard**: 388 offizielle QNG-Rechenwerte 2023
- **Eigene**: 64 Hersteller-Defaults + alle selbst angelegten Materialien
- **Alles**: kombiniert

### Eigene Materialien anlegen
Klick auf **„+ Eigenes Material"**:
- **Bezeichnung** — z.B. „Schöck Isokorb XT-Type-K"
- **QNG-Code** — Zuordnung zu einem Standard-Eintrag (Auto-Vervollständigung). Live-Hinweis zeigt sofort, ob der Code gültig ist und welcher Standard-Eintrag dahintersteht.
- **Notiz** *(optional)* — z.B. „Wärmebrückentrennung Balkon"

Eigene Materialien erscheinen mit grünem Strich, „Eigenes"-Tag und Verlinkung zum offiziellen Standard-Eintrag. Per Stift-Symbol bearbeiten oder löschen.

### Backup (sehr empfehlenswert!)
Ober rechts der **Datenbank-Knopf** öffnet das Backup-Menü:
- **Exportieren** → JSON-Datei mit allen eigenen Materialien (Empfehlung: regelmäßig sichern)
- **Importieren** → Datei einlesen (z.B. nach Browser-Reset oder auf neuem Gerät)
- **Alle löschen** → Reset

> **Warum Backup?** Eigene Materialien werden im Browser-Speicher (`localStorage`) abgelegt. Sie überleben App-Updates und Offline-Reloads problemlos. Sie gehen aber verloren, wenn du den Browser-Speicher manuell löschst, die App deinstallierst oder das Gerät wechselst. Ein Export pro Monat reicht — die Datei kann in der Cloud, per E-Mail an dich selbst, oder lokal gesichert werden.

### Offline
Nach dem ersten Laden funktioniert LACZY komplett ohne Internet. Service Worker cached die ganze App-Shell. Status-Anzeige oben links zeigt „Online" (grün) oder „Offline · läuft trotzdem" (terra).

---

## Updates an LACZY

LACZY ist eine PWA — Updates funktionieren anders als bei klassischen Apps:

### Wenn du etwas an der App änderst:

1. **Datei(en) ändern** (z.B. Materialien in `index.html` ergänzen, Texte anpassen, neue Hersteller-Einträge)
2. **In `sw.js` die Versionsnummer hochzählen** (das ist der Schalter, der die Update-Logik auslöst):

   ```js
   const VERSION = 'laczy-v2.0.0';   // → 'laczy-v2.0.1'
   ```

3. **Geänderte Dateien auf GitHub neu hochladen** (oder direkt im Browser editieren mit dem Stift-Icon)

### Was dann auf den installierten Geräten passiert:

- Beim nächsten Öffnen der App erkennt der Service Worker das Update
- Oben in der App erscheint ein **grünes Banner: „Eine neue Version ist verfügbar — Aktualisieren"**
- Tap darauf → App lädt neu mit den Änderungen → fertig
- Niemand muss die App deinstallieren oder neu installieren
- **Eigene Materialien bleiben dabei erhalten** (`localStorage` wird vom Update nicht angefasst)

### Was du ohne Programmierung ändern kannst

In `index.html`:
- **Materialien** ergänzen oder editieren in den Daten-Arrays `FIRST_ORDER` (Standard, Zeile ~520 ff.) und `SECOND_ORDER` (Hersteller, Zeile ~910 ff.) — Format ist offensichtlich
- **Texte/Überschriften** im HTML-Body anpassen
- **Farben** in den CSS-Variablen oben (`:root { --bg: ... }`) — die ganze Eco-Palette ist dort als ~20 Variablen definiert, einmal ändern = überall durch
- **Quellenhinweis** unten am Seitenende

Mit etwas HTML/CSS-Verständnis: neue Filter, neue Felder pro Eintrag, andere Layouts — alles in einer Datei.

---

## Technische Hinweise

- **Browser**: Chrome / Edge / Safari ab Version 2020+. Firefox: läuft, aber keine Installation.
- **Spracherkennung**: nur in Chrome / Edge / Safari (Web Speech API). Texteingabe funktioniert überall.
- **iOS**: Spracherkennung nur in Safari, nicht in Chrome iOS (technische Einschränkung von iOS).
- **Mikrofon**: erfordert HTTPS (auf `localhost` und GitHub Pages gegeben).
- **Datenschutz**: keine Server-Kommunikation. Sprache wird vom Browser an Apple/Google zur Erkennung gesendet (Web Speech API), nicht an LACZY. Eigene Materialien bleiben im Browser-Speicher des Geräts.
- **Lizenz QNG-Daten**: QNG-Rechenwerte 2023 v1.3 von BBSR / Ökobaudat (öffentlich, frei nutzbar).

---

## Troubleshooting

| Problem | Lösung |
|---|---|
| App lädt nicht offline | Beim ersten Mal muss die Seite einmal komplett mit Internet geladen werden, damit der Service Worker die Dateien cached. Danach geht's auch offline. |
| „Installieren"-Knopf erscheint nicht | Bei Android/Chrome: Seite muss über HTTPS laden. Manchmal hilft 1× Reload. iOS: Knopf gibt's nicht — manueller Weg über Teilen-Menü (siehe oben). |
| Mikrofon reagiert nicht | Browser-Mikrofon-Berechtigung erteilen. iOS: nur in Safari. |
| Update-Banner erscheint nicht nach Änderung | Wurde die `VERSION` in `sw.js` hochgezählt? Ohne Versionsänderung erkennt der Service Worker kein Update. |
| Eigene Materialien plötzlich weg | Browser-Speicher wurde wahrscheinlich gelöscht (Browser-Daten löschen, Inkognito-Modus, Speicher-Reset). Aus Backup-JSON wiederherstellen über das Backup-Menü. |
| App auf neuem Gerät leer | Backup vom alten Gerät als JSON exportieren, auf dem neuen über „Importieren" einlesen. |

---

**LACZY** · Voll offline · Frei verteilbar · Quelle: QNG-Rechenwerte 2023 v1.3 (BBSR / Ökobaudat)
