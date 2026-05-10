# LACZY — Public Build (GitHub Pages)

**LCA, aber entspannt.** Sprich oder tippe — finde sofort den QNG-Code für jeden Baustoff. Eigene Materialien anlegen. Voll offline-fähig. Auf jedem Gerät installierbar.

> Version v3 — sicherheitsgehärtet. Siehe `SECURITY.md` im Haupt-Ordner für Details.
> Für die self-hosted-Variante: siehe `laczy-internal/`.

---

## Was ist drin?

```
index.html              — App-Shell mit CSP-Headers
app.js                  — Gesamte App-Logik (extern für strikte CSP)
manifest.webmanifest    — PWA-Definition
sw.js                   — Service Worker (gehärtet, Cross-Origin-Whitelist)
icon-192.png            — Icons
icon-512.png
icon-512-maskable.png
apple-touch-icon.png
favicon.png
README.md               — diese Datei
```

Alles statisch. Kein Backend.

---

## Hosten via GitHub Pages

1. **GitHub-Account** anlegen — **2FA aktivieren!** (Settings → Password and authentication)
2. Neues Repository anlegen → Public → "Create repository"
3. Alle 9 Dateien aus dem `laczy-public/`-Ordner hochladen → "Commit changes"
4. Settings → Pages → Branch `main` → Folder `/ (root)` → Save
5. Settings → Branches → Branch Protection Rule für `main` (Pull Requests erzwingen)
6. App läuft unter `https://DEIN-USERNAME.github.io/REPO-NAME/`

Für Production: **eigene Domain** in Pages-Settings eintragen (z.B. `laczy.firma.de`), HTTPS erzwingen.

---

## Installation auf den Geräten

### Android (Chrome / Edge / Samsung Internet)
- App im Browser öffnen → "Installieren"-Knopf erscheint oben rechts
- Alternativ: Browser-Menü → "App installieren" / "Zum Startbildschirm hinzufügen"

### iPhone / iPad (Safari)
- App in Safari öffnen *(nur Safari auf iOS — Chrome iOS geht nicht)*
- Teilen-Symbol ⬆ → "Zum Home-Bildschirm" → "Hinzufügen"

### Desktop (Chrome / Edge)
- App öffnen → Installations-Symbol in Adressleiste → "Installieren"

### Firefox
Keine native PWA-Installation. App läuft im Browser, lässt sich nicht installieren. Workaround: Lesezeichen.

---

## Features

### Suche
- Sprache (Mikrofon, Dauerhören) oder Tippen
- Nach Name, Nummer (z.B. `5.45`), Kategorie, Notiz
- Filter-Pills nach Kategorie

### Tabs
- **Standard**: 388 offizielle QNG-Rechenwerte 2023
- **Eigene**: 64 Hersteller-Defaults + alle selbst angelegten
- **Alles**: kombiniert

### Eigene Materialien
- "+ Eigenes Material" → Bezeichnung, QNG-Code (Auto-Vervollständigung & Validation), Notiz
- Live-Hinweis: zeigt sofort den hinterlegten Standard-Eintrag
- Bearbeiten / Löschen per Stift-Symbol

### Backup
Datenbank-Knopf oben rechts:
- **Exportieren**: JSON-Datei mit allen eigenen Materialien (regelmäßig sichern!)
- **Importieren**: JSON-Datei einlesen
- **Löschen**: Reset

Eigene Materialien werden im Browser-Speicher (`localStorage`) gespeichert. Überleben Updates, gehen aber bei Browser-Reset / anderem Gerät verloren — daher Backup-Disziplin.

### Offline
Nach erstem Laden funktioniert die App komplett offline. Status-Anzeige oben links.

---

## Updates an der App

Bei Code-Änderung:
1. Datei(en) ändern
2. `VERSION` in `sw.js` hochzählen, z.B. `'laczy-v3.0.0'` → `'laczy-v3.0.1'`
3. Auf GitHub hochladen / committen

Auf installierten Geräten:
- Beim nächsten Öffnen erscheint oben das **"Aktualisieren"-Banner**
- Tap → App lädt neu mit Änderungen
- Eigene Materialien bleiben erhalten

---

## Sicherheit

Die App ist v3-sicherheitsgehärtet — siehe `SECURITY.md` im Haupt-Ordner für volles Bedrohungsmodell und alle Maßnahmen.

**Wichtigste Punkte:**

✅ Content Security Policy aktiv (blockt Inline-Script-Injection, externe Script-Loads)
✅ Render via DOM-API (strukturell XSS-sicher)
✅ Input-Sanitisierung mit Längenlimits und Zeichen-Whitelist
✅ Service Worker mit Cross-Origin-Whitelist
✅ Permissions-Policy: Kamera/USB/Geo/Sensoren deaktiviert
⚠️ Einige Header (`frame-ancestors`, `eval`-Schutz) wirken nur in der Internal-Variante mit echten HTTP-Headern
⚠️ Phishing-Klone und kompromittierte Endgeräte sind **nicht** durch die App lösbar — siehe `SECURITY.md`

---

## Technisches

- **Browser**: Chrome / Edge / Safari (2020+). Firefox: läuft, keine PWA-Installation.
- **Spracherkennung**: nur Chrome / Edge / Safari (Web Speech API).
- **iOS**: Sprache nur in Safari, nicht in Chrome iOS.
- **HTTPS Pflicht** für Mikrofon und Service Worker.
- **Datenschutz**: keine Server-Kommunikation (außer Google Fonts CSS/WOFF). Sprache wird vom Browser an Apple/Google zur Erkennung gesendet, nicht an LACZY.
- **Quelle QNG-Daten**: BBSR / Ökobaudat, QNG-Rechenwerte 2023 v1.3.

---

## Troubleshooting

| Problem | Lösung |
|---|---|
| App lädt nicht offline | Erstmal mit Internet laden, damit SW cacht |
| Installieren-Knopf fehlt | HTTPS prüfen, ggf. Reload. iOS: über Teilen-Menü |
| Mikrofon reagiert nicht | Browser-Berechtigung erteilen, iOS: nur Safari |
| Update-Banner kommt nicht | `VERSION` in `sw.js` hochgezählt? |
| Eigene Materialien weg | Browser-Speicher gelöscht. Aus Backup wiederherstellen. |
| Auf neuem Gerät leer | Backup vom alten Gerät importieren |
