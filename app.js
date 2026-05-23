// ════════════════════════════════════════════════════════════════════════════
// VERSION WATCHDOG — verhindert Mischversionen nach Cache-Update
// ════════════════════════════════════════════════════════════════════════════
// Wenn der Browser eine alte index.html mit einer neuen app.js kombiniert
// (oder umgekehrt), erkennen wir das hier und erzwingen einen Reload mit
// Cache-Umgehung. Verhindert "geht plötzlich nichts mehr"-Symptome.
const LACZY_JS_VERSION = "laczy-v4.7.0";
(function versionWatchdog(){
  try {
    // Notfall-Reset via URL-Parameter: ?reset=1 leert Cache und lädt neu
    if (location.search.indexOf("reset=1") !== -1){
      const doReset = () => {
        if ("caches" in window){
          caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
                       .finally(() => {
                         if ("serviceWorker" in navigator){
                           navigator.serviceWorker.getRegistrations().then(regs =>
                             Promise.all(regs.map(r => r.unregister()))
                           ).finally(() => {
                             location.replace(location.pathname);
                           });
                         } else {
                           location.replace(location.pathname);
                         }
                       });
        } else {
          location.replace(location.pathname);
        }
      };
      doReset();
      return;
    }

    const htmlVer = document.body && document.body.getAttribute("data-laczy-html-version");
    if (!htmlVer) {
      // Altes HTML ohne Versions-Marker — einmaliger Zwangs-Reload mit Cache-Leerung.
      if (!sessionStorage.getItem("laczy_force_reload_done")) {
        sessionStorage.setItem("laczy_force_reload_done", "1");
        if ("caches" in window) {
          caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
                       .finally(() => window.location.reload());
          return;
        }
        window.location.reload();
        return;
      }
    } else if (htmlVer !== LACZY_JS_VERSION) {
      // Mismatch: HTML und JS aus verschiedenen Versionen.
      if (!sessionStorage.getItem("laczy_force_reload_done")) {
        sessionStorage.setItem("laczy_force_reload_done", "1");
        if ("caches" in window) {
          caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
                       .finally(() => window.location.reload());
          return;
        }
        window.location.reload();
        return;
      }
    } else {
      sessionStorage.removeItem("laczy_force_reload_done");
    }
  } catch (e) {
    // Watchdog-Fehler darf App nicht stoppen
  }
})();

// ════════════════════════════════════════════════════════════════════════════
// FIRST ORDER — QNG-Rechenwerte 2023 v1.3 (388 entries, 10 categories)
// SECOND ORDER — Hersteller-Standardliste
// ════════════════════════════════════════════════════════════════════════════
const CATEGORIES = {
  "1":"Mineralische Materialien, Bauprodukte, Bauteile",
  "2":"Metalle",
  "3":"Holz und Holzwerkstoffe",
  "4":"Abdichtungen, Schutzschichten, Dachdeckungen",
  "5":"Dämmstoffe",
  "6":"Bodenbelag",
  "7":"Ausbau – Außen/Innen",
  "8":"Beschichtungen",
  "9":"Transluzente Bauteile, Fenster, Türen, Tore",
  "10":"Haustechnik Großkomponenten"
};
const CAT_SHORT = {"1":"Mineralisch","2":"Metalle","3":"Holz","4":"Abdichtung","5":"Dämmung","6":"Boden","7":"Ausbau","8":"Beschichtung","9":"Fenster/Türen","10":"Haustechnik"};

const FIRST_ORDER = [
  ["1.1","Kies 2/32"],
  ["1.2","Kies 2/32 getrocknet"],
  ["1.3","Sand 0/2"],
  ["1.4","Sand 0/2 getrocknet"],
  ["1.5","Brechsand 0/2"],
  ["1.6","Brechsand 0/2 (getrocknet)"],
  ["1.7","Schotter 16/32"],
  ["1.8","Schotter 16/32 (getrocknet)"],
  ["1.9","Splitt 2/15"],
  ["1.10","Splitt 2/15 (getrocknet)"],
  ["1.11","Lehmpulver"],
  ["1.12","Lehmstein"],
  ["1.13","Stampflehmwand"],
  ["1.14","Mauerziegel"],
  ["1.15","Mauerziegel (Dämmstoff gefüllt)"],
  ["1.16","Vormauerziegel"],
  ["1.17","Fassadenklinker"],
  ["1.18","Kalksandstein t"],
  ["1.19","Kalksandstein Mix m³"],
  ["1.20","Porenbeton 380 kg, unbewehrt"],
  ["1.21","Porenbeton 500 kg, bewehrt"],
  ["1.22","Porenbeton 472 kg,5 unbewehrt"],
  ["1.23","Blähton Hohlblockstein Trennwand"],
  ["1.24","Blähton Planstein Außenwand"],
  ["1.25","Blähton Planstein Innenwand"],
  ["1.26","Hüttensteine"],
  ["1.27","Beton-Mauersteine"],
  ["1.28","Leichtbetonstein 100 % Naturbims"],
  ["1.29","Transportbeton C20/25"],
  ["1.30","Transportbeton C30/37"],
  ["1.31","Betonfertigteil Decke 20cm"],
  ["1.32","Betonfertigteil Decke 40cm"],
  ["1.33","Betonfertigteil Treppe (1,1 m Breite, 9 Stufen a 16 cm)"],
  ["1.34","Betonfertigteil Wand 12cm"],
  ["1.35","Betonfertigteil Wand 40cm"],
  ["1.36","Spannbeton-Fertigteildecken"],
  ["1.37","Bewehrter Porenbeton - Decke"],
  ["2.1","Grauguss Bauteil"],
  ["2.2","Stahl Schmiedebauteil"],
  ["2.3","Rohe Baustähle: Offene Walzprofile und Grobbleche"],
  ["2.4","Feuerverzinkte Baustähle: Offene Walzprofile und Grobbleche"],
  ["2.5","Stahlprofil"],
  ["2.6","Bewehrungsstahl"],
  ["2.7","Feuerverzinktes Stahlblech"],
  ["2.8","Stahl Feinblech (0,3-3,0mm)"],
  ["2.9","Stahl Feinblech bandverzinkt (2,0 mm)"],
  ["2.10","Stahl warmgewalzte Bleche (2-20mm)"],
  ["2.11","Zinkblech"],
  ["2.12","Edelstahlblech"],
  ["2.13","Gussteile aus Aluminium"],
  ["2.14","Aluminiumblech"],
  ["2.15","Aluminium Profil"],
  ["2.16","Aluminiumfolie (d=0,1 mm)"],
  ["3.1","Hobelware (Durchschnitt DE)"],
  ["3.2","Laubschnittholz - getrocknet (Durchschnitt DE)"],
  ["3.3","Nadelschnittholz - frisch (Durchschnitt DE)"],
  ["3.4.","Nadelschnittholz - getrocknet (Durchschnitt DE)"],
  ["3.5","Konstruktionsvollholz (Durchschnitt DE)"],
  ["3.6","Balkenschichtholz (Durchschnitt DE)"],
  ["3.7","Brettschichtholz - Standardformen (Durchschnitt DE)"],
  ["3.8","Brettsperrholz (Durchschnitt DE)"],
  ["3.9","3- und 5-Schicht Massivholzplatte (Durchschnitt DE)"],
  ["3.10","Furniersperrholz (Durchschnitt DE)"],
  ["3.11","Furnierschichtholz"],
  ["3.12","Oriented Strand Board-OSB (Durchschnitt DE)"],
  ["3.13","Röhrenspanplatte (Durchschnitt DE)"],
  ["3.14","Spanplatte - melaminbeschichtet (Durchschnitt DE)"],
  ["3.15","Spanplatte, roh (Durchschnitt DE)"],
  ["3.16","Zementgebundene Spanplatte"],
  ["3.17","Hochdichte Faserplatte (Durchschnitt DE)"],
  ["3.18","Mitteldichte Faserplatte (Durchschnitt DE)"],
  ["4.1","Schiefer (Dicke 0,011 m)"],
  ["4.2","Dachziegel"],
  ["4.3","Dachsteine"],
  ["4.4","Bitumenbahnen G 200 S4 (Dicke 4 mm)"],
  ["4.5","Bitumenbahnen PYE PV 200 S5 (ungeschiefert) (Dicke 4 mm)"],
  ["4.6","Bitumenbahnen PYE-PV 200 S5 ns (geschiefert) (Dicke 4 mm)"],
  ["4.7","Bitumenbahnen V 60 (Dicke 5 mm)"],
  ["4.8","PVC-Dachbahnen (Dicke 1,2 mm)"],
  ["4.9","Dachbahnen EPDM (Dicke1,5 mm)"],
  ["4.10","TPO/FPO Dach-und Dichtungsbahn"],
  ["4.11","EVA-Dachbahnen"],
  ["4.12","ECB Kunststoff-Dachbahn (mit PES Vlies)"],
  ["4.13","Polyisobutylen-Dachbahn (Dicke 1,5 mm)"],
  ["4.14","Polyisobutylen-Dachbahn glasfaserverstärkt (Dicke 1,5 mm)"],
  ["4.15","Folie für Gründach (Dicke 1 mm)"],
  ["4.16","Unterspannbahn PE gewebeverstärkt (Dicke 0,15 mm)"],
  ["4.17","Unterspannbahn PP (Dicke 0,15 mm)"],
  ["4.18","Unterspannbahn PUR auf PET-Vlies (Dicke 0,5 mm)"],
  ["4.19","Dampfbremse PA"],
  ["4.20","Dampfbremse PE (Dicke 0,2 mm)"],
  ["4.21","Dampfbremse PET gitterverstärkt (Dicke 0,1 mm)"],
  ["4.22","Folie PE-HD mit PP-Vlies zur Abdichtung"],
  ["4.23","PE-Noppenfolie zur Abdichtung (Dicke 1,25 mm)"],
  ["4.24","PE/PP Vlies"],
  ["4.25","Bitumen Emulsion (40% Bitumen, 60% Wasser)"],
  ["4.26","Gussasphalt"],
  ["4.27","Baudichtstoffe auf Silikonbasis - Dichtstoffe für Verglasungen"],
  ["4.28","Baudichtstoffe auf Silikonbasis - Fassadendichtstoffe"],
  ["4.29","Baudichtstoffe auf Silikonbasis - Sanitärdichtstoffe"],
  ["4.30","Silikon-Dichtmasse"],
  ["4.31","Flüssigkunststoffe zur Bauwerksabdichtung auf Polyurethan- oder SMP"],
  ["4.32","PUR-Dichtmasse"],
  ["4.33","Kautschuk-Dichtmasse"],
  ["4.34","Kautschukabdichtung"],
  ["4.35","PVC Plastisol"],
  ["4.36","Acrylat Dichtmasse"],
  ["4.37","Baudichtstoffe auf Polysulfidbasis - Dichtstoffe für befahrene Flächen"],
  ["4.38","Baudichtstoffe auf Polysulfidbasis - Fugenabdichtungssysteme"],
  ["4.39","Kleb- und Dichtstoffe, Epoxidharz, gefüllt"],
  ["4.40","Kleb- und Dichtstoffe Polyurethan lösemittelfrei"],
  ["4.41","Glasvlies"],
  ["4.42","Vegetationssubtrat"],
  ["5.1.","Lava Körnung"],
  ["5.2","Naturbims Körnung"],
  ["5.3","Blähton Körnung"],
  ["5.4","Blähschiefer"],
  ["5.5","Blähglas Körnung"],
  ["5.6","Perlite 0-1"],
  ["5.7","Perlite 0-3"],
  ["5.8","Porenbeton Granulat"],
  ["5.9","Schaumglas 165 kg"],
  ["5.10","Schaumglas 130 kg"],
  ["5.11","Schaumglas 115 kg"],
  ["5.12","Schaumglas 100 kg"],
  ["5.13","Calziumsilikatplatte"],
  ["5.14","Mineraldämmplatte"],
  ["5.15","Perliteplatte innen"],
  ["5.16","Vakuumisolationspaneele"],
  ["5.17","Glasarmierungsgitter"],
  ["5.18","Einblasdämmung Mineralwolle"],
  ["5.19","Mineralwolle (Boden-Dämmung)"],
  ["5.20","Mineralwolle (Fassaden-Dämmung)"],
  ["5.21","Mineralwolle (Flachdach-Dämmung)"],
  ["5.22","Mineralwolle (Innenausbau-Dämmung)"],
  ["5.23","Mineralwolle (Schrägdach-Dämmung)"],
  ["5.24","Steinwolle-Dämmstoff im hohen Rohdichtebereich"],
  ["5.25","Steinwolle-Dämmstoff im mittleren Rohdichtebereich"],
  ["5.26","Steinwolle-Dämmstoff im niedrigen Rohdichtebereich"],
  ["5.27","Mineralfaser Deckenplatten (Dicke 1,5 cm)"],
  ["5.28","Holzwolle-Leichtbauplatte"],
  ["5.29","Expandierter Kork"],
  ["5.30","Baustroh"],
  ["5.31","Holzfaserdämmplatte (Nassverfahren)"],
  ["5.32","Holzfaserdämmplatten"],
  ["5.33","Holzfaserdämmstoff Trockenverfahren (Durchschnitt DE)"],
  ["5.34","Hobelspandämmung"],
  ["5.35","Zellulosefaser Einblas-Dämmstoff"],
  ["5.36","Zellulosefaserplatten"],
  ["5.37","Flachsvlies"],
  ["5.38","Hanfvlies"],
  ["5.39","Baumwolle konventionell"],
  ["5.40","Baumwolle ökologisch"],
  ["5.41","Harnstoff-Formaldehydharz Ortschaum"],
  ["5.42","Melaminharz-Schaum"],
  ["5.43","Polyethylen-Schaum"],
  ["5.44","EPS-Hartschaum für Decken/Böden und als Perimeterdämmung B/P WLG 035"],
  ["5.45","EPS-Hartschaum für Decken/Böden und als Perimeterdämmung B/PWLG 040"],
  ["5.46","EPS-Hartschaum für Wände und Dächer W/D WLG 035"],
  ["5.47","EPS-Hartschaum für Wände und Dächer W/D WLG 040"],
  ["5.48","Schüttung aus Polystyropartikel (ohne Bindemittel)"],
  ["5.49","Schüttung aus Polystyrolpartikeln (zementgebunden)"],
  ["5.50","EPS-Hartschaum (grau) mit Wärmestrahlungsabsorber"],
  ["5.51","XPS-Dämmstoff"],
  ["5.52","PU-Dämmplatten mit Aluminium-Deckschicht"],
  ["5.53","PU-Dämmplatten mit Mineralvlies-Deckschicht"],
  ["5.54","PU-Dämmplatten aus Blockschaumstoff"],
  ["5.55","PIR Hartschaum"],
  ["5.56","Isolierkorb für Wärmebrückentrennung"],
  ["6.1","Kraftpapier"],
  ["6.2","Calciumsulfatestrich"],
  ["6.3","Kunstharzestrich"],
  ["6.4","Zementestrich"],
  ["6.5","Calciumsulfat-Fließestrich, konventioneller Calciumsulfatestrich"],
  ["6.6","Gussasphaltestrich"],
  ["6.7","Epoxidharzmörtel"],
  ["6.8","Epoxidharzgrundierung"],
  ["6.9","Trockenschüttung Holzspäne"],
  ["6.10","Trockenestrich (Gipsfaserplatte) (Dicke 2,5 cm)"],
  ["6.11","Trockenestrich (Gipskartonplatte) (Dicke 2,5 cm)"],
  ["6.12","Betonpflaster- Standardstein grau mit Vorsatz"],
  ["6.13","Natursteinplatte, hart, Innenboden (Dicke 2,0 cm)"],
  ["6.14","Natursteinplatte, weich, Innenboden (Dicke 2,0 cm)"],
  ["6.15","Marmorplatte (Dicke 2,0 cm)"],
  ["6.16","Fliesenkleber"],
  ["6.17","Keramische Fliesen und Platten"],
  ["6.18","Steinzeugfliesen glasiert (Dicke 1,0 cm)"],
  ["6.19","Steinzeugfliesen unglasiert"],
  ["6.20","Dispersionsbasierte Klebstoffe (div. Bodenbeläge)"],
  ["6.21","Massivholzparkett (Durchschnitt DE)"],
  ["6.22","Mehrschichtparkett (Durchschnitt DE)"],
  ["6.23","Korkplatten 1m² (Dicke 4 mm)"],
  ["6.24","Korkplatten 1m² (Dicke 8 mm)"],
  ["6.25","Korkplatten 1m² (Dicke 6 mm)"],
  ["6.26","Holzboden-Spachtelmasse"],
  ["6.27","Korklinoleum Fußbodenbelag (Dicke 2,5 mm)"],
  ["6.28","Linoleum (Dicke 2,5mm)"],
  ["6.29","WPC (Wood Plastic Composite) Terrassendielen"],
  ["6.30","Laminat-Fußbodenbeläge"],
  ["6.31","Splittmastixasphalt SMA"],
  ["6.32","Asphaltbinder"],
  ["6.33","Asphalttragschicht"],
  ["6.34","Tragdeckschicht"],
  ["6.35","Kunststeinplatte (Epoxidharz gebunden)"],
  ["6.36","PVC Fußbodenbelag"],
  ["6.37.","Gummi-Bodenbelag mit Schaumstoffbeschichtung"],
  ["6.38","Gummi-Bodenbelag profiliert (Dicke3,5 mm)"],
  ["6.39","Fußbodenbelag mehrschichtiges Nadelvlies (Dicke 6,0 mm)"],
  ["6.42","Getuftete Teppichfliesen LC3, PA 6, Schwerbeschichtung auf Bitumenbasis"],
  ["6.45","Textiler Bodenbelag (GK 22+/23, LC1)"],
  ["7.1","Natursteinplatte, hart, Außenbereich (Dicke 8,0 cm)"],
  ["7.2","Natursteinplatte, hart, Fassade (Dicke 3,0 cm)"],
  ["7.3","Natursteinplatte, weich, Fassade"],
  ["7.4","Faserzementplatte"],
  ["7.5","Harz-Komposit-Fassaden-Platte"],
  ["7.6","Lehmputz"],
  ["7.7","Kalkzement Putzmörtel"],
  ["7.8","Kalkzementmörtel"],
  ["7.9","Zementmörtel"],
  ["7.10","Kalk-Gips-Innenputz"],
  ["7.11","Kalk-Innenputz"],
  ["7.12","Gipsputz"],
  ["7.13","Gipsputz (Gips-Kalk-Putz)"],
  ["7.14.","Kunstharzputz"],
  ["7.15","WDVS EPS 160 mm mit Schienenbefestigung"],
  ["7.16","WDVS Verklebung und Beschichtung Dekorputz mineralisch (ohne Dämmmaterial)"],
  ["7.17","WDVS Verklebung und Beschichtung Kratzputz mineralisch (ohne Dämmmaterial)"],
  ["7.18","WDVS Verklebung und Beschichtung Kunstharzputz (ohne Dämmmaterial)"],
  ["7.19","WDVS Verklebung und Beschichtung Leichtputz mineralisch (ohne Dämmmaterial)"],
  ["7.20","WDVS Verklebung und Beschichtung Silikat-Dispersionsputz (ohne Dämmmaterial)"],
  ["7.21","WDVS Verklebung und Beschichtung Silikonharzputz (ohne Dämmmaterial)"],
  ["7.22","Lehmbauplatte (Dicke 2,0 cm)"],
  ["7.23","Gipsfaserplatte (Dicke 1,0 cm)"],
  ["7.24","Gipskartonplatte (Feuerschutz)(Dicke 1,25 cm)"],
  ["7.25","Gipskartonplatte (imprägniert) (Dicke 1,25 cm)"],
  ["7.26","Gipskartonplatte (Lochplatte)"],
  ["7.27","Gipswandbauplatte (Dicke 10,0 cm)"],
  ["7.28","Kleber für Gipsplatten"],
  ["8.1","Kalkfarbe"],
  ["8.2","Fassadenfarbe Voranstrich Dispersion"],
  ["8.3","Fassadenfarbe Voranstrich Silikat-Dispersion"],
  ["8.4","Fassadenfarbe Dispersionsfarbe"],
  ["8.5","Fassadenfarbe Silikat-Dispersionsfarbe"],
  ["8.6","Fassadenfarbe Silikonharzfarbe"],
  ["8.7","Dispersionsputz"],
  ["8.8","Voranstrich, innen"],
  ["8.9","Voranstrich, innen (Kunstharz)"],
  ["8.10","Voranstrich, innen (Silikat-Dispersion)"],
  ["8.11","Armierung (Kunstharzspachtel)"],
  ["8.12","Latexfarbe"],
  ["8.13","Innenfarbe Dispersionsfarbe scheuerfest"],
  ["8.14","Lacksysteme Holzfenster Decklack weiß"],
  ["8.15","Lacksysteme Holzfenster Grundierung weiß"],
  ["8.16","Lacksysteme Holzfassade halb-pigmentiert (Lasursystem)"],
  ["8.17","Parkettlack (Grundierung Holz, wasserverdünnt)"],
  ["8.18","Parkettlack transparent"],
  ["8.19","Lösemittellack weiß"],
  ["8.20","Pulverlackierung (Industrie, Außenbereich, weiß)"],
  ["8.21","Wasserlack weiß"],
  ["8.22","Polyurethanversiegelung"],
  ["8.23","PU-Voranstrich"],
  ["8.24","Methacrylatharze"],
  ["8.25","Metallbeschichtung (wasserbasiert)"],
  ["8.26","Metalllack (lösemittelbasiert)"],
  ["8.27","Pulverbeschichten von Metallen"],
  ["9.1","Glasbausteine"],
  ["9.2","Fensterglas einfach"],
  ["9.3","Isolierglas 2-Scheiben"],
  ["9.4","Dreifachverglasung (Dicke: 3,6 cm)"],
  ["9.5","Abstandhalter Low Psi"],
  ["9.6","Glas - Brandschutzglas"],
  ["9.7","Bauprofil-Gussglas"],
  ["9.8","Polycarbonatplatte"],
  ["9.9","Transparente Platten PC"],
  ["9.10","Transparente Platten PMMA, extrudiert"],
  ["9.11","Transparente Platten PMMA, gegossen"],
  ["9.12","Transparente Platten PVC"],
  ["9.13","Aluminium-Flügelrahmenprofil, pulverbeschichtet"],
  ["9.14","Aluminium-Rahmenprofil, pulverbeschichtet"],
  ["9.15","Aluminium-Flügelrahmenprofil, thermisch getrennt, pulverbeschichtet"],
  ["9.16","Aluminium-Rahmenprofil, thermisch getrennt, pulverbeschichtet"],
  ["9.17","Pfosten/Riegelsystem aus Aluminium"],
  ["9.18","Pfosten/Riegelsystem aus Stahl"],
  ["9.19","Holz-Blendrahmen"],
  ["9.20","Holz-Flügelrahmen"],
  ["9.21","Blendrahmen PVC-U"],
  ["9.22","Flügelrahmen PVC-U"],
  ["9.23","CR Profil (Chloropren-Kautschuk)"],
  ["9.24","EPDM-Dichtungen Aluminiumprofil, thermisch getrennt"],
  ["9.25","Fugendichtungsbänder Butyl"],
  ["9.26","Fugendichtungsbänder Gewebebänder"],
  ["9.27","Fugendichtungsbänder PE/PP-Folie"],
  ["9.28","Fugendichtungsbänder Polyisobutylen"],
  ["9.29","Elastomer Fugenbänder, Polysulfid"],
  ["9.30","Elastomer Fugenbänder, Polyurethan"],
  ["9.31","Elastomer Fugenbänder, Silikonkautschuk"],
  ["9.32","Beschlagverbund Fenster Stahl"],
  ["9.33","Fenster-Beschlag für Doppelflügelfenster"],
  ["9.34","Fenster-Beschlag für Drehkippfenster (Aluminium)"],
  ["9.35","Fenster-Beschlag für horizontales Schiebefenster"],
  ["9.36","Fenster-Beschlag für vertikales Schiebefenster"],
  ["9.37","Befestigungsmittel/Schrauben Edelstahl"],
  ["9.38","Befestigungsmittel/Schrauben verzinkt"],
  ["9.39","Fenstergriff"],
  ["9.40","Kunststoffprofil CR (Chloropren-Kautschuk)"],
  ["9.41","Kunststoffprofil EPDM"],
  ["9.42","Kunststoffprofil SBR"],
  ["9.43","Kunststoffprofil Silikon"],
  ["9.44","Sonnenschutztuch"],
  ["9.45","Rollladen Kunststoff"],
  ["9.46","Sonnenschutzlamellen Metall"],
  ["9.47","Türplatte mit Kartonwabe beschichtet"],
  ["9.48","Garagensektionaltor"],
  ["9.49","Rolltor"],
  ["10.1","Gas-Brennwertgerät < 20 kW (Wandgerät)"],
  ["10.2","Gas-Brennwertgerät 120-400 kW (Standgerät)"],
  ["10.3","Gas-Brennwertgerät 20-120 kW (Standgerät)"],
  ["10.4","Gas-Niedertemperaturgerät 20-120 kW (Standgerät)"],
  ["10.5","Hackschnitzelkessel < 20 kW"],
  ["10.6","Hackschnitzelkessel 120 - 400 kW"],
  ["10.7","Hackschnitzelkessel 20 - 120 kW"],
  ["10.8","Öl-Brennwertgerät < 20 kW (Wandgerät)"],
  ["10.9","Öl-Brennwertgerät 120-400 kW (Standgerät)"],
  ["10.10","Öl-Brennwertgerät 20-120 kW (Standgerät)"],
  ["10.11","Öl-Niedertemperaturgerät 20-120 kW (Standgerät)"],
  ["10.12","Pelletkessel < 20 kW"],
  ["10.13","Pelletkessel 20-120 kW"],
  ["10.14","Rohre für Stromwärmepumpe (Sole-Wasser, Erdkollektor) 10 kW"],
  ["10.15","Rohre für Stromwärmepumpe (Sole-Wasser, Erdkollektor) 20 kW"],
  ["10.16","Rohre für Stromwärmepumpe (Sole-Wasser, Erdkollektor) 70 kW"],
  ["10.17","Rohre für Stromwärmepumpe (Sole-Wasser, Erdsonde) 10 kW"],
  ["10.18","Rohre für Stromwärmepumpe (Sole-Wasser, Erdsonde) 20 kW"],
  ["10.19","Rohre für Stromwärmepumpe (Sole-Wasser, Erdsonde) 70 kW"],
  ["10.20","Rohre für Stromwärmepumpe (Wasser-Wasser) 10 kW"],
  ["10.21","Rohre für Stromwärmepumpe (Wasser-Wasser) 20 kW"],
  ["10.22","Rohre für Stromwärmepumpe (Wasser-Wasser) 70 kW"],
  ["10.23","Solaranlage Flachkollektor"],
  ["10.24","Solaranlage Vakuumröhrenkollektor"],
  ["10.25","Stromwärmepumpe (Luft-Wasser) 10 kW"],
  ["10.26","Stromwärmepumpe (Luft-Wasser) 14kW"],
  ["10.27","Stromwärmepumpe (Luft-Wasser) 7kW"],
  ["10.28","Stromwärmepumpe (Sole-Wasser, Erdkollektor) 10 kW"],
  ["10.29","Stromwärmepumpe (Sole-Wasser, Erdkollektor) 20 kW"],
  ["10.30","Stromwärmepumpe (Sole-Wasser, Erdkollektor) 70 kW"],
  ["10.31","Stromwärmepumpe (Sole-Wasser, Erdsonde) 10 kW"],
  ["10.32","Stromwärmepumpe (Sole-Wasser, Erdsonde) 20 kW"],
  ["10.33","Stromwärmepumpe (Sole-Wasser, Erdsonde) 70 kW"],
  ["10.34","Stromwärmepumpe (Wasser-Wasser) 10 kW"],
  ["10.35","Stromwärmepumpe (Wasser-Wasser) 20 kW"],
  ["10.36","Stromwärmepumpe (Wasser-Wasser) 70 kW"],
  ["10.37","Gaswärmepumpe (Luft) 20-70 kW"],
  ["10.38","Übergabestation Fernwärme"],
  ["10.39","Lüfter dezentral (Wand & Decke) 60 m³/h"],
  ["10.40","Lüfter dezentral mit WRG (Wand & Decke) 60 m³/h"],
  ["10.41","Lüfter zentral 10000 m³/h"],
  ["10.42","Lüfter zentral 30000 m³/h"],
  ["10.43","Lüfter zentral 5000 m³/h"],
  ["10.44","Lüfter zentral mit WRG 1000 m³/h"],
  ["10.45","Lüfter zentral mit WRG 10000 m³/h"],
  ["10.46","Lüfter zentral mit WRG 5000 m³/h"],
  ["10.47","Klimagerät (Direktverdampfer) (pro 1 kW)"],
  ["10.48","Photovoltaiksystem 1000 kWh/m²*a (ohne Stromgutschrift)"],
  ["10.49","Photovoltaiksystem 1200 kWh/m²*a (ohne Stromgutschrift)"],
  ["10.50","Lithium Eisenphosphat (LFP) Batterie (pro 1kWh Speicherkapazität)"],
  ["10.51","Fahrstuhl - Grundkomponenten (stockwerkunabhängig)"],
  ["10.52","Fahrstuhl - Komponenten (stockwerkabhängig)"],
  ["10.53","Fahrtreppe - Grundkomponenten (unabhängig von der Förderhöhe)"],
  ["10.54","Fahrtreppe - Komponenten (förderhöhenabhängig)"],
  ["10.55","Flüssiggastank 2700 l/1,2 t (oberirdisch)"],
  ["10.56","Flüssiggastank 2700 l/1,2 t (unterirdisch)"],
  ["10.57","Flüssiggastank 4850 l/2,1 t (unterirdisch)"],
  ["10.58","Flüssiggastank 4850 l/2,1t (oberirdisch)"],
  ["10.59","Flüssiggastank 6400 l/2,9 t (oberirdisch)"],
  ["10.60","Flüssiggastank 6400 l/2,9 t (unterirdisch)"],
  ["10.61","Öltank PE-HD (1000l)"],
  ["10.62","Öltank PE-HD (1500)"],
  ["10.63","Öltank PE-HD (750l)"],
  ["10.64","Öltank Polyamid (1000l)"],
  ["10.65","Öltank Polyamid (1500l)"],
  ["10.66","Öltank Polyamid (750l)"],
  ["10.67","Öltank Stahl/PE-HD (Doppelwandtank, 1000l)"],
  ["10.68","Öltank Stahl/PE-HD (Doppelwandtank, 750l)"],
  ["10.69","Pufferspeicher (Edelstahl)"],
  ["10.70","Pufferspeicher (Stahl)"],
  ["10.71","Schornstein Edelstahl (Einwandig)"],
  ["10.72","Schornstein gemauert (Einzügig)"],
  ["10.73","Schornstein gemauert (Zweizügig)"],
  ["10.74","Schornstein Polypropylen (PP)"]
];

const SECOND_ORDER = [
  ["Botament RD Flow","4.31",""],
  ["Knauf Katja Sprint / Unterdeckbahn","4.22",""],
  ["Abdichtungsbahn Sopro AEB 640 (Folie PE-HD mit PP-Vlies)","4.22",""],
  ["SIGA-Majcoat 250 Unterspannbahn","4.18",""],
  ["SIGA Majvest 700 SOB Unterspannbahn","4.17",""],
  ["Klebeband Siga Sicrall (OSB-Stöße)","4.40",""],
  ["Fixier- und Dichtkleber Sopro FDK 415","4.39",""],
  ["Giessener Tackerplatte EPS-040-DES sg","5.45",""],
  ["GUTEX Thermowall (WDVS Holzfaserdämmplatte)","5.32",""],
  ["GUTEX Thermoflex Holzfaserdämmplatte","5.32",""],
  ["Gutex Thermofibre Holzfaserdämmung Einblas","5.35",""],
  ["Isocell Zellulosedämmung","5.35",""],
  ["Isover Akustic EP 1 (FBH MFH)","5.14",""],
  ["Misapor Schaumglasschotter 10/75","5.5",""],
  ["Stahltrapezblechprofile (Dach)","2.7","Annahme: Feuerverzinktes Stahlblech"],
  ["Aluminiumblech (z.B. Topero Mega Paneel 350)","2.14",""],
  ["Außentreppe Stahl feuerverzinkt","2.4",""],
  ["Balkonkonstruktion Stahl feuerverzinkt","2.4",""],
  ["Bewehrungsstahl","2.6",""],
  ["Metall Ständer-Profil","2.5",""],
  ["Konstruktionsholz BSH GL24h/c","3.7",""],
  ["KVH Konstruktionsvollholz","3.5",""],
  ["Quattro Balken C24","3.5",""],
  ["Holzständer / Schwelle","3.5",""],
  ["CLT-Decke Brettsperrholz","3.8",""],
  ["3-S-Platte Massivholzplatte","3.9",""],
  ["OSB-Platten","3.12",""],
  ["Holzfaserplatten / MDF / Innentür Röhrenspan","3.13",""],
  ["Fassadenschalung Fichte","3.4",""],
  ["Holztreppe Laubschnittholz","3.2",""],
  ["Anhydrit-Estrich Calciumsulfatestrich","6.2",""],
  ["Zement-Estrich","6.4",""],
  ["Schnellestrichmörtel Sopro Rapidur M5","7.9",""],
  ["Fliesen keramisch","6.17",""],
  ["Fliesenkleber Ardex X 78","6.16",""],
  ["Linoleum DIN 12524","6.28",""],
  ["Linoleum-Klebstoff weber.floor 4820","6.20",""],
  ["Betonplatten Betonwerkstein","6.12",""],
  ["Gummigranulat Bautenschutzmatte","6.38",""],
  ["StoPutzgrund Epoxidharzgrundierung","6.8",""],
  ["Fermacell Gipsfaserplatte / Vapor","7.23",""],
  ["Oberputz StoDecosit Kunstharzputz","7.14",""],
  ["Putzmörtel Gipsputz Kalkgips","7.13",""],
  ["StoSilco K WDVS Kratzputz mineralisch außen","7.17",""],
  ["Spachtel StoLevell In Fill / Zahnspachtelung","8.11",""],
  ["Grundierung Sopro GD 749 / StoPrep Isol Q","8.9",""],
  ["StoPrim Sil Color Voranstrich Silikat","8.10",""],
  ["StoColor Opticryl Matt Innenfarbe","8.13",""],
  ["HD-AQUA PUR Parkettsiegel Parkettlack","8.17",""],
  ["Kunststofffenster Rahmen PVC-U (alle Größen)","9.22",""],
  ["Holzfenster Rahmen (alle Größen)","9.20",""],
  ["Fenster Verglasung Dreifachverglasung 3,6 cm","9.4",""],
  ["Fenstergriffe","9.39",""],
  ["Rollladen Kunststoff","9.45",""],
  ["Beton armiert mit 1% Stahl (DIN 12524)","1.29",""],
  ["Beton C30/37","1.30",""],
  ["Beton Fertigteiltreppe","1.33",""],
  ["Bitumendachbahn G 200 S4","4.4",""],
  ["Dampfbremse Polyethylen (PE)","4.20",""],
  ["Dachziegelsteine aus Beton","4.2",""],
  ["Polystyrol PS-Partikelschaum EPS WLG 040","5.45",""],
  ["Polystyrol PS-Extruderschaum WLG 035 (EPS Gefälledämmung)","5.46",""],
  ["Mineralwolle WLG 040","5.22",""],
  ["Steinwolle WLG 035","5.26",""],
  ["PUR/PIR-Hartschaum WLG 025","5.55",""],
  ["Splittschüttung zementgebunden","5.49",""]
];


// ════════════════════════════════════════════════════════════════════════════
// APP LOGIC
// ════════════════════════════════════════════════════════════════════════════

// Build a fast lookup: code → first-order name
const FO_MAP = {};
FIRST_ORDER.forEach(([code, name]) => { FO_MAP[code] = name; });

// State
let currentOrder = "1";  // "1" = Standard, "2" = Eigene+Hersteller, "all" = beides
let query = "";
let activeFilter = "";
let listening = false;
let userStopped = false;
let recognition = null;
let restartTimer = null;

// Editing state for material modal
let editingMaterialId = null; // null = new, otherwise = id of user material being edited

// User-added materials, persisted in localStorage
let userMaterials = [];
const STORAGE_KEY = 'laczy_user_materials_v1';

// Storage hardening: hard limits and validation
const MAX_USER_MATERIALS = 5000;     // safety cap — well above any realistic use
const MAX_NAME_LEN = 200;
const MAX_CODE_LEN = 30;
const MAX_NOTE_LEN = 300;

// Sanitize one user material entry; returns valid object or null
function sanitizeMaterial(m){
  if (!m || typeof m !== "object") return null;
  const name = typeof m.name === "string" ? m.name.trim().slice(0, MAX_NAME_LEN) : "";
  const code = typeof m.code === "string" ? m.code.trim().slice(0, MAX_CODE_LEN) : "";
  if (!name || !code) return null;
  // Code must contain only the safe character set used by QNG codes
  if (!/^[0-9A-Za-z.\-_]+$/.test(code)) return null;
  const note = typeof m.note === "string" ? m.note.trim().slice(0, MAX_NOTE_LEN) : "";
  const id = (typeof m.id === "string" && /^[A-Za-z0-9_\-]{1,40}$/.test(m.id)) ? m.id : genId();
  const createdAt = typeof m.createdAt === "number" && m.createdAt > 0 ? m.createdAt : Date.now();
  const out = { id, name, code, note, createdAt };
  if (typeof m.updatedAt === "number" && m.updatedAt > 0) out.updatedAt = m.updatedAt;
  return out;
}

function loadUserMaterials(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw){ userMaterials = []; return; }
    if (raw.length > 2_000_000){ // 2 MB hard cap on stored blob
      console.warn("Stored material blob exceeds safety limit — ignoring");
      userMaterials = []; return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)){ userMaterials = []; return; }
    userMaterials = parsed
      .slice(0, MAX_USER_MATERIALS)
      .map(sanitizeMaterial)
      .filter(Boolean);
  } catch(e){
    console.warn("loadUserMaterials failed:", e);
    userMaterials = [];
  }
}

function saveUserMaterials(){
  try{
    if (userMaterials.length > MAX_USER_MATERIALS){
      userMaterials = userMaterials.slice(0, MAX_USER_MATERIALS);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userMaterials));
    return true;
  } catch(e){
    console.warn("saveUserMaterials failed:", e);
    showToast("Speichern fehlgeschlagen — Speicher voll?", "terra");
    return false;
  }
}
function genId(){
  return 'um_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

loadUserMaterials();

// DOM helpers
const $ = id => document.getElementById(id);
const micBtn = $("micBtn"), micRing = $("micRing"), liveBar = $("liveBar"), liveText = $("liveText");
const statusText = $("statusText"), searchInput = $("searchInput"), clearBtn = $("clearBtn");
const resultsEl = $("results"), statsCount = $("statsCount"), filterPills = $("filterPills"), noSupport = $("noSupport");
const customCount = $("customCount");
const toast = $("toast");

// ════════════════════════════════════════════════════════════════════════════
// NAVIGATION — multi-screen shell (home + tool screens)
// ════════════════════════════════════════════════════════════════════════════
// Allowed screen names — keep tight; never derive from user input
const VALID_SCREENS = new Set(["home", "search", "gutter", "sill", "statics", "projekt"]);
let currentScreen = "home";

const backBtn = $("backBtn");
const appbarBrand = $("appbarBrand");

function navigateTo(name){
  // Reject anything that isn't on the whitelist — defensive against
  // malformed dataset attributes or any external manipulation
  if (!VALID_SCREENS.has(name)) name = "home";

  // Close any open modals to avoid stale state
  document.querySelectorAll('.modal.open').forEach(m => {
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
  });

  document.querySelectorAll(".screen").forEach(s => {
    s.classList.toggle("active", s.dataset.screen === name);
  });
  currentScreen = name;

  // App-bar adjustments: back button visible on tool screens, brand on tool screens
  if (name === "home"){
    backBtn.classList.remove("show");
    appbarBrand.classList.remove("show");
  } else {
    backBtn.classList.add("show");
    appbarBrand.classList.add("show");
  }

  // Scroll to top whenever a screen opens
  window.scrollTo({top: 0, behavior: "instant" in window ? "instant" : "auto"});
}

// Wire home tool-cards (event delegation, CSP-safe)
document.querySelectorAll(".tool-card").forEach(card => {
  card.addEventListener("click", () => {
    if (card.disabled) return;
    const tool = card.dataset.tool;
    navigateTo(tool);
  });
});

// Back button → home
backBtn.addEventListener("click", () => navigateTo("home"));

// Order tabs
document.querySelectorAll(".order-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".order-tab").forEach(t => t.classList.remove("active", "terra"));
    tab.classList.add("active");
    currentOrder = tab.dataset.order;
    if (currentOrder === "2") tab.classList.add("terra");
    activeFilter = "";
    search();
  });
});

// Helpers
function normalize(s){
  return String(s).toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
}
function escHtml(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// Eco palette category colors
const CAT_COLORS = {
  "1": ["#6e6457", "rgba(110, 100, 87, 0.10)"],     // Mineralisch — warm slate
  "2": ["#a0623a", "rgba(160, 98, 58, 0.10)"],      // Metalle — copper
  "3": ["#7d5a32", "rgba(125, 90, 50, 0.10)"],      // Holz — oak brown
  "4": ["#4f6471", "rgba(79, 100, 113, 0.10)"],     // Abdichtung — slate blue
  "5": ["#7a9168", "rgba(122, 145, 104, 0.12)"],    // Dämmung — sage
  "6": ["#a87a3c", "rgba(168, 122, 60, 0.10)"],     // Boden — ochre
  "7": ["#a06a4f", "rgba(160, 106, 79, 0.10)"],     // Ausbau — terra
  "8": ["#956b78", "rgba(149, 107, 120, 0.10)"],    // Beschichtung — mauve
  "9": ["#6c8a9c", "rgba(108, 138, 156, 0.10)"],    // Fenster/Türen — sky
  "10":["#7a7c8c", "rgba(122, 124, 140, 0.10)"]     // Haustechnik — lavender grey
};

// Filter pills
function buildPills(){
  filterPills.innerHTML = "";
  let cats;
  if (currentOrder === "1"){
    cats = Object.keys(CAT_SHORT);
  } else if (currentOrder === "2"){
    const used = new Set();
    SECOND_ORDER.forEach(([,c]) => used.add(c.split(".")[0]));
    userMaterials.forEach(m => used.add(m.code.split(".")[0]));
    cats = [...used].sort((a,b) => +a - +b);
  } else {
    cats = Object.keys(CAT_SHORT);
  }
  cats.forEach(id => {
    const btn = document.createElement("button");
    btn.className = "pill" + (activeFilter === id ? " active" : "");
    btn.textContent = CAT_SHORT[id] || id;
    btn.dataset.cat = id;
    btn.addEventListener("click", () => {
      activeFilter = activeFilter === id ? "" : id;
      buildPills();
      search();
    });
    filterPills.appendChild(btn);
  });
}

// SEARCH
function search(){
  buildPills();
  const q = query.trim();
  clearBtn.classList.toggle("show", q.length > 0);
  const words = q ? normalize(q).split(/\s+/).filter(w => w.length > 0) : [];

  // Build the unified item list
  let items = [];
  if (currentOrder === "1" || currentOrder === "all"){
    FIRST_ORDER.forEach(([code, name]) => {
      items.push({order: 1, code, name, linked: null, note: "", catId: code.split(".")[0], isCustom: false});
    });
  }
  if (currentOrder === "2" || currentOrder === "all"){
    // Built-in second order (manufacturer entries)
    SECOND_ORDER.forEach(([name, code, note]) => {
      items.push({order: 2, code, name, linked: FO_MAP[code] || "", note, catId: code.split(".")[0], isCustom: false});
    });
    // User-added materials
    userMaterials.forEach(m => {
      items.push({
        order: 2, code: m.code, name: m.name,
        linked: FO_MAP[m.code] || "", note: m.note || "",
        catId: (m.code || "").split(".")[0],
        isCustom: true, userId: m.id
      });
    });
  }

  // Filter
  let hits = items.filter(it => {
    if (activeFilter && it.catId !== activeFilter) return false;
    if (!words.length) return true;
    const hay = normalize(
      it.name + " " + it.code + " " + (it.linked || "") + " " + it.note + " " + (CATEGORIES[it.catId] || "")
    );
    return words.every(w => hay.includes(w));
  });

  // Sort: when searching by code prefix, exact matches first
  if (q){
    hits.sort((a, b) => {
      const ac = a.code === q ? 0 : (a.code.startsWith(q) ? 1 : 2);
      const bc = b.code === q ? 0 : (b.code.startsWith(q) ? 1 : 2);
      if (ac !== bc) return ac - bc;
      // user-custom before built-in within same rank
      if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
      return 0;
    });
  } else {
    // No query: user customs come first in "Eigene" tab
    if (currentOrder === "2"){
      hits.sort((a, b) => {
        if (a.isCustom !== b.isCustom) return a.isCustom ? -1 : 1;
        return 0;
      });
    }
  }

  // Stats + custom count badge
  customCount.textContent = SECOND_ORDER.length + userMaterials.length;
  const totalForOrder = currentOrder === "1" ? FIRST_ORDER.length :
                        currentOrder === "2" ? (SECOND_ORDER.length + userMaterials.length) :
                        FIRST_ORDER.length + SECOND_ORDER.length + userMaterials.length;
  while (statsCount.firstChild) statsCount.removeChild(statsCount.firstChild);
  if (q || activeFilter){
    const strong = document.createElement("strong");
    strong.textContent = hits.length;
    statsCount.appendChild(strong);
    statsCount.appendChild(document.createTextNode(" von " + totalForOrder + " Materialien"));
  } else {
    const strong = document.createElement("strong");
    strong.textContent = totalForOrder;
    statsCount.appendChild(strong);
    statsCount.appendChild(document.createTextNode(" Materialien"));
    if (userMaterials.length > 0 && (currentOrder === "2" || currentOrder === "all")){
      statsCount.appendChild(document.createTextNode(" · "));
      const s2 = document.createElement("strong");
      s2.textContent = userMaterials.length;
      statsCount.appendChild(s2);
      statsCount.appendChild(document.createTextNode(" eigene"));
    }
  }

  // Clear existing contents safely
  while (resultsEl.firstChild) resultsEl.removeChild(resultsEl.firstChild);

  // Empty state
  if (!hits.length){
    const empty = document.createElement("div");
    empty.className = "empty";
    if (currentOrder === "2" && userMaterials.length === 0 && !q && !activeFilter){
      const msg = document.createElement("div");
      msg.textContent = "Noch keine eigenen Materialien angelegt.";
      empty.appendChild(msg);
      const cta = document.createElement("button");
      cta.className = "empty-cta";
      cta.type = "button";
      cta.textContent = "+ Erstes Material anlegen";
      cta.dataset.action = "open-add";
      empty.appendChild(cta);
    } else {
      empty.textContent = "Kein Treffer für „" + q + "\"";
    }
    resultsEl.appendChild(empty);
    return;
  }

  // Render (cap at 200 for DOM perf)
  const cap = 200;
  const shown = hits.slice(0, cap);
  const frag = document.createDocumentFragment();

  shown.forEach((it, i) => {
    const [col, bg] = CAT_COLORS[it.catId] || ["#888", "rgba(136,136,136,0.1)"];
    const card = document.createElement("div");
    card.className = "result-card" + (it.order === 2 ? " second-order" : "") + (it.isCustom ? " user-custom" : "");
    card.style.animationDelay = (Math.min(i, 12) * 18) + "ms";

    // LCA number badge
    const lcaNum = document.createElement("div");
    lcaNum.className = "lca-num";
    lcaNum.style.color = col;
    lcaNum.style.background = bg;
    lcaNum.style.borderColor = col + "33";
    lcaNum.textContent = it.code;
    card.appendChild(lcaNum);

    // Middle column
    const middle = document.createElement("div");
    const nameDiv = document.createElement("div");
    nameDiv.className = "result-name";
    if (words.length){
      // highlight() now returns DocumentFragment — see below
      nameDiv.appendChild(highlight(it.name, words));
    } else {
      nameDiv.textContent = it.name;
    }
    middle.appendChild(nameDiv);

    const meta = document.createElement("div");
    meta.className = "result-meta";
    if (it.isCustom){
      const tag = document.createElement("span");
      tag.className = "custom-tag";
      tag.textContent = "Eigenes";
      meta.appendChild(tag);
    } else {
      const tag = document.createElement("span");
      tag.style.color = it.order === 2 ? "var(--terra)" : "var(--text-3)";
      if (it.order === 2) tag.style.fontWeight = "600";
      tag.textContent = it.order === 2 ? "2°" : "1°";
      meta.appendChild(tag);
    }
    meta.appendChild(document.createTextNode(" " + (CAT_SHORT[it.catId] || it.catId)));
    if (it.note){
      meta.appendChild(document.createTextNode(" · "));
      const note = document.createElement("span");
      note.className = "note-tag";
      note.textContent = it.note;
      meta.appendChild(note);
    }
    middle.appendChild(meta);

    if (it.order === 2 && it.linked){
      const linkedDiv = document.createElement("div");
      linkedDiv.className = "linked-name";
      linkedDiv.textContent = it.linked;
      middle.appendChild(linkedDiv);
    }
    card.appendChild(middle);

    // Actions column
    const actions = document.createElement("div");
    actions.className = "result-actions";

    if (it.isCustom){
      const editBtn = document.createElement("button");
      editBtn.className = "row-edit-btn";
      editBtn.type = "button";
      editBtn.title = "Bearbeiten";
      editBtn.setAttribute("aria-label", "Bearbeiten");
      editBtn.dataset.action = "edit";
      editBtn.dataset.userId = it.userId;
      editBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
      actions.appendChild(editBtn);
    }

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.type = "button";
    copyBtn.textContent = it.code;
    copyBtn.dataset.action = "copy";
    copyBtn.dataset.code = it.code;
    actions.appendChild(copyBtn);
    card.appendChild(actions);

    frag.appendChild(card);
  });

  resultsEl.appendChild(frag);

  if (hits.length > cap){
    const more = document.createElement("div");
    more.className = "empty";
    more.style.padding = "1rem";
    const p = document.createElement("p");
    p.textContent = "+ " + (hits.length - cap) + " weitere Treffer — Suche verfeinern";
    more.appendChild(p);
    resultsEl.appendChild(more);
  }
}

// Event delegation for action buttons (CSP-safe: no inline handlers)
resultsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  if (action === "copy"){
    copyNum(btn.dataset.code, btn);
  } else if (action === "edit"){
    openEditModal(btn.dataset.userId);
  } else if (action === "open-add"){
    openAddModal();
  }
});

function highlight(text, words){
  // Returns a DocumentFragment with <mark> elements around matches.
  // Safe by construction — no innerHTML usage.
  const frag = document.createDocumentFragment();
  // Build a single combined regex for performance & correctness
  const validWords = words.filter(w => w.length >= 2);
  if (!validWords.length){
    frag.appendChild(document.createTextNode(text));
    return frag;
  }
  const pattern = validWords
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const re = new RegExp("(" + pattern + ")", "gi");
  let lastIdx = 0;
  let m;
  while ((m = re.exec(text)) !== null){
    if (m.index > lastIdx){
      frag.appendChild(document.createTextNode(text.slice(lastIdx, m.index)));
    }
    const mark = document.createElement("mark");
    mark.textContent = m[0];
    frag.appendChild(mark);
    lastIdx = m.index + m[0].length;
    // Prevent infinite loop on zero-width matches
    if (m[0].length === 0) re.lastIndex++;
  }
  if (lastIdx < text.length){
    frag.appendChild(document.createTextNode(text.slice(lastIdx)));
  }
  return frag;
}

function copyNum(num, btn){
  if (!navigator.clipboard){
    showToast(num + ' (Kopieren nicht unterstützt)', 'terra');
    return;
  }
  navigator.clipboard.writeText(num).then(() => {
    const orig = btn.textContent;
    btn.textContent = "✓ kopiert";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 1500);
  });
}

// Toast
let toastTimer = null;
function showToast(msg, variant = ""){
  toast.className = "toast" + (variant ? " " + variant : "");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Input handlers
searchInput.addEventListener("input", () => { query = searchInput.value; search(); });
clearBtn.addEventListener("click", () => { query = ""; searchInput.value = ""; search(); searchInput.focus(); });

// ════════════════════════════════════════════════════════════════════════════
// ADD / EDIT MATERIAL MODAL
// ════════════════════════════════════════════════════════════════════════════

const matModal = $("matModal");
const matModalTitle = $("matModalTitle");
const newName = $("newName"), newCode = $("newCode"), newNote = $("newNote");
const newCodeHint = $("newCodeHint");
const codeList = $("codeList");
const saveBtn = $("saveBtn"), deleteBtn = $("deleteBtn");

// Populate datalist with all valid first-order codes
function populateCodeList(){
  codeList.innerHTML = "";
  FIRST_ORDER.forEach(([code, name]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.label = name;
    codeList.appendChild(opt);
  });
}
populateCodeList();

function openAddModal(){
  editingMaterialId = null;
  matModalTitle.textContent = "Neues Material";
  newName.value = "";
  newCode.value = "";
  newNote.value = "";
  deleteBtn.style.display = "none";
  saveBtn.textContent = "Speichern";
  validateCodeInput();
  matModal.classList.add("open");
  matModal.setAttribute("aria-hidden", "false");
  setTimeout(() => newName.focus(), 100);
}

function openEditModal(id){
  const m = userMaterials.find(x => x.id === id);
  if (!m) return;
  editingMaterialId = id;
  matModalTitle.textContent = "Material bearbeiten";
  newName.value = m.name;
  newCode.value = m.code;
  newNote.value = m.note || "";
  deleteBtn.style.display = "inline-flex";
  saveBtn.textContent = "Aktualisieren";
  validateCodeInput();
  matModal.classList.add("open");
  matModal.setAttribute("aria-hidden", "false");
  setTimeout(() => newName.focus(), 100);
}

function closeModal(modal){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Close handlers — overlay click, X button, Cancel button
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) closeModal(modal);
  });
});
// Esc key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m));
  }
});

// Live code validation
function validateCodeInput(){
  const v = newCode.value.trim();
  if (!v){
    newCodeHint.textContent = "Tippe Nummer oder Name. Auto-Vervollständigung.";
    newCodeHint.className = "field-hint";
    newCode.classList.remove("invalid");
    return;
  }
  if (FO_MAP[v]){
    newCodeHint.textContent = "✓ " + FO_MAP[v];
    newCodeHint.className = "field-hint match";
    newCode.classList.remove("invalid");
  } else {
    newCodeHint.textContent = "Code nicht in QNG-Standardliste — bitte aus Vorschlägen wählen";
    newCodeHint.className = "field-hint error";
    newCode.classList.add("invalid");
  }
}
newCode.addEventListener("input", validateCodeInput);

// Save
saveBtn.addEventListener("click", () => {
  const name = newName.value.trim();
  const code = newCode.value.trim();
  const note = newNote.value.trim();

  let valid = true;
  if (!name){ newName.classList.add("invalid"); valid = false; } else { newName.classList.remove("invalid"); }
  if (!code || !FO_MAP[code]){ newCode.classList.add("invalid"); valid = false; }
  if (!valid){
    showToast("Bitte Bezeichnung und gültigen QNG-Code eingeben", "terra");
    return;
  }

  if (editingMaterialId){
    const m = userMaterials.find(x => x.id === editingMaterialId);
    if (m){
      m.name = name; m.code = code; m.note = note;
      m.updatedAt = Date.now();
      saveUserMaterials();
      showToast("Aktualisiert", "sage");
    }
  } else {
    userMaterials.push({
      id: genId(),
      name, code, note,
      createdAt: Date.now()
    });
    saveUserMaterials();
    showToast("Material gespeichert", "sage");
  }
  closeModal(matModal);
  search();
});

// Delete (from edit mode)
deleteBtn.addEventListener("click", () => {
  if (!editingMaterialId) return;
  if (!confirm("Dieses Material wirklich löschen?")) return;
  userMaterials = userMaterials.filter(m => m.id !== editingMaterialId);
  saveUserMaterials();
  closeModal(matModal);
  showToast("Gelöscht", "terra");
  search();
});

// Add button on stats bar
$("addMatBtn").addEventListener("click", () => {
  // Switch to "Eigene" tab so user sees their new material immediately
  if (currentOrder === "1"){
    document.querySelectorAll(".order-tab").forEach(t => t.classList.remove("active", "terra"));
    const t = document.querySelector('.order-tab[data-order="2"]');
    t.classList.add("active", "terra");
    currentOrder = "2";
  }
  openAddModal();
});

// ════════════════════════════════════════════════════════════════════════════
// BACKUP MODAL — Export / Import / Wipe
// ════════════════════════════════════════════════════════════════════════════

const backupModal = $("backupModal");
const backupCount = $("backupCount");

$("backupBtn").addEventListener("click", () => {
  backupCount.textContent = userMaterials.length;
  backupModal.classList.add("open");
  backupModal.setAttribute("aria-hidden", "false");
});

$("exportBtn").addEventListener("click", () => {
  const payload = {
    app: "LACZY",
    version: 1,
    exportedAt: new Date().toISOString(),
    materials: userMaterials
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `laczy-materialien-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Backup heruntergeladen", "sage");
});

$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  // Hard size limit on import file (5 MB — well above any realistic backup)
  if (file.size > 5 * 1024 * 1024){
    showToast("Datei zu groß (max. 5 MB)", "terra");
    e.target.value = "";
    return;
  }
  // Loose MIME / extension sanity check
  const okType = !file.type || file.type === "application/json" || file.type === "text/plain" || file.type === "text/json";
  const okExt = /\.json$/i.test(file.name);
  if (!okType && !okExt){
    showToast("Bitte eine .json-Datei wählen", "terra");
    e.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => {
    showToast("Datei konnte nicht gelesen werden", "terra");
    e.target.value = "";
  };
  reader.onload = () => {
    try{
      const text = String(reader.result || "");
      if (text.length > 5_000_000) throw new Error("Inhalt zu groß");
      const data = JSON.parse(text);
      let imported;
      if (Array.isArray(data)) imported = data;
      else if (data && Array.isArray(data.materials)) imported = data.materials;
      else throw new Error("Unbekanntes Format");
      // Validate with central sanitizer; ensure unique IDs
      const seen = new Set();
      const cleaned = imported
        .slice(0, MAX_USER_MATERIALS)
        .map(sanitizeMaterial)
        .filter(m => {
          if (!m) return false;
          if (seen.has(m.id)){ m.id = genId(); }
          seen.add(m.id);
          // Optionally enforce code is in standard list — but allow unknown codes
          // so legacy/special codes don't get silently dropped on import.
          return true;
        });
      if (!cleaned.length){
        showToast("Keine gültigen Materialien in der Datei", "terra");
        return;
      }
      if (!confirm(`${cleaned.length} Materialien importieren? Deine aktuelle Liste (${userMaterials.length}) wird ersetzt.`)){
        return;
      }
      userMaterials = cleaned;
      saveUserMaterials();
      closeModal(backupModal);
      showToast(`${cleaned.length} Materialien importiert`, "sage");
      search();
    } catch(err){
      showToast("Datei konnte nicht gelesen werden: " + err.message, "terra");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

$("wipeBtn").addEventListener("click", () => {
  if (userMaterials.length === 0){
    showToast("Keine eigenen Materialien vorhanden", "terra");
    return;
  }
  if (!confirm(`Wirklich alle ${userMaterials.length} eigenen Materialien löschen? Tipp: Vorher Backup exportieren.`)) return;
  userMaterials = [];
  saveUserMaterials();
  closeModal(backupModal);
  showToast("Alle eigenen Materialien gelöscht", "terra");
  search();
});

// ════════════════════════════════════════════════════════════════════════════
// VOICE — Continuous mode
// ════════════════════════════════════════════════════════════════════════════
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function buildRecognition(){
  const r = new SR();
  r.lang = "de-DE";
  r.interimResults = true;
  r.continuous = true;
  r.maxAlternatives = 1;

  r.onstart = () => {
    listening = true;
    userStopped = false;
    micBtn.classList.add("listening");
    micRing.classList.add("listening");
    liveBar.classList.add("active");
    liveText.textContent = "Hört zu …";
    statusText.textContent = "Dauerhören aktiv — sprich beliebig viele Begriffe";
    statusText.classList.add("active");
  };

  r.onresult = e => {
    let interim = "", newFinal = "";
    for (let i = e.resultIndex; i < e.results.length; i++){
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) newFinal += t;
      else interim += t;
    }
    if (newFinal){
      const t = newFinal.trim();
      query = t;
      searchInput.value = t;
      search();
      liveText.textContent = `„${t}"`;
    } else if (interim){
      const t = interim.trim();
      query = t;
      searchInput.value = t;
      search();
      liveText.textContent = t;
    }
  };

  r.onerror = e => {
    if (e.error === "not-allowed" || e.error === "service-not-allowed"){
      statusText.textContent = "Mikrofonzugriff verweigert";
      statusText.classList.remove("active");
      userStopped = true;
      hardStop();
    }
  };

  r.onend = () => {
    if (!userStopped){
      clearTimeout(restartTimer);
      restartTimer = setTimeout(() => {
        try{
          recognition.start();
        } catch(err){
          setTimeout(() => {
            try{ recognition.start(); }
            catch(e2){
              recognition = buildRecognition();
              try{ recognition.start(); }
              catch(e3){ hardStop(); }
            }
          }, 500);
        }
      }, 200);
    } else {
      hardStop();
    }
  };

  return r;
}

function hardStop(){
  listening = false;
  userStopped = true;
  clearTimeout(restartTimer);
  micBtn.classList.remove("listening");
  micRing.classList.remove("listening");
  liveBar.classList.remove("active");
  statusText.textContent = "Mikrofon drücken um Dauerhören zu starten";
  statusText.classList.remove("active");
}

if (!SR){
  noSupport.style.display = "block";
  micBtn.disabled = true;
  micBtn.style.opacity = "0.4";
  statusText.textContent = "Texteingabe verfügbar (Sprache nur in Chrome/Edge/Safari)";
} else {
  recognition = buildRecognition();
  micBtn.addEventListener("click", () => {
    if (listening){
      userStopped = true;
      try{ recognition.stop(); } catch(e){}
      hardStop();
    } else {
      userStopped = false;
      try{ recognition.start(); }
      catch(e){
        recognition = buildRecognition();
        try{ recognition.start(); }
        catch(e2){ statusText.textContent = "Fehler — Seite neu laden"; }
      }
    }
  });
}

// Init
search();

// ════════════════════════════════════════════════════════════════════════════
// GUTTER CALCULATOR — Regenrinne & Fallrohr (Titanzink / Kupfer)
// ════════════════════════════════════════════════════════════════════════════
// Sources:
//   DIN EN 612  — Halbrunde Hängedachrinnen und Regenfallrohre (Zuschnittsbreite)
//   DIN EN 988  — Titanzink, ρ = 7,2 g/cm³ (NedZink / Rheinzink Datenblätter)
//   Kupfer ρ = 8,93 g/cm³ (Industrie-Standardwert)
//
// Formel Rinne (halbrund, „halbes Rohr"):
//   m [kg] = Zuschnittsbreite [m] × Wandstärke [m] × Dichte [kg/m³] × Länge [m]
// Formel Fallrohr (rund, voll):
//   m [kg] = π × Außendurchmesser [m] × Wandstärke [m] × Dichte [kg/m³] × Länge [m]
//   (dünnwandige Näherung: Mantelfläche ≈ π·D·t)

const GUTTER_DEFAULTS = {
  // Nenngröße → { Zuschnittsbreite mm, Wandst. Zink mm, Wandst. Kupfer mm, empf. Fallrohr-Ø mm }
  "DN 80":  { cutWidth: 200, zinkT: 0.65, kupferT: 0.60, pipeDN: 60  },
  "DN 100": { cutWidth: 250, zinkT: 0.65, kupferT: 0.60, pipeDN: 80  },
  "DN 125": { cutWidth: 285, zinkT: 0.70, kupferT: 0.60, pipeDN: 87  },
  "DN 150": { cutWidth: 333, zinkT: 0.70, kupferT: 0.60, pipeDN: 100 },
  "DN 200": { cutWidth: 400, zinkT: 0.80, kupferT: 0.70, pipeDN: 120 },
  "DN 250": { cutWidth: 500, zinkT: 0.80, kupferT: 0.70, pipeDN: 150 }
};
const GUTTER_DENSITY = { zink: 7200, kupfer: 8930 }; // kg/m³
const GUTTER_QNG = {
  zink:   { code: "2.11", name: "Zinkblech",  missing: false },
  kupfer: { code: null,   name: "Kupfer — kein QNG-Eintrag", missing: true }
};

// State
let gutterState = { material: "zink", size: "DN 100", pipeSize: "80" };

// Refs (named to avoid collisions with the search-screen variables)
const gMaterialCards = document.querySelectorAll('.material-card[data-material]');
const gDensity      = $("gutterDensity");
const gDensityReset = $("gutterDensityReset");
const gKupferHint   = $("gutterKupferHint");
const gSize         = $("gutterSize");
const gCutWidth     = $("gutterCutWidth");
const gThickness    = $("gutterThickness");
const gLength       = $("gutterLength");
const pSize         = $("pipeSize");
const pDiameter     = $("pipeDiameter");
const pThickness    = $("pipeThickness");
const pLength       = $("pipeLength");
const gResult       = $("gutterResult");
const pResult       = $("pipeResult");
const gTotal        = $("gutterTotal");
const gEpd          = $("gutterEpd");
const gEpdCode      = $("gutterEpdCode");
const gEpdCopy      = $("gutterEpdCopy");
const gMaterialLbl  = $("gutterMaterialLabel");
const gResetAll     = $("gutterReset");

// Number formatters — German locale
function fmtN(n, decimals){
  if (n === null || n === undefined || !isFinite(n)) return "—";
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
function fmtUpto(n, max){
  if (n === null || n === undefined || !isFinite(n)) return "—";
  return n.toLocaleString("de-DE", { maximumFractionDigits: max });
}

// Parse a German-style number from a text input (accepts "," and ".").
// Returns finite non-negative number, or null on invalid.
// Hard upper bound 1e6 — anything beyond that is almost certainly a typo
// and we don't want to render absurd values that suggest false precision.
function parseDE(text){
  if (typeof text !== "string") return null;
  const s = text.trim().replace(/\s/g, "").replace(",", ".");
  if (!s) return null;
  if (!/^[0-9]+(\.[0-9]+)?$/.test(s)) return null;
  const n = parseFloat(s);
  if (!isFinite(n) || n < 0 || n > 1_000_000) return null;
  return n;
}

// Default helpers
function defThicknessNow(){
  const sz = GUTTER_DEFAULTS[gutterState.size] || GUTTER_DEFAULTS["DN 100"];
  return gutterState.material === "kupfer" ? sz.kupferT : sz.zinkT;
}
function defCutWidth(){
  return (GUTTER_DEFAULTS[gutterState.size] || GUTTER_DEFAULTS["DN 100"]).cutWidth;
}
function defPipeDia(){
  const n = parseFloat(gutterState.pipeSize);
  return isFinite(n) && n > 0 ? n : 80;
}
function defDensity(){
  return GUTTER_DENSITY[gutterState.material];
}

// DOM helpers — no innerHTML for derived data (CSP-safe, XSS-safe by construction)
function clearChildren(el){ while (el.firstChild) el.removeChild(el.firstChild); }
function calcLine(parent, text, cls){
  const div = document.createElement("div");
  div.className = "calc-line" + (cls ? " " + cls : "");
  div.textContent = text;
  parent.appendChild(div);
}

// State transitions ─────────────────────────────────────────────
function setGutterMaterial(mat){
  if (mat !== "zink" && mat !== "kupfer") return;
  const prevMat = gutterState.material;
  gutterState.material = mat;

  gMaterialCards.forEach(c => {
    c.classList.toggle("active", c.dataset.material === mat);
    c.classList.toggle("copper", mat === "kupfer" && c.dataset.material === "kupfer");
  });

  // Carry user edits across: only overwrite a field whose value still equals
  // the PREVIOUS material's default (= user has not customized it).
  // This way, custom inputs are preserved when switching materials.
  const prevDens = GUTTER_DENSITY[prevMat];
  if (parseDE(gDensity.value) === prevDens){
    gDensity.value = String(defDensity());
  }
  const sz = GUTTER_DEFAULTS[gutterState.size];
  const prevT = prevMat === "zink" ? sz.zinkT : sz.kupferT;
  if (parseDE(gThickness.value) === prevT){
    gThickness.value = String(defThicknessNow()).replace(".", ",");
  }
  if (parseDE(pThickness.value) === prevT){
    pThickness.value = String(defThicknessNow()).replace(".", ",");
  }

  gKupferHint.classList.toggle("show", mat === "kupfer");
  gMaterialLbl.textContent = mat === "zink" ? "Titanzink" : "Kupfer";
  recomputeGutter();
}

function setGutterSize(name){
  if (!GUTTER_DEFAULTS[name]) return;
  gutterState.size = name;
  const def = GUTTER_DEFAULTS[name];
  // On size change we always reset cutWidth + thicknesses, since size IS the choice
  gCutWidth.value  = String(def.cutWidth);
  gThickness.value = String(defThicknessNow()).replace(".", ",");
  pSize.value      = String(def.pipeDN);
  setPipeSize(String(def.pipeDN));
}

function setPipeSize(val){
  gutterState.pipeSize = val;
  pDiameter.value = val;
  pThickness.value = String(defThicknessNow()).replace(".", ",");
  recomputeGutter();
}

// Core calculation + render ─────────────────────────────────────
function recomputeGutter(){
  const dens = parseDE(gDensity.value);
  const cutW = parseDE(gCutWidth.value);
  const gT   = parseDE(gThickness.value);
  const gL   = parseDE(gLength.value);
  const pD   = parseDE(pDiameter.value);
  const pT   = parseDE(pThickness.value);
  const pL   = parseDE(pLength.value);

  // Visual validity (only mark when not empty)
  const pairs = [
    [gDensity, dens], [gCutWidth, cutW], [gThickness, gT],
    [pDiameter, pD], [pThickness, pT],
    [gLength, gL], [pLength, pL]
  ];
  for (const [el, v] of pairs){
    el.classList.toggle("invalid", el.value !== "" && v === null);
  }

  // ── Regenrinne
  clearChildren(gResult);
  let gMass = null;
  if (dens !== null && cutW !== null && gT !== null && gL !== null && gL > 0){
    const b_m = cutW / 1000, t_m = gT / 1000;
    gMass = b_m * t_m * dens * gL;
    calcLine(gResult, "Zuschnittsbreite × Wandstärke × Dichte × Länge", "formula");
    calcLine(gResult,
      fmtUpto(b_m, 4) + " m × " +
      fmtUpto(t_m, 5) + " m × " +
      fmtN(dens, 0) + " kg/m³ × " +
      fmtUpto(gL, 2) + " m",
      "formula");
    calcLine(gResult,
      "= " + fmtN(gMass, 2) + " kg  (≙ " + fmtN(gMass / gL, 3) + " kg/m)",
      "subtotal");
  } else if (gL === 0){
    calcLine(gResult, "— Laufmeter Rinne = 0", "error");
  } else {
    calcLine(gResult, "— Bitte Werte eintragen", "error");
  }

  // ── Fallrohr (dünnwandige Näherung: A_mantel ≈ π × D × t)
  clearChildren(pResult);
  let pMass = null;
  if (dens !== null && pD !== null && pT !== null && pL !== null && pL > 0){
    const d_m = pD / 1000, t_m = pT / 1000;
    pMass = Math.PI * d_m * t_m * dens * pL;
    calcLine(pResult, "π × Außendurchmesser × Wandstärke × Dichte × Länge", "formula");
    calcLine(pResult,
      "π × " +
      fmtUpto(d_m, 4) + " m × " +
      fmtUpto(t_m, 5) + " m × " +
      fmtN(dens, 0) + " kg/m³ × " +
      fmtUpto(pL, 2) + " m",
      "formula");
    calcLine(pResult,
      "= " + fmtN(pMass, 2) + " kg  (≙ " + fmtN(pMass / pL, 3) + " kg/m)",
      "subtotal");
  } else if (pL === 0){
    calcLine(pResult, "— Laufmeter Fallrohr = 0", "error");
  } else {
    calcLine(pResult, "— Bitte Werte eintragen", "error");
  }

  // ── Gesamt
  const total = (gMass || 0) + (pMass || 0);
  clearChildren(gTotal);
  const tNode = document.createTextNode(
    (gMass === null && pMass === null) ? "— " : fmtN(total, 2) + " "
  );
  gTotal.appendChild(tNode);
  const u = document.createElement("span");
  u.className = "unit"; u.textContent = "kg";
  gTotal.appendChild(u);

  // ── EPD block
  const epd = GUTTER_QNG[gutterState.material];
  clearChildren(gEpdCode);
  if (epd.missing){
    gEpd.classList.add("calc-epd-missing");
    gEpdCode.appendChild(document.createTextNode("kein direkter Eintrag"));
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = "Kupfer ist nicht in QNG 2023 v1.3 — in EcoCad Ökobaudat-Prozessdatensatz „Kupferband / Kupferblech“ zuweisen";
    gEpdCode.appendChild(name);
    gEpdCopy.style.display = "none";
  } else {
    gEpd.classList.remove("calc-epd-missing");
    gEpdCode.appendChild(document.createTextNode(epd.code + "  "));
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = epd.name;
    gEpdCode.appendChild(name);
    gEpdCopy.style.display = "";
    gEpdCopy.textContent = "Kopieren";
    gEpdCopy.classList.remove("copied");
  }
}

// Wire up ────────────────────────────────────────────────────────
gMaterialCards.forEach(c => {
  c.addEventListener("click", () => setGutterMaterial(c.dataset.material));
});

gSize.addEventListener("change", () => setGutterSize(gSize.value));
pSize.addEventListener("change", () => setPipeSize(pSize.value));

[gDensity, gCutWidth, gThickness, gLength, pDiameter, pThickness, pLength].forEach(el => {
  el.addEventListener("input", recomputeGutter);
});

// Per-field reset buttons
gDensityReset.addEventListener("click", () => {
  gDensity.value = String(defDensity());
  recomputeGutter();
});
document.querySelectorAll("[data-reset]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.reset;
    if (target === "gutterCutWidth"){
      gCutWidth.value = String(defCutWidth());
    } else if (target === "gutterThickness"){
      gThickness.value = String(defThicknessNow()).replace(".", ",");
    } else if (target === "pipeDiameter"){
      pDiameter.value = String(defPipeDia());
    } else if (target === "pipeThickness"){
      pThickness.value = String(defThicknessNow()).replace(".", ",");
    }
    recomputeGutter();
  });
});

// Copy EPD code
gEpdCopy.addEventListener("click", () => {
  const epd = GUTTER_QNG[gutterState.material];
  if (epd.missing || !epd.code) return;
  if (!navigator.clipboard){
    showToast(epd.code + " (Kopieren nicht unterstützt)", "terra");
    return;
  }
  navigator.clipboard.writeText(epd.code).then(() => {
    gEpdCopy.textContent = "✓ kopiert";
    gEpdCopy.classList.add("copied");
    setTimeout(() => {
      gEpdCopy.textContent = "Kopieren";
      gEpdCopy.classList.remove("copied");
    }, 1500);
  }).catch(() => {
    showToast("Kopieren fehlgeschlagen", "terra");
  });
});

// Reset all
gResetAll.addEventListener("click", () => {
  if (!confirm("Alle Eingaben zurücksetzen?")) return;
  gutterState = { material: "zink", size: "DN 100", pipeSize: "80" };
  // Explicit, deterministic reset — bypass the carry-over logic of
  // setGutterMaterial(), since here we WANT a hard reset to defaults.
  gMaterialCards.forEach(c => {
    c.classList.toggle("active", c.dataset.material === "zink");
    c.classList.remove("copper");
  });
  gKupferHint.classList.remove("show");
  gMaterialLbl.textContent = "Titanzink";
  gSize.value      = "DN 100";
  gCutWidth.value  = String(GUTTER_DEFAULTS["DN 100"].cutWidth);
  gThickness.value = String(GUTTER_DEFAULTS["DN 100"].zinkT).replace(".", ",");
  gDensity.value   = String(GUTTER_DENSITY.zink);
  pSize.value      = "80";
  pDiameter.value  = "80";
  pThickness.value = String(GUTTER_DEFAULTS["DN 100"].zinkT).replace(".", ",");
  gLength.value    = "";
  pLength.value    = "";
  recomputeGutter();
  showToast("Zurückgesetzt", "sage");
});

// Initial render
recomputeGutter();

// ════════════════════════════════════════════════════════════════════════════
// SILL CALCULATOR — Fensterbänke (Alu außen / Holz innen)
// ════════════════════════════════════════════════════════════════════════════
// Sources:
//   GUTMANN Katalog Aluminium Fensterbänke (GS40, EN AW-6060 T66)
//   Standard-Bauteildetails Holzrahmenbau 24 cm
//
// Formel Alu außen ("gestrecktes Blech"):
//   m [kg] = gestreckte Länge [m] × Stärke [m] × Dichte [kg/m³] × lfm [m]
// Formel Holz innen (Volumen):
//   V [m³] = Ausladung [m] × Dicke [m] × lfm [m]
//
// Defaults (justierbar in jedem Feld via Reset-Button):
//   gestreckte Länge außen: 250 mm
//   Materialstärke Alu:     2.0 mm (GS40 Standard)
//   Dichte Aluminium:       2700 kg/m³ (EN AW-6060 T66)
//   Ausladung innen:        175 mm
//   Stärke Holz:            20 / 25 mm Auswahl, optional frei

const SILL_DEFAULTS = {
  aluLength:     250,    // mm
  aluThickness:  2.0,    // mm
  aluDensity:    2700,   // kg/m³
  woodLength:    175     // mm
};
const SILL_QNG = {
  alu:  { code: "2.15", name: "Aluminium Profil" },
  wood: { code: "3.1",  name: "Hobelware (Durchschnitt DE)" }
};

// State
let sillState = { woodThickness: "20" };   // "20" | "25" | "free"

// Refs
const sAluLen        = $("sillAluLength");
const sAluThick      = $("sillAluThickness");
const sAluDens       = $("sillAluDensity");
const sAluLfm        = $("sillAluRunning");
const sWoodLen       = $("sillWoodLength");
const sWoodLfm       = $("sillWoodRunning");
const sWoodThickRow  = $("sillWoodThicknessCustomRow");
const sWoodThickCust = $("sillWoodThicknessCustom");
const sAluResult     = $("sillAluResult");
const sWoodResult    = $("sillWoodResult");
const sAluTotal      = $("sillAluTotal");
const sWoodTotal     = $("sillWoodTotal");
const sAluEpdCopy    = $("sillAluEpdCopy");
const sWoodEpdCopy   = $("sillWoodEpdCopy");
const sResetAll      = $("sillReset");

// Bauteildetail lightbox refs
const detailModal   = $("detailModal");
const detailTitle   = $("detailTitle");
const detailImage   = $("detailImage");
const detailCaption = $("detailCaption");

const DETAIL_INFO = {
  profil: {
    title: "GS40 — Aluminium-Fensterbank, Profilzeichnung",
    src:   "detail-gs40-profil.jpg",
    cap:   "GUTMANN GS40, Ausladung 50–500 mm, Tropfkante 40 mm, Rückaufkantung 25 mm, Material EN AW-6060 T66"
  },
  vertikal: {
    title: "Vertikalschnitt — Fenster-Einbau mit GS40 und Holz-Innenfensterbank",
    src:   "detail-anschluss-vertikal.jpg",
    cap:   "Holzrahmenbau 24 cm, Putzanschlussprofil, Gleitabschluss BF4006, luftdichter Anschluss werkseitig"
  },
  horizontal: {
    title: "Horizontalschnitt — Leibungsdetail",
    src:   "detail-anschluss-horizontal.jpg",
    cap:   "Anschluss seitlich, Kompriband, luftdichte Abklebung werkseitig"
  }
};

// Open lightbox for a given detail key
function openDetail(key){
  const info = DETAIL_INFO[key];
  if (!info) return;
  detailTitle.textContent = info.title;
  detailImage.src = info.src;
  detailImage.alt = info.title;
  detailCaption.textContent = info.cap;
  detailModal.classList.add("open");
  detailModal.setAttribute("aria-hidden", "false");
}

// Wire detail thumbnails
document.querySelectorAll("[data-detail]").forEach(btn => {
  btn.addEventListener("click", () => openDetail(btn.dataset.detail));
});

// Reset helpers
function setSillDefault(key){
  if (key === "aluLength")    sAluLen.value   = String(SILL_DEFAULTS.aluLength);
  if (key === "aluThickness") sAluThick.value = String(SILL_DEFAULTS.aluThickness).replace(".", ",");
  if (key === "aluDensity")   sAluDens.value  = String(SILL_DEFAULTS.aluDensity);
  if (key === "woodLength")   sWoodLen.value  = String(SILL_DEFAULTS.woodLength);
}

document.querySelectorAll("[data-sill-reset]").forEach(btn => {
  btn.addEventListener("click", () => {
    setSillDefault(btn.dataset.sillReset);
    recomputeSill();
  });
});

// Wood-thickness option selector
document.querySelectorAll("[data-wood-thickness]").forEach(btn => {
  btn.addEventListener("click", () => {
    const v = btn.dataset.woodThickness;
    if (v !== "20" && v !== "25" && v !== "free") return;
    sillState.woodThickness = v;
    document.querySelectorAll("[data-wood-thickness]").forEach(b => {
      b.classList.toggle("active", b.dataset.woodThickness === v);
    });
    sWoodThickRow.style.display = (v === "free") ? "" : "none";
    if (v === "free"){
      // focus the input after a tick so the layout has settled
      setTimeout(() => sWoodThickCust.focus(), 50);
    }
    recomputeSill();
  });
});

// What thickness (in mm) is currently selected for wood
function currentWoodThicknessMm(){
  if (sillState.woodThickness === "20") return 20;
  if (sillState.woodThickness === "25") return 25;
  return parseDE(sWoodThickCust.value);  // may be null
}

// Re-render all sill results
function recomputeSill(){
  // ── A: Alu außen
  const aLen   = parseDE(sAluLen.value);
  const aThick = parseDE(sAluThick.value);
  const aDens  = parseDE(sAluDens.value);
  const aLfm   = parseDE(sAluLfm.value);

  [
    [sAluLen, aLen], [sAluThick, aThick],
    [sAluDens, aDens], [sAluLfm, aLfm]
  ].forEach(([el, v]) => {
    el.classList.toggle("invalid", el.value !== "" && v === null);
  });

  clearChildren(sAluResult);
  let aMass = null;
  if (aLen !== null && aThick !== null && aDens !== null && aLfm !== null && aLfm > 0){
    const len_m = aLen / 1000, t_m = aThick / 1000;
    aMass = len_m * t_m * aDens * aLfm;
    calcLine(sAluResult, "gestreckte Länge × Stärke × Dichte × Laufmeter", "formula");
    calcLine(sAluResult,
      fmtUpto(len_m, 4) + " m × " +
      fmtUpto(t_m, 4) + " m × " +
      fmtN(aDens, 0) + " kg/m³ × " +
      fmtUpto(aLfm, 2) + " m",
      "formula");
    calcLine(sAluResult,
      "= " + fmtN(aMass, 2) + " kg  (≙ " + fmtN(aMass / aLfm, 3) + " kg/m)",
      "subtotal");
  } else if (aLfm === 0){
    calcLine(sAluResult, "— Laufmeter = 0", "error");
  } else {
    calcLine(sAluResult, "— Bitte Werte eintragen", "error");
  }
  clearChildren(sAluTotal);
  sAluTotal.appendChild(document.createTextNode(aMass === null ? "— " : fmtN(aMass, 2) + " "));
  const ua = document.createElement("span"); ua.className = "unit"; ua.textContent = "kg";
  sAluTotal.appendChild(ua);

  // ── B: Holz innen (Volumen)
  const wLen   = parseDE(sWoodLen.value);
  const wThick = currentWoodThicknessMm();
  const wLfm   = parseDE(sWoodLfm.value);

  sWoodLen.classList.toggle("invalid", sWoodLen.value !== "" && wLen === null);
  sWoodLfm.classList.toggle("invalid", sWoodLfm.value !== "" && wLfm === null);
  if (sillState.woodThickness === "free"){
    sWoodThickCust.classList.toggle("invalid",
      sWoodThickCust.value !== "" && wThick === null);
  }

  clearChildren(sWoodResult);
  let wVol = null;
  if (wLen !== null && wThick !== null && wThick > 0 && wLfm !== null && wLfm > 0){
    const len_m = wLen / 1000, t_m = wThick / 1000;
    wVol = len_m * t_m * wLfm;
    calcLine(sWoodResult, "Ausladung × Dicke × Laufmeter", "formula");
    calcLine(sWoodResult,
      fmtUpto(len_m, 4) + " m × " +
      fmtUpto(t_m, 4) + " m × " +
      fmtUpto(wLfm, 2) + " m",
      "formula");
    // Provide both m³ and dm³ (= Liter) — small volumes are easier to read as dm³
    const vol_dm3 = wVol * 1000;
    calcLine(sWoodResult,
      "= " + fmtN(wVol, 5) + " m³  (≙ " + fmtN(vol_dm3, 2) + " dm³)",
      "subtotal");
  } else if (wLfm === 0){
    calcLine(sWoodResult, "— Laufmeter = 0", "error");
  } else if (sillState.woodThickness === "free" && wThick === null){
    calcLine(sWoodResult, "— Bitte eigene Dicke eintragen", "error");
  } else {
    calcLine(sWoodResult, "— Bitte Werte eintragen", "error");
  }
  clearChildren(sWoodTotal);
  sWoodTotal.appendChild(document.createTextNode(wVol === null ? "— " : fmtN(wVol, 5) + " "));
  const uw = document.createElement("span"); uw.className = "unit"; uw.textContent = "m³";
  sWoodTotal.appendChild(uw);
}

// Inputs
[sAluLen, sAluThick, sAluDens, sAluLfm,
 sWoodLen, sWoodLfm, sWoodThickCust].forEach(el => {
  el.addEventListener("input", recomputeSill);
});

// Copy EPD buttons
function wireEpdCopy(btn, code){
  btn.addEventListener("click", () => {
    if (!navigator.clipboard){
      showToast(code + " (Kopieren nicht unterstützt)", "terra");
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = "✓ kopiert";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove("copied");
      }, 1500);
    }).catch(() => {
      showToast("Kopieren fehlgeschlagen", "terra");
    });
  });
}
wireEpdCopy(sAluEpdCopy,  SILL_QNG.alu.code);
wireEpdCopy(sWoodEpdCopy, SILL_QNG.wood.code);

// Reset all
sResetAll.addEventListener("click", () => {
  if (!confirm("Alle Fensterbank-Eingaben zurücksetzen?")) return;
  setSillDefault("aluLength");
  setSillDefault("aluThickness");
  setSillDefault("aluDensity");
  setSillDefault("woodLength");
  sAluLfm.value = "";
  sWoodLfm.value = "";
  sWoodThickCust.value = "";
  sillState.woodThickness = "20";
  document.querySelectorAll("[data-wood-thickness]").forEach(b => {
    b.classList.toggle("active", b.dataset.woodThickness === "20");
  });
  sWoodThickRow.style.display = "none";
  recomputeSill();
  showToast("Zurückgesetzt", "sage");
});

// Initial render
recomputeSill();

// ════════════════════════════════════════════════════════════════════════════
// STATIK CALCULATOR — Stahlstützen / Stahlträger / Schwelle&Rähm / Pfetten
// ════════════════════════════════════════════════════════════════════════════
// Sources:
//   DIN 1025-3 (HEA), DIN 1025-2 (HEB), DIN 1025-4 (HEM), DIN 1025-5 (IPE)
//   EN 10365 (Nachfolgenorm) — Werte identisch für die hier gelisteten Profile
//   Peiner Träger Tabellen (h, b, Profilgewicht)
//
// Formeln:
//   Stahl:        m = Profilgewicht [kg/m] × Länge [m] × Anzahl
//   Brandschutz:  m = Boxumfang [m] × Länge [m] × Anzahl × Lagen × Dicke [m] × Dichte [kg/m³]
//                 Boxumfang 4-seitig: 2 × (h + b)
//                 Boxumfang 3-seitig: h + 2b  (in Wand stehend, Steg parallel zur Wand)
//   Holz Volumen: V = Breite [m] × Höhe [m] × Länge [m]
//
// Profilabmessungen (h, b in mm) und Profilgewicht (kg/m) je nach DIN.

const STEEL_PROFILES = {
  HEA: {
    label: "HEA (DIN 1025-3) — leicht",
    sizes: {
      "100":  { weight: 16.7,  h: 96,   b: 100 },
      "120":  { weight: 19.9,  h: 114,  b: 120 },
      "140":  { weight: 24.7,  h: 133,  b: 140 },
      "160":  { weight: 30.4,  h: 152,  b: 160 },
      "180":  { weight: 35.5,  h: 171,  b: 180 },
      "200":  { weight: 42.3,  h: 190,  b: 200 },
      "220":  { weight: 50.5,  h: 210,  b: 220 },
      "240":  { weight: 60.3,  h: 230,  b: 240 },
      "260":  { weight: 68.2,  h: 250,  b: 260 },
      "280":  { weight: 76.4,  h: 270,  b: 280 },
      "300":  { weight: 88.3,  h: 290,  b: 300 },
      "320":  { weight: 97.6,  h: 310,  b: 300 },
      "340":  { weight: 104.8, h: 330,  b: 300 },
      "360":  { weight: 112.1, h: 350,  b: 300 },
      "400":  { weight: 124.8, h: 390,  b: 300 },
      "450":  { weight: 139.8, h: 440,  b: 300 },
      "500":  { weight: 155.1, h: 490,  b: 300 },
      "550":  { weight: 166.2, h: 540,  b: 300 },
      "600":  { weight: 177.8, h: 590,  b: 300 },
      "650":  { weight: 190.0, h: 640,  b: 300 },
      "700":  { weight: 204.0, h: 690,  b: 300 },
      "800":  { weight: 224.0, h: 790,  b: 300 },
      "900":  { weight: 252.0, h: 890,  b: 300 },
      "1000": { weight: 272.0, h: 990,  b: 300 }
    }
  },
  HEB: {
    label: "HEB (DIN 1025-2) — mittel",
    sizes: {
      "100":  { weight: 20.4,  h: 100,  b: 100 },
      "120":  { weight: 26.7,  h: 120,  b: 120 },
      "140":  { weight: 33.7,  h: 140,  b: 140 },
      "160":  { weight: 42.6,  h: 160,  b: 160 },
      "180":  { weight: 51.2,  h: 180,  b: 180 },
      "200":  { weight: 61.3,  h: 200,  b: 200 },
      "220":  { weight: 71.5,  h: 220,  b: 220 },
      "240":  { weight: 83.2,  h: 240,  b: 240 },
      "260":  { weight: 93.0,  h: 260,  b: 260 },
      "280":  { weight: 103,   h: 280,  b: 280 },
      "300":  { weight: 117,   h: 300,  b: 300 },
      "320":  { weight: 127,   h: 320,  b: 300 },
      "340":  { weight: 134,   h: 340,  b: 300 },
      "360":  { weight: 142,   h: 360,  b: 300 },
      "400":  { weight: 155,   h: 400,  b: 300 },
      "450":  { weight: 171,   h: 450,  b: 300 },
      "500":  { weight: 187,   h: 500,  b: 300 },
      "550":  { weight: 199,   h: 550,  b: 300 },
      "600":  { weight: 212,   h: 600,  b: 300 },
      "650":  { weight: 225,   h: 650,  b: 300 },
      "700":  { weight: 241,   h: 700,  b: 300 },
      "800":  { weight: 262,   h: 800,  b: 300 },
      "900":  { weight: 291,   h: 900,  b: 300 },
      "1000": { weight: 314,   h: 1000, b: 300 }
    }
  },
  HEM: {
    label: "HEM (DIN 1025-4) — verstärkt",
    sizes: {
      "100":  { weight: 41.8,  h: 120,  b: 106 },
      "120":  { weight: 52.1,  h: 140,  b: 126 },
      "140":  { weight: 63.2,  h: 160,  b: 146 },
      "160":  { weight: 76.2,  h: 180,  b: 166 },
      "180":  { weight: 88.9,  h: 200,  b: 186 },
      "200":  { weight: 103.1, h: 220,  b: 206 },
      "220":  { weight: 117.3, h: 240,  b: 226 },
      "240":  { weight: 156.7, h: 270,  b: 248 },
      "260":  { weight: 172.4, h: 290,  b: 268 },
      "280":  { weight: 188.5, h: 310,  b: 288 },
      "300":  { weight: 237.9, h: 340,  b: 310 },
      "320":  { weight: 245.0, h: 359,  b: 309 },
      "340":  { weight: 247.9, h: 377,  b: 309 },
      "360":  { weight: 250.3, h: 395,  b: 308 },
      "400":  { weight: 255.7, h: 432,  b: 307 },
      "450":  { weight: 263.3, h: 478,  b: 307 },
      "500":  { weight: 270.3, h: 524,  b: 306 },
      "550":  { weight: 278.2, h: 572,  b: 306 },
      "600":  { weight: 285.5, h: 620,  b: 305 },
      "650":  { weight: 293.0, h: 668,  b: 305 },
      "700":  { weight: 301.0, h: 716,  b: 304 },
      "800":  { weight: 317.0, h: 814,  b: 303 },
      "900":  { weight: 333.0, h: 910,  b: 302 },
      "1000": { weight: 349.0, h: 1008, b: 302 }
    }
  },
  IPE: {
    label: "IPE (DIN 1025-5) — mittelbreit",
    sizes: {
      "80":   { weight: 6.0,   h: 80,   b: 46  },
      "100":  { weight: 8.1,   h: 100,  b: 55  },
      "120":  { weight: 10.4,  h: 120,  b: 64  },
      "140":  { weight: 12.9,  h: 140,  b: 73  },
      "160":  { weight: 15.8,  h: 160,  b: 82  },
      "180":  { weight: 18.8,  h: 180,  b: 91  },
      "200":  { weight: 22.4,  h: 200,  b: 100 },
      "220":  { weight: 26.2,  h: 220,  b: 110 },
      "240":  { weight: 30.7,  h: 240,  b: 120 },
      "270":  { weight: 36.1,  h: 270,  b: 135 },
      "300":  { weight: 42.2,  h: 300,  b: 150 },
      "330":  { weight: 49.1,  h: 330,  b: 160 },
      "360":  { weight: 57.1,  h: 360,  b: 170 },
      "400":  { weight: 66.3,  h: 400,  b: 180 },
      "450":  { weight: 77.6,  h: 450,  b: 190 },
      "500":  { weight: 90.7,  h: 500,  b: 200 },
      "550":  { weight: 106,   h: 550,  b: 210 },
      "600":  { weight: 122,   h: 600,  b: 220 }
    }
  }
};

// Brandschutzplatten — Material-Eigenschaften und QNG-Zuordnung
const BRAND_BOARDS = {
  gkb: {
    label: "Gipskartonplatte (GKF, Feuerschutz)",
    density: 850,          // kg/m³ — typischer Wert für GKF
    qng: { code: "7.24", name: "Gipskartonplatte (Feuerschutz)" },
    thicknesses: ["12,5", "15", "18", "20", "25"]   // mm
  },
  gipsfaser: {
    label: "Gipsfaserplatte",
    density: 1180,         // kg/m³ — typischer Wert (Fermacell-Klasse)
    qng: { code: "7.23", name: "Gipsfaserplatte" },
    thicknesses: ["10", "12,5", "15", "18"]
  }
};

// ────────────────────────────────────────────────────────────────
// Statics navigation — sub-menu switch
// ────────────────────────────────────────────────────────────────

const VALID_STATICS = new Set(["menu", "stuetzen", "traeger", "schwelle", "pfetten"]);
let staticsView = "menu";

function setStaticsView(name){
  if (!VALID_STATICS.has(name)) name = "menu";
  staticsView = name;
  const menu = $("staticsMenu");
  menu.style.display = (name === "menu") ? "" : "none";
  document.querySelectorAll("[data-stat-sub]").forEach(el => {
    el.classList.toggle("active", el.dataset.statSub === name);
  });
}

document.querySelectorAll("[data-statics]").forEach(card => {
  card.addEventListener("click", () => setStaticsView(card.dataset.statics));
});
document.querySelectorAll("[data-stat-back]").forEach(btn => {
  btn.addEventListener("click", () => setStaticsView("menu"));
});

// When the user goes Home and returns to Statics, reset to the menu.
// Hook into the existing navigateTo by observing the back button click is
// already triggered above; for completeness, reset on screen change too.
const _origNavigateTo = navigateTo;
navigateTo = function(name){
  _origNavigateTo(name);
  if (name === "statics") setStaticsView("menu");
};

// ────────────────────────────────────────────────────────────────
// Steel calculators (Stützen + Träger share logic)
// ────────────────────────────────────────────────────────────────

// State per sub-section. Track active profile type and selected size.
const steelState = {
  stuetzen: { type: "HEA", size: "100", brandshow: false,
              brand: { material: "gkb", layers: 1, thickness: 12.5, sides: 4 } },
  traeger:  { type: "HEA", size: "100", brandshow: false,
              brand: { material: "gkb", layers: 1, thickness: 12.5, sides: 4 } }
};

// Populate size dropdown for a given group, preserving valid current size
function populateSizeDropdown(group){
  const state = steelState[group];
  const sel = $(group + "Size");
  const sizes = STEEL_PROFILES[state.type].sizes;
  // Wipe options
  while (sel.firstChild) sel.removeChild(sel.firstChild);
  for (const sz of Object.keys(sizes)){
    const opt = document.createElement("option");
    opt.value = sz;
    opt.textContent = state.type + " " + sz +
      "  (h=" + sizes[sz].h + ", b=" + sizes[sz].b + ", " + fmtN(sizes[sz].weight, 1) + " kg/m)";
    sel.appendChild(opt);
  }
  // If current size doesn't exist for this profile, pick first
  if (!sizes[state.size]){
    state.size = Object.keys(sizes)[0];
  }
  sel.value = state.size;
}

// Render kg/m readout into the readonly field
function syncWeightField(group){
  const state = steelState[group];
  const wEl = $(group + "Weight");
  const w = STEEL_PROFILES[state.type].sizes[state.size]?.weight;
  wEl.value = w !== undefined ? fmtN(w, 1).replace(".", ",") : "";
}

// Build the brand-protection inner UI for a given group, once.
function buildBrandFields(group){
  const container = $(group + "BrandFields");
  clearChildren(container);
  const state = steelState[group].brand;

  // Material radio
  const matRow = document.createElement("div");
  matRow.className = "material-grid";
  matRow.style.marginBottom = "10px";
  for (const [key, def] of Object.entries(BRAND_BOARDS)){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "material-card" + (state.material === key ? " active" : "");
    btn.dataset.brandMat = key;
    const label = document.createElement("span");
    label.className = "material-card-label";
    label.style.fontSize = "12px";
    label.textContent = def.label;
    btn.appendChild(label);
    btn.addEventListener("click", () => {
      state.material = key;
      // If the chosen thickness isn't in the new material's list, snap to first
      const allowed = BRAND_BOARDS[key].thicknesses.map(s => parseDE(s));
      if (!allowed.includes(state.thickness)){
        state.thickness = allowed[0];
      }
      buildBrandFields(group);
      recomputeSteel(group);
    });
    matRow.appendChild(btn);
  }
  container.appendChild(matRow);

  // Layers (1 / 2) + Sides (4 / 3) and Thickness in a compact grid
  function makeOptionGrid(opts, currentVal, onPick){
    const grid = document.createElement("div");
    grid.className = "option-grid";
    for (const o of opts){
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option-card" + (o.value === currentVal ? " active" : "");
      const main = document.createTextNode(o.label);
      b.appendChild(main);
      if (o.sub){
        const s = document.createElement("span");
        s.className = "sub";
        s.textContent = o.sub;
        b.appendChild(s);
      }
      b.addEventListener("click", () => onPick(o.value));
      grid.appendChild(b);
    }
    return grid;
  }

  // Lagen
  const layersHead = document.createElement("div");
  layersHead.className = "calc-row-label";
  layersHead.style.marginBottom = "6px";
  layersHead.appendChild(document.createTextNode("Lagen"));
  const sub1 = document.createElement("span"); sub1.className = "sub";
  sub1.textContent = "Anzahl der Plattenlagen"; layersHead.appendChild(sub1);
  container.appendChild(layersHead);
  container.appendChild(makeOptionGrid(
    [{value:1,label:"1-lagig"}, {value:2,label:"2-lagig"}, {value:3,label:"3-lagig"}],
    state.layers,
    v => { state.layers = v; buildBrandFields(group); recomputeSteel(group); }
  ));

  // Plattendicke
  const tHead = document.createElement("div");
  tHead.className = "calc-row-label";
  tHead.style.margin = "10px 0 6px";
  tHead.appendChild(document.createTextNode("Plattendicke"));
  const sub2 = document.createElement("span"); sub2.className = "sub";
  sub2.textContent = "je nach Material"; tHead.appendChild(sub2);
  container.appendChild(tHead);
  const tOpts = BRAND_BOARDS[state.material].thicknesses.map(s => {
    const v = parseDE(s);
    return { value: v, label: s, sub: "mm" };
  });
  container.appendChild(makeOptionGrid(
    tOpts, state.thickness,
    v => { state.thickness = v; buildBrandFields(group); recomputeSteel(group); }
  ));

  // Seiten
  const sHead = document.createElement("div");
  sHead.className = "calc-row-label";
  sHead.style.margin = "10px 0 6px";
  sHead.appendChild(document.createTextNode("Bekleidung"));
  const sub3 = document.createElement("span"); sub3.className = "sub";
  sub3.textContent = "Anzahl bekleideter Seiten"; sHead.appendChild(sub3);
  container.appendChild(sHead);
  container.appendChild(makeOptionGrid(
    [{value:4,label:"4-seitig",sub:"Kasten"},
     {value:3,label:"3-seitig",sub:"in Wand"}],
    state.sides,
    v => { state.sides = v; buildBrandFields(group); recomputeSteel(group); }
  ));
}

function recomputeSteel(group){
  const state = steelState[group];
  const sizes = STEEL_PROFILES[state.type].sizes;
  const profile = sizes[state.size];
  const cnt    = parseDE($(group + "Count").value);
  const length = parseDE($(group + "Length").value);

  $(group + "Count").classList.toggle("invalid",
    $(group + "Count").value !== "" && cnt === null);
  $(group + "Length").classList.toggle("invalid",
    $(group + "Length").value !== "" && length === null);

  const steelResult = $(group + "SteelResult");
  clearChildren(steelResult);
  let steelMass = null;
  if (profile && cnt !== null && cnt > 0 && length !== null && length > 0){
    steelMass = profile.weight * length * cnt;
    calcLine(steelResult, "Profilgewicht × Länge × Anzahl", "formula");
    calcLine(steelResult,
      fmtN(profile.weight, 1) + " kg/m × " +
      fmtUpto(length, 2) + " m × " + cnt,
      "formula");
    calcLine(steelResult,
      "= " + fmtN(steelMass, 2) + " kg",
      "subtotal");
  } else {
    calcLine(steelResult, "— Anzahl und Länge eintragen", "error");
  }
  const steelTotal = $(group + "SteelTotal");
  clearChildren(steelTotal);
  steelTotal.appendChild(document.createTextNode(steelMass === null ? "— " : fmtN(steelMass, 2) + " "));
  const u1 = document.createElement("span"); u1.className = "unit"; u1.textContent = "kg";
  steelTotal.appendChild(u1);

  // Brandschutz
  const brandActive = state.brandshow;
  const brandBlock = $(group + "BrandBlock");
  const brandTot   = $(group + "BrandTotal");
  const brandEpd   = $(group + "BrandEpd");
  brandBlock.style.display = brandActive ? "" : "none";
  brandTot.style.display   = brandActive ? "" : "none";
  brandEpd.style.display   = brandActive ? "" : "none";

  if (brandActive){
    const b = state.brand;
    const board = BRAND_BOARDS[b.material];
    const brandResult = $(group + "BrandResult");
    clearChildren(brandResult);

    let brandMass = null;
    if (profile && cnt !== null && cnt > 0 && length !== null && length > 0 &&
        b.thickness > 0 && b.layers > 0){
      const h_m = profile.h / 1000, b_m = profile.b / 1000;
      const perim_m = (b.sides === 4) ? 2 * (h_m + b_m) : (h_m + 2 * b_m);
      const t_m = b.thickness / 1000;
      // Plattenfläche m² = Umfang × Länge × Anzahl × Lagen
      const area = perim_m * length * cnt * b.layers;
      brandMass = area * t_m * board.density;

      calcLine(brandResult, board.label, "formula");
      calcLine(brandResult,
        "Umfang " + (b.sides === 4 ? "4-seitig" : "3-seitig") +
        " = " + (b.sides === 4 ? "2 × (h + b)" : "h + 2b"),
        "formula");
      calcLine(brandResult,
        (b.sides === 4
          ? "2 × (" + profile.h + " + " + profile.b + ") = " + (2*(profile.h+profile.b)) + " mm"
          : profile.h + " + 2 × " + profile.b + " = " + (profile.h+2*profile.b) + " mm"),
        "formula");
      calcLine(brandResult,
        "Fläche = " + fmtUpto(perim_m, 4) + " m × " + fmtUpto(length, 2) +
        " m × " + cnt + " × " + b.layers + " Lagen = " + fmtN(area, 2) + " m²",
        "formula");
      calcLine(brandResult,
        "Gewicht = " + fmtN(area, 2) + " m² × " + fmtUpto(t_m, 4) +
        " m × " + fmtN(board.density, 0) + " kg/m³",
        "formula");
      calcLine(brandResult,
        "= " + fmtN(brandMass, 2) + " kg",
        "subtotal");
    } else {
      calcLine(brandResult, "— Anzahl, Länge und Dicke eintragen", "error");
    }

    const totVal = $(group + "BrandTotalValue");
    clearChildren(totVal);
    totVal.appendChild(document.createTextNode(brandMass === null ? "— " : fmtN(brandMass, 2) + " "));
    const u2 = document.createElement("span"); u2.className = "unit"; u2.textContent = "kg";
    totVal.appendChild(u2);

    // EPD update
    const epdCode = $(group + "BrandEpdCode");
    clearChildren(epdCode);
    epdCode.appendChild(document.createTextNode(board.qng.code + "  "));
    const epdName = document.createElement("span");
    epdName.className = "name";
    epdName.textContent = board.qng.name;
    epdCode.appendChild(epdName);
  }
}

// Wire up both Stahl-Subscreens
function wireSteelGroup(group){
  // Profile type cards
  document.querySelectorAll(`[data-pgroup="${group}"] .profile-card`).forEach(card => {
    card.addEventListener("click", () => {
      const t = card.dataset.profileType;
      if (!STEEL_PROFILES[t]) return;
      steelState[group].type = t;
      // Toggle active
      document.querySelectorAll(`[data-pgroup="${group}"] .profile-card`).forEach(c => {
        c.classList.toggle("active", c === card);
      });
      populateSizeDropdown(group);
      syncWeightField(group);
      recomputeSteel(group);
    });
  });

  // Size dropdown
  $(group + "Size").addEventListener("change", () => {
    steelState[group].size = $(group + "Size").value;
    syncWeightField(group);
    recomputeSteel(group);
  });

  // Anzahl + Länge
  $(group + "Count").addEventListener("input", () => recomputeSteel(group));
  $(group + "Length").addEventListener("input", () => recomputeSteel(group));

  // Brand toggle
  const toggle = $(group + "BrandToggle");
  toggle.addEventListener("change", () => {
    steelState[group].brandshow = toggle.checked;
    $(group + "BrandFields").classList.toggle("show", toggle.checked);
    if (toggle.checked){
      buildBrandFields(group);
    }
    recomputeSteel(group);
  });

  // Initial fill
  populateSizeDropdown(group);
  syncWeightField(group);
  recomputeSteel(group);
}
wireSteelGroup("stuetzen");
wireSteelGroup("traeger");

// Reset buttons (Stützen / Träger)
document.querySelectorAll("[data-stat-reset]").forEach(btn => {
  btn.addEventListener("click", () => {
    const g = btn.dataset.statReset;
    if (g === "stuetzen" || g === "traeger"){
      if (!confirm("Eingaben für " + (g === "stuetzen" ? "Stahlstützen" : "Stahlträger") + " zurücksetzen?")) return;
      steelState[g] = {
        type: "HEA", size: "100", brandshow: false,
        brand: { material: "gkb", layers: 1, thickness: 12.5, sides: 4 }
      };
      // Reset UI
      document.querySelectorAll(`[data-pgroup="${g}"] .profile-card`).forEach(c => {
        c.classList.toggle("active", c.dataset.profileType === "HEA");
      });
      populateSizeDropdown(g);
      syncWeightField(g);
      $(g + "Count").value = "1";
      $(g + "Length").value = "";
      $(g + "BrandToggle").checked = false;
      $(g + "BrandFields").classList.remove("show");
      recomputeSteel(g);
      showToast("Zurückgesetzt", "sage");
    } else if (g === "schwelle"){
      if (!confirm("Eingaben für Schwelle & Rähm zurücksetzen?")) return;
      document.querySelector('[data-timber="schwelle:b"]').value = "8";
      document.querySelector('[data-timber="schwelle:h"]').value = "24";
      document.querySelector('[data-timber="schwelle:l"]').value = "";
      document.querySelector('[data-timber="raehm:b"]').value = "8";
      document.querySelector('[data-timber="raehm:h"]').value = "24";
      document.querySelector('[data-timber="raehm:l"]').value = "";
      recomputeTimber("schwelle");
      showToast("Zurückgesetzt", "sage");
    } else if (g === "pfetten"){
      if (!confirm("Eingaben für Pfetten zurücksetzen?")) return;
      document.querySelector('[data-timber="fuss:b"]').value = "20";
      document.querySelector('[data-timber="fuss:h"]').value = "24";
      document.querySelector('[data-timber="fuss:l"]').value = "";
      document.querySelector('[data-timber="first:b"]').value = "20";
      document.querySelector('[data-timber="first:h"]').value = "36";
      document.querySelector('[data-timber="first:l"]').value = "";
      recomputeTimber("pfetten");
      showToast("Zurückgesetzt", "sage");
    }
  });
});

// ────────────────────────────────────────────────────────────────
// Holz: Schwelle/Rähm & Pfetten — multi-row sections
// ────────────────────────────────────────────────────────────────

const TIMBER_SECTIONS = {
  schwelle: {
    rows: [
      { key: "schwelle", label: "Schwelle" },
      { key: "raehm",    label: "Rähm" }
    ],
    resultEl: "schwelleResult",
    totalEl:  "schwelleTotal"
  },
  pfetten: {
    rows: [
      { key: "fuss",  label: "Fußpfette" },
      { key: "first", label: "Firstpfette" }
    ],
    resultEl: "pfettenResult",
    totalEl:  "pfettenTotal"
  }
};

function getTimberInput(key, field){
  return document.querySelector('[data-timber="' + key + ':' + field + '"]');
}

function recomputeTimber(section){
  const def = TIMBER_SECTIONS[section];
  const resEl = $(def.resultEl);
  const totEl = $(def.totalEl);
  clearChildren(resEl);

  let grandTotal = 0;
  let anyValid = false;

  for (const r of def.rows){
    const bEl = getTimberInput(r.key, "b");
    const hEl = getTimberInput(r.key, "h");
    const lEl = getTimberInput(r.key, "l");
    const b = parseDE(bEl.value); const h = parseDE(hEl.value); const l = parseDE(lEl.value);

    bEl.classList.toggle("invalid", bEl.value !== "" && b === null);
    hEl.classList.toggle("invalid", hEl.value !== "" && h === null);
    lEl.classList.toggle("invalid", lEl.value !== "" && l === null);

    if (b !== null && h !== null && l !== null && l > 0){
      const b_m = b / 100, h_m = h / 100;   // cm → m
      const vol = b_m * h_m * l;
      grandTotal += vol;
      anyValid = true;
      calcLine(resEl,
        r.label + ": " + fmtUpto(b_m, 3) + " m × " + fmtUpto(h_m, 3) +
        " m × " + fmtUpto(l, 2) + " m = " + fmtN(vol, 4) + " m³",
        "formula");
    } else {
      calcLine(resEl, r.label + ": — Werte eintragen", "error");
    }
  }

  if (anyValid){
    const dm3 = grandTotal * 1000;
    calcLine(resEl,
      "Summe = " + fmtN(grandTotal, 4) + " m³  (≙ " + fmtN(dm3, 2) + " dm³)",
      "subtotal");
  }

  clearChildren(totEl);
  totEl.appendChild(document.createTextNode(anyValid ? fmtN(grandTotal, 4) + " " : "— "));
  const u = document.createElement("span"); u.className = "unit"; u.textContent = "m³";
  totEl.appendChild(u);
}

// Wire timber inputs
for (const section of ["schwelle", "pfetten"]){
  const def = TIMBER_SECTIONS[section];
  for (const r of def.rows){
    for (const f of ["b", "h", "l"]){
      const el = getTimberInput(r.key, f);
      if (el) el.addEventListener("input", () => recomputeTimber(section));
    }
  }
  recomputeTimber(section);
}

// Generic EPD copy (data-epd-copy="2.5" etc.)
document.querySelectorAll("[data-epd-copy]").forEach(btn => {
  btn.addEventListener("click", () => {
    const code = btn.dataset.epdCopy;
    if (!navigator.clipboard){
      showToast(code + " (Kopieren nicht unterstützt)", "terra");
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = "✓ kopiert";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove("copied");
      }, 1500);
    }).catch(() => {
      showToast("Kopieren fehlgeschlagen", "terra");
    });
  });
});

// Brandschutz EPD copy (per group)
function wireBrandEpdCopy(group){
  $(group + "BrandEpdCopy").addEventListener("click", () => {
    const mat = steelState[group].brand.material;
    const code = BRAND_BOARDS[mat].qng.code;
    if (!navigator.clipboard){
      showToast(code + " (Kopieren nicht unterstützt)", "terra");
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      const btn = $(group + "BrandEpdCopy");
      btn.textContent = "✓ kopiert";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Kopieren";
        btn.classList.remove("copied");
      }, 1500);
    });
  });
}
wireBrandEpdCopy("stuetzen");
wireBrandEpdCopy("traeger");

// ════════════════════════════════════════════════════════════════════════════
// PWA — Service Worker, Install-Prompt, Offline-Status
// ════════════════════════════════════════════════════════════════════════════

if ("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(reg => {
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller){
            const banner = $("updateBanner");
            const btn = $("updateBtn");
            banner.classList.add("show");
            btn.onclick = () => {
              newWorker.postMessage({type: "SKIP_WAITING"});
              window.location.reload();
            };
          }
        });
      });
    }).catch(() => { /* SW registration failed — app still works */ });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

// Online/Offline status
const appStatusEl = $("appStatus");
const appStatusText = $("appStatusText");
function updateOnlineStatus(){
  if (navigator.onLine){
    appStatusEl.classList.remove("offline");
    appStatusText.textContent = "Online";
  } else {
    appStatusEl.classList.add("offline");
    appStatusText.textContent = "Offline · läuft trotzdem";
  }
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();

// Install prompt
let deferredPrompt = null;
const installBtn = $("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.add("show");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const {outcome} = await deferredPrompt.userChoice;
  if (outcome === "accepted"){
    installBtn.classList.remove("show");
  }
  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  installBtn.classList.remove("show");
  deferredPrompt = null;
  showToast("LACZY ist jetzt installiert", "sage");
});

const isStandalone = window.matchMedia("(display-mode: standalone)").matches
                  || window.navigator.standalone === true;
if (isStandalone){
  installBtn.style.display = "none";
}

// iOS hint (iOS doesn't fire beforeinstallprompt)
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
if (isIOS && !isStandalone){
  const dismissed = (() => { try { return localStorage.getItem("iosHintDismissed"); } catch(e){ return null; } })();
  if (!dismissed){
    const iosHint = $("iosHint");
    iosHint.classList.add("show");
    $("iosClose").addEventListener("click", () => {
      iosHint.classList.remove("show");
      try{ localStorage.setItem("iosHintDismissed", "1"); } catch(e){}
    });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// PROJECT REGISTRY — Projektkartei (Neubau + Sanierung)
// ════════════════════════════════════════════════════════════════════════════

// ─── State + Storage ────────────────────────────────────────────────
const PROJECT_STORAGE_KEY = "laczy_projects_v1";
const MAX_PROJECTS = 200;
const MAX_PROJECT_NAME_LEN = 120;
const MAX_PROJECT_TEXT_LEN = 500;
const MAX_PROJECT_FIELD_LEN = 60;
const MAX_GESCHOSSE = 20;
const MAX_DACHER = 12;
const MAX_MASSNAHMEN = 30;
const PROJECT_IMPORT_MAX_BYTES = 5 * 1024 * 1024;

const PROJECT_PATHS = new Set(["neubau", "sanierung"]);
const PROJECT_VORHABEN = new Set(["neubau", "anbau"]);
const PROJECT_GEBTYP = new Set(["efh", "mfh"]);
const PROJECT_FOERDER = new Set(["nein", "gewuenscht"]);

const DACH_TYPEN = [
  { key: "spitzdach", label: "Spitzdach" },
  { key: "pultdach", label: "Pultdach" },
  { key: "walmdach", label: "Walmdach" },
  { key: "gaubendach", label: "Gaubendach" },
  { key: "flachdach", label: "Flachdach" },
  { key: "sonstiges", label: "Sonstiges" }
];
const DACH_TYP_KEYS = new Set(DACH_TYPEN.map(d => d.key));

const PROJECT_SECTIONS = [
  { n: 1, key: "objekt",     title: "Objektdaten" },
  { n: 2, key: "masse",      title: "Maße" },
  { n: 3, key: "bauteile",   title: "Bauteile" },
  { n: 4, key: "heizung",    title: "Heizung & Warmwasser" },
  { n: 5, key: "verteil",    title: "Verteilsystem" },
  { n: 6, key: "lueftung",   title: "Lüftung" },
  { n: 7, key: "pv",         title: "PV-Anlage" },
  { n: 8, key: "huelle",     title: "Thermische Hülle" }
];

let projects = [];
let activeProjectId = null;
let currentSection = 1;

// ─── Default-Geschosse je Pfad ──────────────────────────────────────
function defaultGeschosse(){
  return [
    { key: "KG", value: "" },
    { key: "EG", value: "" },
    { key: "OG 1", value: "" },
    { key: "OG 2", value: "" },
    { key: "DG", value: "" }
  ];
}

function defaultDaecher(){
  return [
    { typ: "spitzdach",  kniestock: "", neigung: "", ueberstand: "" },
    { typ: "gaubendach", kniestock: "", neigung: "", ueberstand: "" }
  ];
}

// ─── Helpers ────────────────────────────────────────────────────────
function genProjectId(){
  return "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
function nowISO(){ return new Date().toISOString(); }

function sanitizeStr(v, maxLen){
  if (typeof v !== "string") return "";
  return v.slice(0, maxLen);
}

// Strikt: max length + nur ungefährliche Zeichen für Labels
function sanitizeLabel(v, maxLen){
  if (typeof v !== "string") return "";
  return v.replace(/[^\wÄÖÜäöüß \-./]/g, "").slice(0, maxLen);
}

function createBlankProject(name, path){
  return {
    id: genProjectId(),
    path: PROJECT_PATHS.has(path) ? path : "neubau",
    name: sanitizeStr(name, MAX_PROJECT_NAME_LEN).trim() || "Neues Projekt",
    createdAt: nowISO(),
    updatedAt: nowISO(),

    // Sektion 1 Objektdaten
    vorhaben: null,        // "neubau" | "anbau"  (nur Neubau-Pfad)
    gebTyp: null,          // "efh" | "mfh"
    adresse: "",
    foerder: null,         // "nein" | "gewuenscht"
    // Sanierung-spezifisch
    baujahr: "",
    energieausweisVorhanden: false,
    bisherigeMassnahmen: [],  // [{jahr, massnahme}]

    // Sektion 2 Maße
    grundrisseBemasst: false,
    geschosse: defaultGeschosse(),
    daecher: defaultDaecher(),

    // Sektionen 3-8 — Platzhalter-Objekte, werden in späteren Etappen befüllt
    bauteile: {},
    heizung: {},
    verteil: {},
    lueftung: {},
    pv: {},
    huelle: {}
  };
}

function sanitizeProject(raw){
  if (!raw || typeof raw !== "object") return null;
  const p = createBlankProject(raw.name, raw.path);
  // ID übernehmen falls valide, sonst neu
  if (typeof raw.id === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(raw.id)) p.id = raw.id;
  if (typeof raw.createdAt === "string") p.createdAt = sanitizeStr(raw.createdAt, 40);
  if (typeof raw.updatedAt === "string") p.updatedAt = sanitizeStr(raw.updatedAt, 40);

  if (PROJECT_VORHABEN.has(raw.vorhaben)) p.vorhaben = raw.vorhaben;
  if (PROJECT_GEBTYP.has(raw.gebTyp))     p.gebTyp   = raw.gebTyp;
  p.adresse = sanitizeStr(raw.adresse, MAX_PROJECT_TEXT_LEN);
  if (PROJECT_FOERDER.has(raw.foerder))   p.foerder  = raw.foerder;
  p.baujahr = sanitizeStr(raw.baujahr, MAX_PROJECT_FIELD_LEN);
  p.energieausweisVorhanden = !!raw.energieausweisVorhanden;
  if (Array.isArray(raw.bisherigeMassnahmen)){
    p.bisherigeMassnahmen = raw.bisherigeMassnahmen.slice(0, MAX_MASSNAHMEN).map(m => ({
      jahr:      sanitizeStr(m && m.jahr,      8),
      massnahme: sanitizeStr(m && m.massnahme, MAX_PROJECT_TEXT_LEN)
    }));
  }

  p.grundrisseBemasst = !!raw.grundrisseBemasst;
  if (Array.isArray(raw.geschosse)){
    p.geschosse = raw.geschosse.slice(0, MAX_GESCHOSSE).map(g => ({
      key:   sanitizeLabel(g && g.key, 12),
      value: sanitizeStr(g && g.value, 12)
    }));
  }
  if (Array.isArray(raw.daecher)){
    p.daecher = raw.daecher.slice(0, MAX_DACHER).map(d => ({
      typ:        DACH_TYP_KEYS.has(d && d.typ) ? d.typ : "spitzdach",
      kniestock:  sanitizeStr(d && d.kniestock, 12),
      neigung:    sanitizeStr(d && d.neigung,   12),
      ueberstand: sanitizeStr(d && d.ueberstand, 12)
    }));
  }

  // Sektionen 3-8 unverändert übernehmen, wenn Object — wird in späteren
  // Etappen tiefer sanitisiert sobald wir die Schemata haben.
  if (raw.bauteile && typeof raw.bauteile === "object") p.bauteile = raw.bauteile;
  if (raw.heizung  && typeof raw.heizung  === "object") p.heizung  = raw.heizung;
  if (raw.verteil  && typeof raw.verteil  === "object") p.verteil  = raw.verteil;
  if (raw.lueftung && typeof raw.lueftung === "object") p.lueftung = raw.lueftung;
  if (raw.pv       && typeof raw.pv       === "object") p.pv       = raw.pv;
  if (raw.huelle   && typeof raw.huelle   === "object") p.huelle   = raw.huelle;

  // Tiefe Sanitisierung der Bauteile (Sektion 3)
  if (typeof sanitizeBauteile === "function") sanitizeBauteile(p);

  // Tiefe Sanitisierung der Anlagensektionen (4-8)
  if (typeof sanitizeSection4 === "function") p.heizung  = sanitizeSection4(p.heizung);
  if (typeof sanitizeSection5 === "function") p.verteil  = sanitizeSection5(p.verteil);
  if (typeof sanitizeSection6 === "function") p.lueftung = sanitizeSection6(p.lueftung);
  if (typeof sanitizeSection7 === "function") p.pv       = sanitizeSection7(p.pv);
  if (typeof sanitizeSection8 === "function") p.huelle   = sanitizeSection8(p.huelle);

  return p;
}

function loadProjects(){
  try{
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) { projects = []; return; }
    if (raw.length > PROJECT_IMPORT_MAX_BYTES) { projects = []; return; }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) { projects = []; return; }
    const seen = new Set();
    projects = [];
    for (const item of parsed){
      const s = sanitizeProject(item);
      if (!s) continue;
      if (seen.has(s.id)) s.id = genProjectId();
      seen.add(s.id);
      projects.push(s);
      if (projects.length >= MAX_PROJECTS) break;
    }
  } catch(e){
    projects = [];
  }
}

function saveProjects(){
  try{
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  } catch(e){
    showToast("Speicher voll — bitte alte Projekte löschen", "warn");
  }
}

function findProject(id){
  return projects.find(p => p.id === id) || null;
}

function touchActive(){
  const p = findProject(activeProjectId);
  if (!p) return;
  p.updatedAt = nowISO();
  saveProjects();
}

// Fortschritt — wie viele Sektionen haben Daten
function sectionHasData(p, sectionKey){
  if (!p) return false;
  switch(sectionKey){
    case "objekt":
      if (p.path === "sanierung"){
        return !!(p.adresse || p.foerder || p.gebTyp || p.baujahr ||
                  p.energieausweisVorhanden || (p.bisherigeMassnahmen && p.bisherigeMassnahmen.length));
      }
      return !!(p.vorhaben || p.gebTyp || p.adresse || p.foerder);
    case "masse":
      if (p.grundrisseBemasst) return true;
      if (p.geschosse && p.geschosse.some(g => g.value && g.value.trim())) return true;
      if (p.daecher && p.daecher.some(d => d.kniestock || d.neigung || d.ueberstand)) return true;
      return false;
    case "bauteile":
      return sectionHasDataBauteile(p);
    case "heizung":
      return sectionHasDataHeizung(p);
    case "verteil":
      return sectionHasDataVerteil(p);
    case "lueftung":
      return sectionHasDataLueftung(p);
    case "pv":
      return sectionHasDataPv(p);
    case "huelle":
      return sectionHasDataHuelle(p);
    default:
      return false;  // Sektionen 3-8 noch nicht implementiert
  }
}

function progressOf(p){
  if (!p) return 0;
  let c = 0;
  for (const s of PROJECT_SECTIONS){
    if (sectionHasData(p, s.key)) c++;
  }
  return c;
}

function formatProjectDate(iso){
  if (!iso) return "—";
  try{
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
  } catch(e){ return "—"; }
}

// ─── DOM-Refs ───────────────────────────────────────────────────────
const projektOverview   = $("projektOverview");
const projektWizard     = $("projektWizard");
const projektListEl     = $("projektList");
const projektNewBtn     = $("projektNewBtn");
const projektBackupBtn  = $("projektBackupBtn");

const projektNewModal   = $("projektNewModal");
const projektNewName    = $("projektNewName");
const projektNewSave    = $("projektNewSave");
const projektNewError   = $("projektNewError");
const projektNewPathPills = $("projektNewPathPills");
let   projektNewPath    = "neubau";

const projektBackupModal = $("projektBackupModal");
const projektBackupCount = $("projektBackupCount");
const projektExportBtn   = $("projektExportBtn");
const projektImportBtn   = $("projektImportBtn");
const projektImportFile  = $("projektImportFile");
const projektWipeBtn     = $("projektWipeBtn");

const wizardBackBtn     = $("wizardBack");
const wizardPrevBtn     = $("wizardPrev");
const wizardNextBtn     = $("wizardNext");
const wizardProgressEl  = $("wizardProgress");
const sectionJumpEl     = $("sectionJump");
const wizardStepLabel   = $("wizardStepLabel");
const wizardStepTitle   = $("wizardStepTitle");
const wizardProjectName = $("wizardProjectName");
const wizardContainer   = $("wizardSectionContainer");

// ─── Projektliste rendern (Übersicht) ───────────────────────────────
function renderProjectList(){
  clearChildren(projektListEl);

  if (!projects.length){
    const empty = document.createElement("div");
    empty.className = "project-empty";
    const t = document.createElement("div");
    t.className = "em-title";
    t.textContent = "Noch keine Projekte angelegt";
    const txt = document.createElement("div");
    txt.textContent = "Tipp den Knopf oben, um dein erstes Bauvorhaben zu erfassen.";
    empty.append(t, txt);
    projektListEl.append(empty);
    return;
  }

  // Nach updatedAt absteigend sortieren
  const sorted = projects.slice().sort((a, b) =>
    (b.updatedAt || "").localeCompare(a.updatedAt || ""));

  for (const p of sorted){
    const item = document.createElement("button");
    item.className = "project-item";
    item.type = "button";
    item.setAttribute("data-project-id", p.id);

    const body = document.createElement("div");
    body.className = "pi-body";
    const title = document.createElement("div");
    title.className = "pi-title";
    title.textContent = p.name;
    const meta = document.createElement("div");
    meta.className = "pi-meta";
    const pathLabel = p.path === "sanierung" ? "Sanierung" : "Neubau";
    const gebTyp    = p.gebTyp ? p.gebTyp.toUpperCase() : null;
    const prog      = progressOf(p);
    const parts = [pathLabel];
    if (gebTyp) parts.push(gebTyp);
    parts.push(prog + " / " + PROJECT_SECTIONS.length + " Sektionen");
    parts.push("zuletzt " + formatProjectDate(p.updatedAt));
    meta.textContent = parts.join(" · ");
    body.append(title, meta);

    const badge = document.createElement("span");
    if (prog === 0){
      badge.className = "pi-badge empty";
      badge.textContent = "leer";
    } else if (prog === PROJECT_SECTIONS.length){
      badge.className = "pi-badge full";
      badge.textContent = "vollständig";
    } else {
      badge.className = "pi-badge wip";
      badge.textContent = "in Arbeit";
    }

    const arrow = document.createElement("span");
    arrow.className = "pi-arrow";
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "9 18 15 12 9 6");
    svg.append(poly);
    arrow.append(svg);

    // PDF-Export-Button (eigenes span, damit der Klick darauf den Card-Click verschluckt)
    const pdfBtn = document.createElement("span");
    pdfBtn.className = "pi-arrow";
    pdfBtn.title = "Als PDF ausgeben";
    pdfBtn.setAttribute("role", "button");
    pdfBtn.setAttribute("tabindex", "0");
    pdfBtn.style.cursor = "pointer";
    const psvg = document.createElementNS(svgNS, "svg");
    psvg.setAttribute("viewBox", "0 0 24 24");
    psvg.setAttribute("fill", "none");
    psvg.setAttribute("stroke", "currentColor");
    psvg.setAttribute("stroke-width", "2");
    psvg.setAttribute("stroke-linecap", "round");
    psvg.setAttribute("stroke-linejoin", "round");
    const pPath = document.createElementNS(svgNS, "path");
    pPath.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    const pPoly = document.createElementNS(svgNS, "polyline");
    pPoly.setAttribute("points", "7 10 12 15 17 10");
    const pLine = document.createElementNS(svgNS, "line");
    pLine.setAttribute("x1", "12"); pLine.setAttribute("y1", "15");
    pLine.setAttribute("x2", "12"); pLine.setAttribute("y2", "3");
    psvg.append(pPath, pPoly, pLine);
    pdfBtn.append(psvg);
    pdfBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (typeof exportProjectAsPdf === "function"){
        exportProjectAsPdf(p.id);
      }
    });

    item.append(body, badge, pdfBtn, arrow);
    item.addEventListener("click", () => enterWizard(p.id));
    projektListEl.append(item);
  }
}

// ─── Neues-Projekt-Modal ────────────────────────────────────────────
function openNewProjectModal(){
  projektNewName.value = "";
  projektNewPath = "neubau";
  updatePathPills();
  projektNewError.textContent = "";
  projektNewError.hidden = true;
  projektNewModal.setAttribute("aria-hidden", "false");
  projektNewModal.classList.add("open");
  setTimeout(() => projektNewName.focus(), 50);
}
function closeNewProjectModal(){
  projektNewModal.setAttribute("aria-hidden", "true");
  projektNewModal.classList.remove("open");
}
function updatePathPills(){
  const pills = projektNewPathPills.querySelectorAll("[data-pn-path]");
  pills.forEach(b => {
    if (b.getAttribute("data-pn-path") === projektNewPath){
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });
}
function saveNewProject(){
  const name = (projektNewName.value || "").trim();
  if (!name){
    projektNewError.textContent = "Bitte einen Namen vergeben.";
    projektNewError.hidden = false;
    return;
  }
  if (projects.length >= MAX_PROJECTS){
    projektNewError.textContent = "Maximale Anzahl Projekte erreicht (" + MAX_PROJECTS + ").";
    projektNewError.hidden = false;
    return;
  }
  const p = createBlankProject(name, projektNewPath);
  projects.push(p);
  saveProjects();
  closeNewProjectModal();
  showToast("Projekt angelegt", "sage");
  enterWizard(p.id);
}

// ─── Wizard-Shell ───────────────────────────────────────────────────
function enterWizard(id){
  const p = findProject(id);
  if (!p) return;
  activeProjectId = id;
  currentSection = 1;
  projektOverview.hidden = true;
  projektWizard.hidden = false;
  wizardProjectName.textContent = p.name;
  renderWizardChrome();
  renderSection(1);
  // Smooth scroll to top of wizard
  try { projektWizard.scrollIntoView({ behavior: "smooth", block: "start" }); } catch(e){}
}

function exitWizard(){
  // Auto-Save passiert ohnehin bei jeder Änderung; hier nur UI-Wechsel
  activeProjectId = null;
  projektWizard.hidden = true;
  projektOverview.hidden = false;
  renderProjectList();
}

function renderWizardChrome(){
  const p = findProject(activeProjectId);
  if (!p) return;

  // Progress-Bar mit 8 Segmenten
  clearChildren(wizardProgressEl);
  for (const s of PROJECT_SECTIONS){
    const seg = document.createElement("button");
    seg.type = "button";
    seg.className = "seg";
    if (s.n === currentSection) seg.classList.add("active");
    else if (sectionHasData(p, s.key)) seg.classList.add("done");
    seg.setAttribute("aria-label", "Sektion " + s.n + " " + s.title);
    seg.addEventListener("click", () => { currentSection = s.n; renderWizardChrome(); renderSection(s.n); });
    wizardProgressEl.append(seg);
  }

  // Section-Jump als Quick-Nav
  clearChildren(sectionJumpEl);
  for (const s of PROJECT_SECTIONS){
    const sj = document.createElement("button");
    sj.type = "button";
    sj.className = "sj";
    if (s.n === currentSection) sj.classList.add("active");
    else if (sectionHasData(p, s.key)) sj.classList.add("done");
    sj.textContent = s.n + ". " + s.title;
    sj.addEventListener("click", () => { currentSection = s.n; renderWizardChrome(); renderSection(s.n); });
    sectionJumpEl.append(sj);
  }

  wizardStepLabel.textContent = "Schritt " + currentSection + " von " + PROJECT_SECTIONS.length;
  const sec = PROJECT_SECTIONS.find(s => s.n === currentSection);
  wizardStepTitle.textContent = sec ? sec.title : "";

  // Buttons: Zurück deaktivieren bei 1, Weiter / Abschließen bei 8
  wizardPrevBtn.disabled = (currentSection === 1);
  wizardPrevBtn.style.opacity = wizardPrevBtn.disabled ? "0.4" : "1";

  // Bei Sektion 8: Knopf wird zu "Daten ausgeben"
  if (currentSection === PROJECT_SECTIONS.length){
    wizardNextBtn.classList.add("btn-export");
    wizardNextBtn.classList.remove("btn-primary");
    clearChildren(wizardNextBtn);
    wizardNextBtn.append(document.createTextNode("Daten ausgeben"));
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path1 = document.createElementNS(svgNS, "path");
    path1.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "7 10 12 15 17 10");
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", "12"); line.setAttribute("y1", "15");
    line.setAttribute("x2", "12"); line.setAttribute("y2", "3");
    svg.append(path1, poly, line);
    wizardNextBtn.append(svg);
  } else {
    wizardNextBtn.classList.remove("btn-export");
    wizardNextBtn.classList.add("btn-primary");
    clearChildren(wizardNextBtn);
    wizardNextBtn.append(document.createTextNode("Weiter"));
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "9 18 15 12 9 6");
    svg.append(poly);
    wizardNextBtn.append(svg);
  }
}

function wizardNext(){
  const p = findProject(activeProjectId);
  if (!p) return;
  if (currentSection === PROJECT_SECTIONS.length){
    // PDF-Export — kommt in späterer Etappe
    showToast("PDF-Ausgabe kommt in einer der nächsten Etappen", "warn");
    return;
  }
  currentSection++;
  renderWizardChrome();
  renderSection(currentSection);
}
function wizardPrev(){
  if (currentSection <= 1) return;
  currentSection--;
  renderWizardChrome();
  renderSection(currentSection);
}

// Universelle Section-Renderer-Dispatch
function renderSection(n){
  const p = findProject(activeProjectId);
  if (!p){ clearChildren(wizardContainer); return; }
  clearChildren(wizardContainer);

  switch(n){
    case 1: renderSection1(p); break;
    case 2: renderSection2(p); break;
    case 3: renderSection3(p); break;
    case 4: renderSection4(p); break;
    case 5: renderSection5(p); break;
    case 6: renderSection6(p); break;
    case 7: renderSection7(p); break;
    case 8: renderSection8(p); break;
    default: renderSectionPlaceholder(n); break;
  }
}

// ─── Sektion 1: Objektdaten ─────────────────────────────────────────
function renderSection1(p){
  clearChildren(wizardContainer);
  // Vorhaben — nur für Neubau-Pfad
  if (p.path === "neubau"){
    const c1 = makeStepCard("Vorhaben");
    const pills = pillRow(["neubau", "anbau"], ["Neubau", "Anbau / Aufstockung"], p.vorhaben, (val) => {
      p.vorhaben = (p.vorhaben === val) ? null : val;
      touchActive();
      renderSection1(p);
      renderWizardChrome();
    });
    c1.append(pills);
    wizardContainer.append(c1);
  } else {
    // Sanierung-spezifisch: Baujahr + Energieausweis
    const c1 = makeStepCard("Baujahr Bestand");
    const inp = document.createElement("input");
    inp.type = "text"; inp.className = "wiz-input mono"; inp.maxLength = 8;
    inp.placeholder = "z.B. 1962";
    inp.value = p.baujahr || "";
    inp.addEventListener("input", () => {
      p.baujahr = sanitizeStr(inp.value, MAX_PROJECT_FIELD_LEN);
      touchActive();
      renderWizardChrome();
    });
    c1.append(inp);
    wizardContainer.append(c1);

    const c2 = makeStepCard("Energieausweis vorhanden");
    const checkRow = makeCheckboxRow(p.energieausweisVorhanden, "Aktueller Energieausweis liegt vor", (v) => {
      p.energieausweisVorhanden = v;
      touchActive();
      renderWizardChrome();
    });
    c2.append(checkRow);
    wizardContainer.append(c2);

    // Bisherige Maßnahmen — Liste
    const c3 = makeStepCard("Bisherige Sanierungsmaßnahmen", "optional · Jahr + Maßnahme");
    const list = document.createElement("div");
    list.className = "geschoss-list";
    p.bisherigeMassnahmen = p.bisherigeMassnahmen || [];
    p.bisherigeMassnahmen.forEach((m, idx) => {
      const row = document.createElement("div");
      row.className = "geschoss-row";
      row.style.gridTemplateColumns = "70px 1fr 28px";
      const yIn = document.createElement("input");
      yIn.type = "text"; yIn.className = "wiz-input mono"; yIn.maxLength = 8;
      yIn.placeholder = "Jahr"; yIn.value = m.jahr || "";
      yIn.addEventListener("input", () => { m.jahr = sanitizeStr(yIn.value, 8); touchActive(); });
      const tIn = document.createElement("input");
      tIn.type = "text"; tIn.className = "wiz-input"; tIn.maxLength = MAX_PROJECT_TEXT_LEN;
      tIn.placeholder = "z.B. neue Heizung"; tIn.value = m.massnahme || "";
      tIn.addEventListener("input", () => { m.massnahme = sanitizeStr(tIn.value, MAX_PROJECT_TEXT_LEN); touchActive(); });
      const xBtn = makeXButton(() => {
        p.bisherigeMassnahmen.splice(idx, 1);
        touchActive();
        renderSection1(p);
      });
      row.append(yIn, tIn, xBtn);
      list.append(row);
    });
    c3.append(list);
    const addBtn = makeAddButton("Maßnahme hinzufügen", () => {
      if (p.bisherigeMassnahmen.length >= MAX_MASSNAHMEN){
        showToast("Maximale Anzahl erreicht", "warn");
        return;
      }
      p.bisherigeMassnahmen.push({ jahr: "", massnahme: "" });
      touchActive();
      renderSection1(p);
    });
    c3.append(addBtn);
    wizardContainer.append(c3);
  }

  // Gebäudetyp (beide Pfade)
  const cG = makeStepCard("Gebäudetyp", "steuert die Standard-Aufbauten ab Sektion 3");
  const pGT = pillRow(["efh", "mfh"], ["EFH", "MFH"], p.gebTyp, (val) => {
    p.gebTyp = (p.gebTyp === val) ? null : val;
    touchActive();
    renderSection1(p);
    renderWizardChrome();
  }, "active-sage");
  cG.append(pGT);
  wizardContainer.append(cG);

  // Adresse
  const cA = makeStepCard("Adresse");
  const ta = document.createElement("textarea");
  ta.className = "wiz-input"; ta.rows = 2; ta.maxLength = MAX_PROJECT_TEXT_LEN;
  ta.placeholder = "Straße, Hausnr.\nPLZ Ort";
  ta.value = p.adresse || "";
  ta.addEventListener("input", () => {
    p.adresse = sanitizeStr(ta.value, MAX_PROJECT_TEXT_LEN);
    touchActive();
  });
  cA.append(ta);
  wizardContainer.append(cA);

  // Fördergelder
  const cF = makeStepCard("Fördergelder");
  const pF = pillRow(["nein", "gewuenscht"], ["nicht erforderlich", "gewünscht"], p.foerder, (val) => {
    p.foerder = (p.foerder === val) ? null : val;
    touchActive();
    renderSection1(p);
    renderWizardChrome();
  });
  cF.append(pF);
  wizardContainer.append(cF);
}

// ─── Sektion 2: Maße ────────────────────────────────────────────────
function renderSection2(p){
  clearChildren(wizardContainer);
  // Grundrisse-Check
  const cChk = makeStepCard("");
  // Wir nutzen die ganze Karte als Checkbox-Row, deshalb step-card-label leer + minimaler padding
  cChk.querySelector(".step-card-label").remove();
  const chkRow = makeCheckboxRow(p.grundrisseBemasst, "Grundrisse ausreichend bemaßt", (v) => {
    p.grundrisseBemasst = v;
    touchActive();
    renderWizardChrome();
  });
  cChk.append(chkRow);
  wizardContainer.append(cChk);

  // Lichte Raumhöhe — Geschoss-Liste
  const cG = makeStepCard("Lichte Raumhöhe", "OK FFB – UK Decke · in m");
  const list = document.createElement("div");
  list.className = "geschoss-list";
  p.geschosse = p.geschosse || [];
  p.geschosse.forEach((g, idx) => {
    const row = document.createElement("div");
    row.className = "geschoss-row";
    // Label-Input
    const lIn = document.createElement("input");
    lIn.type = "text"; lIn.className = "wiz-input mono";
    lIn.maxLength = 12;
    lIn.value = g.key || "";
    lIn.addEventListener("input", () => { g.key = sanitizeLabel(lIn.value, 12); touchActive(); renderWizardChrome(); });
    // Wert-Input
    const vIn = document.createElement("input");
    vIn.type = "text"; vIn.className = "wiz-input mono";
    vIn.maxLength = 12;
    vIn.placeholder = "z.B. 2,50";
    vIn.value = g.value || "";
    vIn.addEventListener("input", () => { g.value = sanitizeStr(vIn.value, 12); touchActive(); renderWizardChrome(); });
    // Einheit
    const sfx = document.createElement("span");
    sfx.className = "g-suffix"; sfx.textContent = "m";
    // X-Button
    const xBtn = makeXButton(() => {
      p.geschosse.splice(idx, 1);
      touchActive();
      renderSection2(p);
      renderWizardChrome();
    });
    row.append(lIn, vIn, sfx, xBtn);
    list.append(row);
  });
  cG.append(list);
  const addG = makeAddButton("Geschoss hinzufügen", () => {
    if (p.geschosse.length >= MAX_GESCHOSSE){
      showToast("Maximale Anzahl Geschosse erreicht", "warn");
      return;
    }
    p.geschosse.push({ key: "", value: "" });
    touchActive();
    renderSection2(p);
  });
  cG.append(addG);
  wizardContainer.append(cG);

  // Dächer + Kniestock
  const cD = makeStepCard("Dächer", "Typ wählen, dann Kniestock · Neigung · Überstand");
  const dList = document.createElement("div");
  dList.className = "dach-list";
  p.daecher = p.daecher || [];
  p.daecher.forEach((d, idx) => {
    const row = document.createElement("div");
    row.className = "dach-row";
    // Head: Type-Select + Remove
    const head = document.createElement("div");
    head.className = "dach-row-head";
    const sel = document.createElement("select");
    sel.className = "wiz-input";
    for (const t of DACH_TYPEN){
      const opt = document.createElement("option");
      opt.value = t.key; opt.textContent = t.label;
      if (d.typ === t.key) opt.selected = true;
      sel.append(opt);
    }
    sel.addEventListener("change", () => {
      d.typ = DACH_TYP_KEYS.has(sel.value) ? sel.value : "spitzdach";
      touchActive();
      renderWizardChrome();
    });
    const xBtn = makeXButton(() => {
      p.daecher.splice(idx, 1);
      touchActive();
      renderSection2(p);
      renderWizardChrome();
    });
    head.append(sel, xBtn);
    row.append(head);
    // Fields: Kniestock | Neigung | Überstand
    const fields = document.createElement("div");
    fields.className = "dach-fields";
    fields.append(
      makeFieldCol("Kniestock", "cm", d.kniestock, (v) => { d.kniestock = sanitizeStr(v, 12); touchActive(); renderWizardChrome(); }),
      makeFieldCol("Neigung",   "°",  d.neigung,   (v) => { d.neigung   = sanitizeStr(v, 12); touchActive(); renderWizardChrome(); }),
      makeFieldCol("Überstand", "cm", d.ueberstand,(v) => { d.ueberstand= sanitizeStr(v, 12); touchActive(); renderWizardChrome(); })
    );
    row.append(fields);
    dList.append(row);
  });
  cD.append(dList);
  const addD = makeAddButton("Dach hinzufügen", () => {
    if (p.daecher.length >= MAX_DACHER){
      showToast("Maximale Anzahl Dächer erreicht", "warn");
      return;
    }
    p.daecher.push({ typ: "spitzdach", kniestock: "", neigung: "", ueberstand: "" });
    touchActive();
    renderSection2(p);
  });
  cD.append(addD);
  wizardContainer.append(cD);
}

// ─── Platzhalter Sektionen 3-8 ──────────────────────────────────────
function renderSectionPlaceholder(n){
  const sec = PROJECT_SECTIONS.find(s => s.n === n);
  if (!sec) return;
  const ph = document.createElement("div");
  ph.className = "placeholder-step";
  const icon = document.createElement("div");
  icon.className = "ps-icon";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const c = document.createElementNS(svgNS, "circle");
  c.setAttribute("cx", "12"); c.setAttribute("cy", "12"); c.setAttribute("r", "9");
  const l1 = document.createElementNS(svgNS, "line");
  l1.setAttribute("x1", "12"); l1.setAttribute("y1", "8");
  l1.setAttribute("x2", "12"); l1.setAttribute("y2", "12");
  const l2 = document.createElementNS(svgNS, "line");
  l2.setAttribute("x1", "12"); l2.setAttribute("y1", "16");
  l2.setAttribute("x2", "12.01"); l2.setAttribute("y2", "16");
  svg.append(c, l1, l2);
  icon.append(svg);

  const title = document.createElement("div");
  title.className = "ps-title";
  title.textContent = "Sektion " + n + " kommt in einer der nächsten Etappen";
  const txt = document.createElement("div");
  txt.className = "ps-text";
  txt.textContent = "Diese Sektion (" + sec.title + ") wird im nächsten Schritt implementiert. Die Navigation und das Speichern funktionieren schon — du kannst weiterklicken, ohne dass etwas verloren geht.";
  ph.append(icon, title, txt);
  wizardContainer.append(ph);
}

// ─── DOM-Bau-Helper ─────────────────────────────────────────────────
function makeStepCard(label, hint){
  const card = document.createElement("div");
  card.className = "step-card";
  const lab = document.createElement("div");
  lab.className = "step-card-label";
  lab.textContent = label || "";
  if (hint){
    const h = document.createElement("span");
    h.className = "step-card-hint";
    h.textContent = "· " + hint;
    lab.append(" ", h);
  }
  card.append(lab);
  return card;
}

function pillRow(values, labels, currentVal, onClick, activeCls){
  const wrap = document.createElement("div");
  wrap.className = "option-pills";
  values.forEach((v, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-pill";
    if (v === currentVal) btn.classList.add(activeCls || "active");
    btn.textContent = labels[i];
    btn.addEventListener("click", () => onClick(v));
    wrap.append(btn);
  });
  return wrap;
}

function makeCheckboxRow(checked, label, onChange){
  const row = document.createElement("button");
  row.type = "button";
  row.className = "checkbox-row";
  if (checked) row.classList.add("checked");
  const box = document.createElement("span");
  box.className = "box";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const poly = document.createElementNS(svgNS, "polyline");
  poly.setAttribute("points", "5 12 10 17 19 7");
  svg.append(poly);
  box.append(svg);
  const lab = document.createElement("span");
  lab.className = "label";
  lab.textContent = label;
  row.append(box, lab);
  row.addEventListener("click", () => {
    const newVal = !row.classList.contains("checked");
    if (newVal) row.classList.add("checked"); else row.classList.remove("checked");
    onChange(newVal);
  });
  return row;
}

function makeXButton(onClick){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "x-btn";
  btn.setAttribute("aria-label", "Zeile entfernen");
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const l1 = document.createElementNS(svgNS, "line");
  l1.setAttribute("x1", "18"); l1.setAttribute("y1", "6");
  l1.setAttribute("x2", "6");  l1.setAttribute("y2", "18");
  const l2 = document.createElementNS(svgNS, "line");
  l2.setAttribute("x1", "6");  l2.setAttribute("y1", "6");
  l2.setAttribute("x2", "18"); l2.setAttribute("y2", "18");
  svg.append(l1, l2);
  btn.append(svg);
  btn.addEventListener("click", onClick);
  return btn;
}

function makeAddButton(text, onClick){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "add-row-btn";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const l1 = document.createElementNS(svgNS, "line");
  l1.setAttribute("x1", "12"); l1.setAttribute("y1", "5");
  l1.setAttribute("x2", "12"); l1.setAttribute("y2", "19");
  const l2 = document.createElementNS(svgNS, "line");
  l2.setAttribute("x1", "5");  l2.setAttribute("y1", "12");
  l2.setAttribute("x2", "19"); l2.setAttribute("y2", "12");
  svg.append(l1, l2);
  btn.append(svg, document.createTextNode(text));
  btn.addEventListener("click", onClick);
  return btn;
}

function makeFieldCol(label, suffix, value, onInput){
  const col = document.createElement("div");
  col.className = "f-col";
  const lab = document.createElement("span");
  lab.className = "f-label";
  lab.textContent = suffix ? (label + " · " + suffix) : label;
  const inp = document.createElement("input");
  inp.type = "text";
  inp.className = "wiz-input mono";
  inp.maxLength = 12;
  inp.value = value || "";
  inp.addEventListener("input", () => onInput(inp.value));
  col.append(lab, inp);
  return col;
}

// ─── Backup-Modal ───────────────────────────────────────────────────
function openProjektBackupModal(){
  projektBackupCount.textContent = projects.length;
  projektBackupModal.setAttribute("aria-hidden", "false");
  projektBackupModal.classList.add("open");
}
function closeProjektBackupModal(){
  projektBackupModal.setAttribute("aria-hidden", "true");
  projektBackupModal.classList.remove("open");
}

function exportProjects(){
  const blob = new Blob([JSON.stringify({
    version: "laczy-projects-1",
    exportedAt: nowISO(),
    count: projects.length,
    projects: projects
  }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ts = new Date().toISOString().slice(0, 10);
  a.download = "laczy-projekte-" + ts + ".json";
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Export erstellt", "sage");
}

function importProjects(file){
  if (!file) return;
  if (file.size > PROJECT_IMPORT_MAX_BYTES){
    showToast("Datei zu groß (max. 5 MB)", "warn");
    return;
  }
  const ok = file.type === "application/json" || /\.json$/i.test(file.name);
  if (!ok){
    showToast("Bitte eine .json-Datei wählen", "warn");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const text = String(reader.result || "");
      if (text.length > PROJECT_IMPORT_MAX_BYTES){
        showToast("Datei zu groß (max. 5 MB)", "warn");
        return;
      }
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : (Array.isArray(data && data.projects) ? data.projects : null);
      if (!arr){
        showToast("Format nicht erkannt", "warn");
        return;
      }
      if (!confirm("Bestehende Projektkartei wird ersetzt. Fortfahren?")) return;
      const out = [];
      const seen = new Set();
      for (const item of arr){
        const s = sanitizeProject(item);
        if (!s) continue;
        if (seen.has(s.id)) s.id = genProjectId();
        seen.add(s.id);
        out.push(s);
        if (out.length >= MAX_PROJECTS) break;
      }
      projects = out;
      saveProjects();
      projektBackupCount.textContent = projects.length;
      renderProjectList();
      showToast("Import erfolgreich · " + projects.length + " Projekte", "sage");
    } catch(e){
      showToast("Ungültige JSON-Datei", "warn");
    }
  };
  reader.onerror = () => showToast("Datei konnte nicht gelesen werden", "warn");
  reader.readAsText(file);
}

function wipeProjects(){
  if (!projects.length){
    showToast("Es gibt keine Projekte zum Löschen", "warn");
    return;
  }
  if (!confirm("Wirklich alle " + projects.length + " Projekte löschen? Das kann nicht rückgängig gemacht werden.")) return;
  projects = [];
  saveProjects();
  projektBackupCount.textContent = "0";
  renderProjectList();
  showToast("Alle Projekte gelöscht", "warn");
}

// ─── Wire-up ────────────────────────────────────────────────────────
loadProjects();
renderProjectList();

// Home-Karte → Screen
const projektCard = document.querySelector('[data-tool="projekt"]');
if (projektCard){
  projektCard.addEventListener("click", () => {
    // Aus laufendem Wizard zurück zur Übersicht, dann zum Screen
    activeProjectId = null;
    projektWizard.hidden = true;
    projektOverview.hidden = false;
    renderProjectList();
    navigateTo("projekt");
  });
}

projektNewBtn.addEventListener("click", openNewProjectModal);
projektBackupBtn.addEventListener("click", openProjektBackupModal);

// Pfad-Pills im Modal
projektNewPathPills.querySelectorAll("[data-pn-path]").forEach(b => {
  b.addEventListener("click", () => {
    projektNewPath = b.getAttribute("data-pn-path");
    updatePathPills();
  });
});
projektNewSave.addEventListener("click", saveNewProject);
projektNewName.addEventListener("keydown", (e) => {
  if (e.key === "Enter"){ e.preventDefault(); saveNewProject(); }
});
projektNewModal.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeNewProjectModal);
});

// Wizard-Navigation
wizardBackBtn.addEventListener("click", exitWizard);
wizardPrevBtn.addEventListener("click", wizardPrev);
wizardNextBtn.addEventListener("click", wizardNext);

// Backup-Modal-Buttons
projektExportBtn.addEventListener("click", exportProjects);
projektImportBtn.addEventListener("click", () => projektImportFile.click());
projektImportFile.addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0];
  importProjects(f);
  projektImportFile.value = "";  // erlaubt erneutes Auswählen derselben Datei
});
projektWipeBtn.addEventListener("click", wipeProjects);
projektBackupModal.querySelectorAll("[data-close]").forEach(el => {
  el.addEventListener("click", closeProjektBackupModal);
});

// ESC schließt offene Projekt-Modals
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (projektNewModal.classList.contains("open")) closeNewProjectModal();
  if (projektBackupModal.classList.contains("open")) closeProjektBackupModal();
});


// ════════════════════════════════════════════════════════════════════════════
// SEKTION 3 — BAUTEILE (Neubau)
// ════════════════════════════════════════════════════════════════════════════
// Datenmodell:
//   p.bauteile = {
//     "3.1":  { variant: "perimeter"|"misapor"|null, schichten: {key: thk_mm}, notiz: "" }
//     "3.2":  { perGeschoss: { "<geschossKey>": {variant, schichten, notiz} } }
//     "3.3":  { aktiv: bool, daemmung_mm: "", notiz: "" }
//     "3.4":  { perGeschoss: { "<geschossKey>": {variant, schichten, notiz} } }
//   }
// Standards sind nur Default-Werte — der Nutzer überschreibt die Schichtdicken.

const BAUTEIL_CATALOG = {
  "3.1": {
    title: "Bodenplatte",
    type: "single",  // ein Aufbau global
    variants: [
      {
        key: "perimeter",
        tag: "Standard",
        title: "Perimeterdämmung",
        schichten: [
          { key: "beton",     name: "Stahlbeton",       def: 220, editable: true },
          { key: "perimeter", name: "Perimeterdämmung", def: 180, editable: true }
        ]
      },
      {
        key: "misapor",
        tag: "Alternative",
        title: "Misapor 10/75",
        schichten: [
          { key: "beton",   name: "Stahlbeton", def: 220, editable: true },
          { key: "misapor", name: "Misapor 10/75", def: 300, editable: true }
        ]
      }
    ]
  },

  "3.2": {
    title: "Geschossdecken",
    type: "perGeschoss",  // eine Auswahl pro Geschosswechsel
    variants: [
      {
        key: "stahlbeton",
        tag: "Standard",
        title: "Stahlbetondecke",
        schichten: [{ key: "beton", name: "Stahlbeton", def: 200, editable: true }]
      },
      {
        key: "brettsperrholz",
        tag: "Holzmassiv",
        title: "Brettsperrholzdecke",
        schichten: [{ key: "bsp", name: "Brettsperrholz", def: 160, editable: true }]
      },
      {
        key: "holzbalken",
        tag: "Holzbau",
        title: "Holzbalkendecke",
        schichten: [
          { key: "balken", name: "Holzbalken", def: 240, editable: true }
        ]
      },
      {
        key: "lignotrend",
        tag: "Holzmassiv",
        title: "Lignotrenddecke",
        schichten: [
          { key: "lignotrend", name: "Lignotrend", def: 200, editable: true }
        ]
      }
    ]
  },

  "3.3": {
    title: "Boden gg. unbeheizt",
    type: "simple",  // Häkchen + ein Stärke-Feld + Notiz
    standardLabel: "TG-Decke: Isover topdec dp3 · WLG 035",
    schichtName: "Dämmung Kaltseite"
  },

  "3.4": {
    title: "Fußbodenaufbau",
    type: "perGeschoss",
    variants: [
      {
        key: "efh",
        tag: "EFH-Standard",
        title: "Standard 150 mm",
        schichten: [
          { key: "belag",      name: "Bodenbelag",       def: 15, editable: true },
          { key: "estrich",    name: "Estrich",           def: 65, editable: true },
          { key: "trittschall",name: "Trittschall / FBH", def: 30, editable: true },
          { key: "daemmung",   name: "Dämmung EPS",       def: 40, editable: true }
        ]
      },
      {
        key: "mfh",
        tag: "MFH-Standard",
        title: "Standard 190 mm",
        schichten: [
          { key: "belag",      name: "Bodenbelag",       def: 15, editable: true },
          { key: "estrich",    name: "Estrich",           def: 65, editable: true },
          { key: "trittschall",name: "Trittschall / FBH", def: 30, editable: true },
          { key: "schuettung", name: "gebundene Schüttung", def: 80, editable: true }
        ]
      }
    ]
  },

  // ─── 3.5 Wände Stahlbeton ─────────────────────────────────────────
  "3.5": {
    title: "Wände Stahlbeton",
    type: "multiVariant",
    variants: [
      {
        key: "awkg",
        tag: "AW KG",
        title: "Außenwand KG",
        schichten: [
          { key: "beton",     name: "Stahlbeton",       def: 240, editable: true },
          { key: "perimeter", name: "Perimeterdämmung", def: 120, editable: true }
        ]
      },
      {
        key: "iwkg",
        tag: "IW KG",
        title: "Innenwand KG",
        schichten: [
          { key: "beton", name: "Stahlbeton", def: 200, editable: true }
        ]
      }
    ]
  },

  // ─── 3.6 Wände Holz (mit Fassaden-Matrix für AW-Typen) ────────────
  "3.6": {
    title: "Wände Holz",
    type: "multiVariant",
    variants: [
      {
        key: "awgk13",
        tag: "AW GK1-3",
        title: "Außenwand GK 1-3",
        hasFassade: true,
        schichten: [
          { key: "gf1",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true },
          { key: "instEbene", name: "Inst. Ebene · ohne Dämmung",        def: 60,   editable: true },
          { key: "osb",       name: "OSB",                               def: 15,   editable: true },
          { key: "staender",  name: "Holzständer / Holzweichfaser",      def: 240,  editable: true },
          { key: "hwf",       name: "Holzfaser",                         def: 60,   editable: true }
        ]
      },
      {
        key: "awgk4",
        tag: "AW GK4",
        title: "Außenwand GK 4",
        hasFassade: true,
        schichten: [
          { key: "gf1",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true },
          { key: "instEbene", name: "Inst. Ebene / Mineralwolle",        def: 60,   editable: true },
          { key: "vapor",     name: "Vapor Fermacell",                   def: 15,   editable: true },
          { key: "staender",  name: "Holzständer / Holzweichfaser",      def: 240,  editable: true },
          { key: "gf2",       name: "Gipsfaser-Platte",                  def: 18,   editable: true },
          { key: "hwf",       name: "Holzfaser (bei Putzfassade)",       def: 60,   editable: true }
        ]
      },
      {
        key: "gtw",
        tag: "GTW",
        title: "Gebäudetrennwand",
        schichten: [
          { key: "gf1",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true },
          { key: "gf2",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true },
          { key: "staender", name: "Holzständer / Holzfaser",            def: 160,  editable: true },
          { key: "gf3",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true },
          { key: "gf4",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true },
          { key: "luft",     name: "Luft",                               def: 10,   editable: true },
          { key: "vss",      name: "Vorsatzschale freistehend",          def: 50,   editable: true },
          { key: "gf5",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true }
        ]
      },
      {
        key: "wtw",
        tag: "WTW",
        title: "Wohnungstrennwand (einseitige VSS)",
        schichten: [
          { key: "gf1",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true },
          { key: "gf2",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true },
          { key: "staender",  name: "Holzständer / Holzfaser",           def: 160,  editable: true },
          { key: "gf3",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true },
          { key: "gf4",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true },
          { key: "vss",       name: "Vorsatzschale freistehend (Metallständer / Mineralwolle)", def: 50, editable: true },
          { key: "gf5",       name: "Gipsfaser-Platte",                  def: 12.5, editable: true }
        ]
      },
      {
        key: "iw",
        tag: "IW",
        title: "Innenwand",
        schichten: [
          { key: "gf1",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true },
          { key: "staender", name: "Holzständer / Holzweichfaser",       def: 120,  editable: true },
          { key: "gf2",      name: "Gipsfaser-Platte",                   def: 12.5, editable: true }
        ]
      },
      {
        key: "garage",
        tag: "Garage",
        title: "Garagenwand AW",
        schichten: [
          { key: "osb",      name: "OSB",                                def: 15,   editable: true },
          { key: "staender", name: "Holzständer / Holzweichfaser",       def: 160,  editable: true },
          { key: "hwf",      name: "Holzfaser",                          def: 60,   editable: true }
        ]
      }
    ],
    // Fassaden-Optionen mit Excel-Kürzeln
    fassaden: [
      { key: "P",  label: "Putz" },
      { key: "SV", label: "Holzschalung waagrecht" },
      { key: "SH", label: "Holzschalung senkrecht" },
      { key: "FP", label: "Fassadenplatten" },
      { key: "BD", label: "Boden Deckelschalung" },
      { key: "S",  label: "Schindeln" },
      { key: "SB", label: "Ständer Bohlen" }
    ]
  },

  // ─── 3.7 Fenster & Verglasung ─────────────────────────────────────
  "3.7": {
    title: "Fenster & Verglasung",
    type: "fenster",  // spezial: Rahmen-Einzelwahl + Dachfenster-Toggle + Verschattungslisten
    rahmenOptionen: [
      { key: "kunststoff", label: "Kunststoff" },
      { key: "holz",       label: "Holz" },
      { key: "holzAlu",    label: "Holz-Alu" },
      { key: "alu",        label: "Aluminium" }
    ],
    verschattungOptionen: [
      { key: "rollladen",    label: "Rollladen" },
      { key: "jalousie",     label: "Jalousie" },
      { key: "textilscreen", label: "Textilscreen" },
      { key: "ohne",         label: "Ohne" }
    ]
  },

  // ─── 3.8 Haustür ──────────────────────────────────────────────────
  "3.8": {
    title: "Haustür",
    type: "single",
    variants: [
      { key: "kunststoff", tag: "Kunststoff", title: "Kunststoff", schichten: [] },
      { key: "holz",       tag: "Holz",       title: "Holz",       schichten: [] }
    ]
  },

  // ─── 3.9 Steildach ────────────────────────────────────────────────
  "3.9": {
    title: "Steildach",
    type: "steildach",  // spezial: Standardaufbau + Innenausführung-Einzelwahl
    standard: {
      title: "Standard-Aufbau (von innen nach außen)",
      schichten: [
        { key: "osb",          name: "OSB",                       def: 15,  editable: true },
        { key: "sparren",      name: "Sparren / Holzweichfaser Einblasdämmung", def: 240, editable: true },
        { key: "aufsparren",   name: "Aufsparrendämmung",         def: 60,  editable: true },
        { key: "schalungsbahn",name: "Schalungsbahn",             def: "",  editable: true, placeholder: "mm" },
        { key: "konterlattung",name: "Konterlattung + Lattung",   def: 70,  editable: true },
        { key: "eindeckung",   name: "Dacheindeckung",            def: 30,  editable: true }
      ]
    },
    innenausfuehrung: [
      {
        key: "sichtdachstuhl",
        tag: "Sichtdachstuhl",
        title: "Sichtdachstuhl mit Holzschalung",
        schichten: [
          { key: "schalung", name: "Holzschalung", def: 21, editable: true }
        ],
        note: "Sichtsparren in Ökobilanz separat hinzufügen"
      },
      {
        key: "platte3s",
        tag: "3-S-Platte",
        title: "3-S-Platte Dachstuhl",
        schichten: [
          { key: "platte3s", name: "3-S-Platte", def: 19, editable: true }
        ]
      },
      {
        key: "putz",
        tag: "Putz",
        title: "Putz Dachstuhl",
        schichten: [
          { key: "fermacell", name: "Fermacell", def: 12.5, editable: true }
        ]
      }
    ]
  },

  // ─── 3.10 Flachdach ───────────────────────────────────────────────
  "3.10": {
    title: "Flachdach",
    type: "single",
    variants: [
      {
        key: "massivholz",
        tag: "Massivholz",
        title: "Massivholz, sichtbar",
        schichten: [
          { key: "massivholz",    name: "Massivholz, sichtbar", def: 140, editable: true },
          { key: "gefaelle",      name: "Gefälledämmung",       def: "",  editable: true, placeholder: "mm" },
          { key: "abdichtung",    name: "Abdichtung",           def: "",  editable: true, placeholder: "mm" }
        ]
      },
      {
        key: "stahlbeton",
        tag: "Stahlbeton",
        title: "Stahlbetondecke, sichtbar",
        schichten: [
          { key: "beton",       name: "Stahlbetondecke, sichtbar", def: 180, editable: true },
          { key: "gefaelle",    name: "Gefälledämmung",            def: "",  editable: true, placeholder: "mm" },
          { key: "abdichtung",  name: "Abdichtung",                def: "",  editable: true, placeholder: "mm" }
        ]
      }
    ]
  },

  // ─── 3.11 Gaube ───────────────────────────────────────────────────
  "3.11": {
    title: "Gaube",
    type: "single",
    variants: [
      { key: "flachdach",     tag: "Flachdach",      title: "Flachdach",       schichten: [] },
      { key: "steildachZ",    tag: "Steildach",      title: "Steildach Ziegel", schichten: [] },
      { key: "steildachB",    tag: "Steildach",      title: "Steildach Blech",  schichten: [] }
    ]
  },

  // ─── 3.12 Treppe ──────────────────────────────────────────────────
  "3.12": {
    title: "Treppe",
    type: "single",
    variants: [
      { key: "holz",       tag: "Holz",       title: "Holztreppe",       schichten: [] },
      { key: "stahlbeton", tag: "Stahlbeton", title: "Stahlbetontreppe", schichten: [] }
    ]
  }
};

const BAUTEIL_ORDER_3A = ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "3.10", "3.11", "3.12"];

// Welche Bauteile sind in der aktuellen UI aufgeklappt (UI-State, nicht persistiert)
const bauteilOpen = new Set();

// ─── Helpers ────────────────────────────────────────────────────────
function defaultVariantKey(bauteilId, p){
  const cat = BAUTEIL_CATALOG[bauteilId];
  if (!cat || !cat.variants) return null;
  // Fußbodenaufbau: Default je EFH/MFH
  if (bauteilId === "3.4"){
    return p.gebTyp === "mfh" ? "mfh" : "efh";
  }
  return cat.variants[0].key;
}

function findVariant(bauteilId, variantKey){
  const cat = BAUTEIL_CATALOG[bauteilId];
  if (!cat || !cat.variants) return null;
  return cat.variants.find(v => v.key === variantKey) || null;
}

// Geschoss-Liste aus Sektion 2 — für 3.2 Geschosswechsel-Decken,
// für 3.4 alle bewohnten Geschosse
function getGeschosseFor(bauteilId, p){
  // Nur Geschosse mit ausgefüllter lichter Höhe gelten als "verwendet".
  // Geschosse mit Label aber ohne Höhe sind ungenutzte Default-Slots.
  const list = (p.geschosse || []).filter(g =>
    g.key && g.key.trim() && g.value && g.value.trim());
  if (!list.length) return [];
  if (bauteilId === "3.2"){
    // Geschosswechsel: aufeinander folgende Paare + "letztes → Dach" wenn Dach existiert
    const pairs = [];
    for (let i = 0; i < list.length - 1; i++){
      pairs.push({ id: list[i].key + "→" + list[i+1].key, label: list[i].key + " → " + list[i+1].key });
    }
    // letzter Übergang Dach nur wenn ein Dach existiert UND es mind. ein Geschoss gibt
    if (p.daecher && p.daecher.length){
      pairs.push({ id: list[list.length-1].key + "→Dach", label: list[list.length-1].key + " → Dach" });
    }
    return pairs;
  }
  // 3.4: jedes ausgefüllte Geschoss bekommt einen Bodenaufbau
  return list.map(g => ({ id: g.key, label: g.key }));
}

// State-Initialisierung für ein Bauteil-Set
function ensureBauteilState(p, bauteilId){
  if (!p.bauteile) p.bauteile = {};
  if (p.bauteile[bauteilId]) return p.bauteile[bauteilId];
  const cat = BAUTEIL_CATALOG[bauteilId];
  if (cat.type === "simple"){
    p.bauteile[bauteilId] = { aktiv: false, daemmung_mm: "", notiz: "" };
  } else if (cat.type === "perGeschoss"){
    p.bauteile[bauteilId] = { perGeschoss: {}, notiz: "" };
  } else if (cat.type === "multiVariant"){
    // varianten: { "<variantKey>": { aktiv, schichten, fassadePerGeschoss? } }
    p.bauteile[bauteilId] = { varianten: {}, notiz: "" };
  } else if (cat.type === "fenster"){
    // rahmen: string|null  · dachfenster: bool  · verschattungen: { rollladen: "1,3,5", ... }
    p.bauteile[bauteilId] = { rahmen: null, dachfenster: false, verschattungen: {}, notiz: "" };
  } else if (cat.type === "steildach"){
    // standard: { schichten }  · innen: variantKey|null  · innenSchichten: {}
    p.bauteile[bauteilId] = { aktiv: false, schichten: {}, innen: null, innenSchichten: {}, notiz: "" };
  } else {
    // single
    p.bauteile[bauteilId] = { variant: null, schichten: {}, notiz: "" };
  }
  return p.bauteile[bauteilId];
}

function getGeschossEntry(p, bauteilId, geschossId){
  const state = ensureBauteilState(p, bauteilId);
  return state.perGeschoss[geschossId] || null;
}

function ensureGeschossEntry(p, bauteilId, geschossId){
  const state = ensureBauteilState(p, bauteilId);
  if (!state.perGeschoss[geschossId]){
    state.perGeschoss[geschossId] = { variant: null, schichten: {}, notiz: "" };
  }
  return state.perGeschoss[geschossId];
}

// Live-Stärke einer Aufbau-Instanz berechnen
function sumSchichten(entry, variant){
  if (!variant) return null;
  let total = 0;
  let hasValues = false;
  for (const s of variant.schichten){
    const v = entry.schichten[s.key];
    let n = NaN;
    if (v !== undefined && v !== "" && !isNaN(parseFloat(v))){
      n = parseFloat(v);
    } else if (typeof s.def === "number"){
      n = s.def;
    } else if (typeof s.def === "string" && s.def !== "" && !isNaN(parseFloat(s.def))){
      n = parseFloat(s.def);
    }
    if (!isNaN(n)){
      total += n;
      hasValues = true;
    }
  }
  // Auch wenn manche Schichten leer sind: solange mindestens eine Zahl da ist, Summe zurück.
  return hasValues ? Math.round(total * 10) / 10 : null;
}

// Wurde eine Schicht vom Default abgeweicht?
function isSchichtModified(entry, schicht){
  const v = entry.schichten[schicht.key];
  if (v === undefined || v === "") return false;
  const num = parseFloat(v);
  const defNum = (typeof schicht.def === "number") ? schicht.def : parseFloat(schicht.def);
  if (isNaN(defNum) && !isNaN(num)) return true;
  return num !== defNum;
}

// Sind in einem Bauteil-Aufbau überhaupt Modifikationen?
function hasAnyModification(entry, variant){
  if (!variant) return false;
  return variant.schichten.some(s => isSchichtModified(entry, s));
}

// Status-Pill für die zugeklappte Kopfzeile
function bauteilStatus(p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = p.bauteile && p.bauteile[bauteilId];
  if (!state) return { cls: "empty", text: "—" };

  if (cat.type === "simple"){
    if (!state.aktiv && !state.notiz) return { cls: "empty", text: "—" };
    if (state.aktiv) return { cls: "set", text: "gewählt" };
    return { cls: "set", text: "individuell" };
  }

  if (cat.type === "perGeschoss"){
    const ges = getGeschosseFor(bauteilId, p);
    if (!ges.length) return { cls: "empty", text: "—" };
    let filled = 0, mods = 0;
    for (const g of ges){
      const entry = state.perGeschoss[g.id];
      if (entry && entry.variant){
        filled++;
        const v = findVariant(bauteilId, entry.variant);
        if (hasAnyModification(entry, v)) mods++;
      }
    }
    if (filled === 0) return { cls: "empty", text: "—" };
    if (mods > 0) return { cls: "mod", text: filled + "/" + ges.length + " · angepasst" };
    return { cls: "set", text: filled + "/" + ges.length };
  }

  if (cat.type === "multiVariant"){
    const aktive = [];
    let mods = 0;
    for (const v of cat.variants){
      const e = state.varianten && state.varianten[v.key];
      if (e && e.aktiv){
        aktive.push(v.tag);
        if (hasAnyModification(e, v)) mods++;
      }
    }
    if (!aktive.length && !state.notiz) return { cls: "empty", text: "—" };
    if (!aktive.length) return { cls: "set", text: "Notiz" };
    const text = aktive.join(" · ");
    return { cls: mods > 0 ? "mod" : "set", text: text };
  }

  if (cat.type === "fenster"){
    const parts = [];
    if (state.rahmen){
      const r = cat.rahmenOptionen.find(o => o.key === state.rahmen);
      if (r) parts.push(r.label);
    }
    if (state.dachfenster) parts.push("+ Dachfenster");
    if (!parts.length && !state.notiz && !hasVerschattung(state)) return { cls: "empty", text: "—" };
    return { cls: "set", text: parts.length ? parts.join(" ") : "Verschattung" };
  }

  if (cat.type === "steildach"){
    if (!state.aktiv && !state.notiz) return { cls: "empty", text: "—" };
    if (state.aktiv){
      const stdMod = hasAnyModification({ schichten: state.schichten }, cat.standard);
      let label = "Standard";
      if (state.innen){
        const i = cat.innenausfuehrung.find(x => x.key === state.innen);
        if (i) label += " · " + i.tag;
      }
      return { cls: stdMod ? "mod" : "set", text: label };
    }
    return { cls: "set", text: "individuell" };
  }

  // single
  if (!state.variant) return state.notiz ? { cls: "set", text: "individuell" } : { cls: "empty", text: "—" };
  const v = findVariant(bauteilId, state.variant);
  if (!v) return { cls: "empty", text: "—" };
  if (hasAnyModification(state, v)) return { cls: "mod", text: v.title + " · angepasst" };
  return { cls: "set", text: v.title };
}

function hasVerschattung(state){
  if (!state.verschattungen) return false;
  return Object.values(state.verschattungen).some(v => v && String(v).trim());
}

// ─── Renderer ───────────────────────────────────────────────────────
function renderSection3(p){
  clearChildren(wizardContainer);
  const wrap = document.createElement("div");
  wrap.className = "bauteil-list";

  for (const id of BAUTEIL_ORDER_3A){
    const item = renderBauteilItem(p, id);
    wrap.append(item);
  }
  wizardContainer.append(wrap);
}

function renderBauteilItem(p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const item = document.createElement("div");
  item.className = "bauteil-item";
  if (bauteilOpen.has(bauteilId)) item.classList.add("open");

  // Head
  const head = document.createElement("button");
  head.type = "button";
  head.className = "bauteil-head";
  head.setAttribute("aria-expanded", bauteilOpen.has(bauteilId) ? "true" : "false");

  const noEl = document.createElement("span");
  noEl.className = "bh-no";
  noEl.textContent = bauteilId;

  const titleEl = document.createElement("span");
  titleEl.className = "bh-title";
  titleEl.textContent = cat.title;

  const status = bauteilStatus(p, bauteilId);
  const statusEl = document.createElement("span");
  statusEl.className = "bh-status " + status.cls;
  statusEl.textContent = status.text;

  const chevron = document.createElement("span");
  chevron.className = "bh-chevron";
  const svgNS = "http://www.w3.org/2000/svg";
  const csvg = document.createElementNS(svgNS, "svg");
  csvg.setAttribute("viewBox", "0 0 24 24");
  csvg.setAttribute("fill", "none");
  csvg.setAttribute("stroke", "currentColor");
  csvg.setAttribute("stroke-width", "2");
  csvg.setAttribute("stroke-linecap", "round");
  csvg.setAttribute("stroke-linejoin", "round");
  const cp = document.createElementNS(svgNS, "polyline");
  cp.setAttribute("points", "6 9 12 15 18 9");
  csvg.append(cp);
  chevron.append(csvg);

  head.append(noEl, titleEl, statusEl, chevron);
  head.addEventListener("click", () => {
    if (bauteilOpen.has(bauteilId)) bauteilOpen.delete(bauteilId);
    else bauteilOpen.add(bauteilId);
    renderSection3(p);
    renderWizardChrome();
  });
  item.append(head);

  // Body — nur wenn aufgeklappt
  if (bauteilOpen.has(bauteilId)){
    const body = document.createElement("div");
    body.className = "bauteil-body";

    if (cat.type === "simple"){
      renderBauteilSimple(body, p, bauteilId);
    } else if (cat.type === "perGeschoss"){
      renderBauteilPerGeschoss(body, p, bauteilId);
    } else if (cat.type === "multiVariant"){
      renderBauteilMultiVariant(body, p, bauteilId);
    } else if (cat.type === "fenster"){
      renderBauteilFenster(body, p, bauteilId);
    } else if (cat.type === "steildach"){
      renderBauteilSteildach(body, p, bauteilId);
    } else {
      renderBauteilSingle(body, p, bauteilId);
    }

    item.append(body);
  }

  return item;
}

// Variante: ein Aufbau global (3.1)
function renderBauteilSingle(body, p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = ensureBauteilState(p, bauteilId);
  if (!state.variant) state.variant = defaultVariantKey(bauteilId, p);

  // Variant-Auswahl
  const grid = document.createElement("div");
  grid.className = "variant-grid " + (cat.variants.length === 2 ? "cols-2" : "cols-1");
  for (const v of cat.variants){
    grid.append(makeVariantCard(v, state.variant === v.key, () => {
      // Variant wechseln — Schichten resetten, damit Defaults der neuen Variante greifen
      state.variant = v.key;
      state.schichten = {};
      touchActive();
      renderSection3(p);
      renderWizardChrome();
    }));
  }
  body.append(grid);

  // Aktiver Aufbau-Block mit editierbaren Schichten
  const activeVariant = findVariant(bauteilId, state.variant);
  if (activeVariant){
    body.append(makeAufbauBlock(activeVariant, state, p, bauteilId, null));
  }

  // Freifeld
  body.append(makeNotizFeld(state.notiz || "", (val) => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }));
}

// Variante: pro Geschoss (3.2 + 3.4)
function renderBauteilPerGeschoss(body, p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = ensureBauteilState(p, bauteilId);
  const geschosse = getGeschosseFor(bauteilId, p);

  if (!geschosse.length){
    body.append(makeHinweis(
      bauteilId === "3.2"
        ? "Bitte erst in Sektion 2 Geschosse anlegen — die Geschosswechsel-Decken werden daraus abgeleitet."
        : "Bitte erst in Sektion 2 Geschosse anlegen."
    ));
    return;
  }

  // Geschoss-Auswahl-Zeilen
  const listWrap = document.createElement("div");
  listWrap.style.marginBottom = "10px";
  for (const ges of geschosse){
    // 3.4 (Fußboden): Default-Eintrag mit EFH/MFH-Variante anlegen, damit der User
    //                  schon eine sinnvolle Vor-Auswahl sieht.
    // 3.2 (Decken):   nur dann materialisieren wenn der Nutzer aktiv wählt.
    let entry;
    if (bauteilId === "3.4"){
      entry = ensureGeschossEntry(p, bauteilId, ges.id);
      if (!entry.variant) entry.variant = defaultVariantKey(bauteilId, p);
    } else {
      entry = getGeschossEntry(p, bauteilId, ges.id);
    }
    // Für den Render einen sicheren Fallback nutzen
    const displayEntry = entry || { variant: null, schichten: {}, notiz: "" };
    const geschossIdLocal = ges.id;  // closure-stabil

    const row = document.createElement("div");
    row.className = "geschoss-select-row";

    const lab = document.createElement("span");
    lab.className = "gs-label";
    lab.textContent = ges.label;

    const sel = document.createElement("select");
    sel.className = "wiz-input";
    const noneOpt = document.createElement("option");
    noneOpt.value = "";
    noneOpt.textContent = "— wählen —";
    sel.append(noneOpt);
    for (const v of cat.variants){
      const opt = document.createElement("option");
      opt.value = v.key;
      opt.textContent = v.title;
      if (displayEntry.variant === v.key) opt.selected = true;
      sel.append(opt);
    }
    sel.addEventListener("change", () => {
      if (!sel.value){
        // Kein "wählen" — Eintrag entfernen falls vorhanden
        const st = ensureBauteilState(p, bauteilId);
        delete st.perGeschoss[geschossIdLocal];
      } else {
        const e2 = ensureGeschossEntry(p, bauteilId, geschossIdLocal);
        e2.variant = sel.value;
        e2.schichten = {};
      }
      touchActive();
      renderSection3(p);
      renderWizardChrome();
    });

    const sumEl = document.createElement("span");
    sumEl.className = "gs-sum";
    if (displayEntry.variant){
      const v = findVariant(bauteilId, displayEntry.variant);
      const total = sumSchichten(displayEntry, v);
      if (total !== null){
        sumEl.textContent = total + " mm";
        sumEl.classList.add("set");
      } else {
        sumEl.textContent = "—";
      }
    } else {
      sumEl.textContent = "—";
    }

    row.append(lab, sel, sumEl);
    listWrap.append(row);

    // Aufbau-Block direkt darunter, wenn Variante gewählt
    if (displayEntry.variant && entry){
      const v = findVariant(bauteilId, displayEntry.variant);
      const block = makeAufbauBlock(v, entry, p, bauteilId, ges.id);
      block.style.marginLeft = "12px";
      block.style.marginBottom = "10px";
      listWrap.append(block);
    }
  }
  body.append(listWrap);

  // Hinweis: was sind die Auswahlmöglichkeiten
  const opts = cat.variants.map(v => v.title).join(" · ");
  body.append(makeHinweis("Auswahlmöglichkeiten je Geschoss: " + opts + " · oder Stärken anpassen"));
}

// Variante: 3.3 — einfaches Häkchen + ein Stärke-Feld + Notiz
function renderBauteilSimple(body, p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = ensureBauteilState(p, bauteilId);

  // Auswahl: aktiv / nicht aktiv
  const chk = document.createElement("button");
  chk.type = "button";
  chk.className = "checkbox-row";
  chk.style.marginBottom = "10px";
  chk.style.background = "var(--surface)";
  chk.style.border = "1px solid var(--border)";
  chk.style.borderRadius = "8px";
  chk.style.padding = "10px 12px";
  chk.style.width = "100%";
  chk.style.display = "flex";
  if (state.aktiv) chk.classList.add("checked");
  const box = document.createElement("span");
  box.className = "box";
  const svgNS = "http://www.w3.org/2000/svg";
  const svgC = document.createElementNS(svgNS, "svg");
  svgC.setAttribute("viewBox", "0 0 24 24");
  svgC.setAttribute("fill", "none");
  svgC.setAttribute("stroke", "currentColor");
  svgC.setAttribute("stroke-linecap", "round");
  svgC.setAttribute("stroke-linejoin", "round");
  const polyC = document.createElementNS(svgNS, "polyline");
  polyC.setAttribute("points", "5 12 10 17 19 7");
  svgC.append(polyC);
  box.append(svgC);
  const lab = document.createElement("span");
  lab.className = "label";
  lab.textContent = cat.standardLabel;
  chk.append(box, lab);
  chk.addEventListener("click", () => {
    state.aktiv = !state.aktiv;
    touchActive();
    renderSection3(p);
    renderWizardChrome();
  });
  body.append(chk);

  if (state.aktiv){
    // Stärke-Eingabe
    const block = document.createElement("div");
    block.className = "aufbau-block";
    const labEl = document.createElement("div");
    labEl.className = "ab-label";
    labEl.append(document.createTextNode(cat.schichtName + " · Stärke"));
    block.append(labEl);
    const row = document.createElement("div");
    row.className = "schicht-row";
    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "schicht-thk";
    inp.maxLength = 6;
    inp.placeholder = "—";
    inp.value = state.daemmung_mm || "";
    inp.addEventListener("input", () => {
      state.daemmung_mm = sanitizeStr(inp.value, 6);
      touchActive();
    });
    const n = document.createElement("span");
    n.className = "schicht-name";
    n.textContent = cat.schichtName;
    const u = document.createElement("span");
    u.className = "schicht-unit";
    u.textContent = "mm";
    row.append(inp, n, u);
    block.append(row);
    body.append(block);
  }

  // Notiz / Infos / Besonderheiten
  body.append(makeNotizFeld(state.notiz || "", (val) => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }, "Infos · Besonderheiten"));
}

// ─── Sub-Komponenten ────────────────────────────────────────────────
function makeVariantCard(variant, active, onClick){
  const card = document.createElement("button");
  card.type = "button";
  card.className = "variant-card" + (active ? " active" : "");
  const mark = document.createElement("div");
  mark.className = "vc-mark";
  const radio = document.createElement("span");
  radio.className = "vc-radio";
  const tag = document.createElement("span");
  tag.className = "vc-tag";
  tag.textContent = variant.tag || "";
  mark.append(radio, tag);
  const t = document.createElement("div");
  t.className = "vc-title";
  t.textContent = variant.title;
  const d = document.createElement("div");
  d.className = "vc-detail";
  const sumDef = variant.schichten.reduce((acc, s) => acc + s.def, 0);
  d.textContent = sumDef + " mm Standard";
  card.append(mark, t, d);
  card.addEventListener("click", onClick);
  return card;
}

function makeAufbauBlock(variant, entry, p, bauteilId, geschossId){
  const block = document.createElement("div");
  block.className = "aufbau-block";

  const labEl = document.createElement("div");
  labEl.className = "ab-label";
  const labText = document.createElement("span");
  labText.textContent = "Aufbau · Stärken anpassbar";
  labEl.append(labText);

  // Reset-Button nur wenn was modifiziert ist
  if (hasAnyModification(entry, variant)){
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "ab-reset";
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M3 12a9 9 0 1 0 3-6.7");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "3 3 3 9 9 9");
    svg.append(path, poly);
    reset.append(svg, document.createTextNode("zurücksetzen"));
    reset.addEventListener("click", () => {
      entry.schichten = {};
      touchActive();
      renderSection3(p);
      renderWizardChrome();
    });
    labEl.append(reset);
  }
  block.append(labEl);

  // Schicht-Zeilen
  for (const s of variant.schichten){
    const row = document.createElement("div");
    row.className = "schicht-row";

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "schicht-thk";
    inp.maxLength = 6;
    inp.value = (entry.schichten[s.key] !== undefined && entry.schichten[s.key] !== "")
      ? entry.schichten[s.key]
      : String(s.def);
    if (isSchichtModified(entry, s)) inp.classList.add("modified");
    if (!s.editable) inp.readOnly = true;
    inp.addEventListener("input", () => {
      const v = inp.value.replace(",", ".").trim();
      if (v === "" || v === String(s.def)){
        delete entry.schichten[s.key];
      } else {
        entry.schichten[s.key] = sanitizeStr(v, 6);
      }
      touchActive();
      // Lokal nur die Summe, Modified-Marker und Status-Pill updaten
      // (sonst verliert das Input den Focus)
      updateAufbauSum(block, variant, entry);
      inp.classList.toggle("modified", isSchichtModified(entry, s));
      // Status-Pill in der zugehörigen Kopfzeile aktualisieren
      const itemEl = block.closest(".bauteil-item");
      if (itemEl){
        const proj = findProject(activeProjectId);
        const statusEl = itemEl.querySelector(".bh-status");
        if (statusEl && proj){
          const status = bauteilStatus(proj, bauteilId);
          statusEl.className = "bh-status " + status.cls;
          statusEl.textContent = status.text;
        }
        // Bei perGeschoss: auch die Summen in den Geschoss-Zeilen updaten
        if (geschossId && proj){
          const rows = itemEl.querySelectorAll(".geschoss-select-row");
          const state = ensureBauteilState(proj, bauteilId);
          const ges = getGeschosseFor(bauteilId, proj);
          rows.forEach((rEl, idx) => {
            if (idx >= ges.length) return;
            const e = state.perGeschoss[ges[idx].id];
            const sumSpan = rEl.querySelector(".gs-sum");
            if (!sumSpan) return;
            if (e && e.variant){
              const vv = findVariant(bauteilId, e.variant);
              const t = sumSchichten(e, vv);
              if (t !== null){ sumSpan.textContent = t + " mm"; sumSpan.classList.add("set"); }
              else { sumSpan.textContent = "—"; sumSpan.classList.remove("set"); }
            } else {
              sumSpan.textContent = "—"; sumSpan.classList.remove("set");
            }
          });
        }
      }
    });

    const name = document.createElement("span");
    name.className = "schicht-name";
    name.textContent = s.name;

    const unit = document.createElement("span");
    unit.className = "schicht-unit";
    unit.textContent = "mm";

    row.append(inp, name, unit);
    block.append(row);
  }

  // Summe
  const sum = document.createElement("div");
  sum.className = "ab-sum";
  const sv = document.createElement("span");
  sv.className = "v";
  sv.textContent = sumSchichten(entry, variant) + "";
  const sl = document.createElement("span");
  sl.className = "l";
  sl.textContent = "Gesamtstärke";
  const su = document.createElement("span");
  su.className = "u";
  su.textContent = "mm";
  sum.append(sv, sl, su);
  block.append(sum);

  return block;
}

function updateAufbauSum(blockEl, variant, entry){
  const sv = blockEl.querySelector(".ab-sum .v");
  if (sv) sv.textContent = sumSchichten(entry, variant) + "";
  // Reset-Button erscheinen/verschwinden lassen — minimaler Eingriff:
  // wenn aktuell keiner da ist und nun nötig, oder umgekehrt, einmal neu rendern den labEl
  const labEl = blockEl.querySelector(".ab-label");
  if (!labEl) return;
  const hasReset = !!labEl.querySelector(".ab-reset");
  const needReset = hasAnyModification(entry, variant);
  if (hasReset && !needReset){
    labEl.querySelector(".ab-reset").remove();
  } else if (!hasReset && needReset){
    // Reset-Button hinzubauen (gleiche Logik wie oben, ohne Full-Render)
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "ab-reset";
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M3 12a9 9 0 1 0 3-6.7");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "3 3 3 9 9 9");
    svg.append(path, poly);
    reset.append(svg, document.createTextNode("zurücksetzen"));
    reset.addEventListener("click", () => {
      entry.schichten = {};
      touchActive();
      const p = findProject(activeProjectId);
      renderSection3(p);
      renderWizardChrome();
    });
    labEl.append(reset);
  }
}

function makeNotizFeld(value, onInput, labelText){
  const wrap = document.createElement("div");
  wrap.className = "bauteil-notiz";
  const lab = document.createElement("div");
  lab.className = "bauteil-notiz-label";
  lab.textContent = labelText || "Notiz · individueller Aufbau";
  const ta = document.createElement("textarea");
  ta.className = "wiz-input";
  ta.rows = 2;
  ta.maxLength = MAX_PROJECT_TEXT_LEN;
  ta.placeholder = "Customized Aufbauten, Besonderheiten — hier eintragen";
  ta.value = value;
  ta.addEventListener("input", () => onInput(ta.value));
  wrap.append(lab, ta);
  return wrap;
}

function makeHinweis(text){
  const h = document.createElement("div");
  h.className = "info-hint";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const c = document.createElementNS(svgNS, "circle");
  c.setAttribute("cx","12"); c.setAttribute("cy","12"); c.setAttribute("r","9");
  const l1 = document.createElementNS(svgNS, "line");
  l1.setAttribute("x1","12"); l1.setAttribute("y1","8");
  l1.setAttribute("x2","12"); l1.setAttribute("y2","12");
  const l2 = document.createElementNS(svgNS, "line");
  l2.setAttribute("x1","12"); l2.setAttribute("y1","16");
  l2.setAttribute("x2","12.01"); l2.setAttribute("y2","16");
  svg.append(c, l1, l2);
  const t = document.createElement("span");
  t.textContent = text;
  h.append(svg, t);
  return h;
}

// ─── sectionHasData für Sektion 3 erweitern ─────────────────────────
// Eigene Funktion, die von sectionHasData() aufgerufen wird (siehe Patch unten)
function sectionHasDataBauteile(p){
  if (!p || !p.bauteile) return false;
  for (const id of BAUTEIL_ORDER_3A){
    const state = p.bauteile[id];
    if (!state) continue;
    const cat = BAUTEIL_CATALOG[id];
    if (cat.type === "simple"){
      if (state.aktiv || state.notiz || state.daemmung_mm) return true;
    } else if (cat.type === "perGeschoss"){
      const pg = state.perGeschoss || {};
      for (const k in pg){
        const e = pg[k];
        if (e.variant || e.notiz) return true;
      }
      if (state.notiz) return true;
    } else if (cat.type === "multiVariant"){
      const vs = state.varianten || {};
      for (const k in vs){
        if (vs[k] && vs[k].aktiv) return true;
      }
      if (state.notiz) return true;
    } else if (cat.type === "fenster"){
      if (state.rahmen || state.dachfenster || hasVerschattung(state) || state.notiz) return true;
    } else if (cat.type === "steildach"){
      if (state.aktiv || state.innen || state.notiz) return true;
    } else {
      if (state.variant || state.notiz) return true;
    }
  }
  return false;
}


// ════════════════════════════════════════════════════════════════════════════
// SEKTION 3 — Renderer für die neuen Bauteil-Typen (multiVariant/fenster/steildach)
// ════════════════════════════════════════════════════════════════════════════

// ─── multiVariant (3.5, 3.6): mehrere Wand-Typen unabhängig anklickbar ─────
function renderBauteilMultiVariant(body, p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = ensureBauteilState(p, bauteilId);
  if (!state.varianten) state.varianten = {};

  // Toggle-Grid für alle verfügbaren Wand-Typen
  const toggleGrid = document.createElement("div");
  toggleGrid.style.display = "grid";
  toggleGrid.style.gridTemplateColumns = "repeat(2, 1fr)";
  toggleGrid.style.gap = "6px";
  toggleGrid.style.marginBottom = "12px";

  for (const v of cat.variants){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-pill";
    const aktiv = !!(state.varianten[v.key] && state.varianten[v.key].aktiv);
    if (aktiv) btn.classList.add("active");
    btn.style.textAlign = "left";
    btn.style.padding = "8px 10px";
    btn.style.fontSize = "12px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.gap = "6px";
    // Häkchen-Icon wenn aktiv
    if (aktiv){
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2.5");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.style.width = "12px"; svg.style.height = "12px";
      const poly = document.createElementNS(svgNS, "polyline");
      poly.setAttribute("points", "5 12 10 17 19 7");
      svg.append(poly);
      btn.append(svg);
    }
    btn.append(document.createTextNode(v.tag));
    btn.addEventListener("click", () => {
      if (!state.varianten[v.key]){
        state.varianten[v.key] = { aktiv: true, schichten: {}, fassadePerGeschoss: {} };
      } else {
        state.varianten[v.key].aktiv = !state.varianten[v.key].aktiv;
      }
      touchActive();
      renderSection3(p);
      renderWizardChrome();
    });
    toggleGrid.append(btn);
  }
  body.append(toggleGrid);

  // Für jede aktive Variante einen Aufbau-Block
  for (const v of cat.variants){
    const e = state.varianten[v.key];
    if (!e || !e.aktiv) continue;

    const varBlock = document.createElement("div");
    varBlock.style.marginBottom = "12px";

    // Mini-Header zur Identifikation
    const head = document.createElement("div");
    head.style.fontFamily = "var(--font-mono)";
    head.style.fontSize = "11px";
    head.style.color = "var(--text-3)";
    head.style.marginBottom = "4px";
    head.style.letterSpacing = "0.03em";
    head.textContent = v.tag + " · " + v.title;
    varBlock.append(head);

    // Aufbau-Block (wiederverwendet)
    const block = makeAufbauBlock(v, e, p, bauteilId, null);
    varBlock.append(block);

    // Fassaden-Matrix pro Geschoss bei AW-Typen
    if (v.hasFassade && cat.fassaden){
      varBlock.append(makeFassadenMatrix(p, bauteilId, v, e));
    }

    body.append(varBlock);
  }

  // Notiz
  body.append(makeNotizFeld(state.notiz || "", (val) => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }));
}

// Fassaden-Matrix: pro Geschoss eine Auswahl aus den 7 Optionen
function makeFassadenMatrix(p, bauteilId, variant, entry){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const geschosse = (p.geschosse || []).filter(g =>
    g.key && g.key.trim() && g.value && g.value.trim());

  const wrap = document.createElement("div");
  wrap.style.background = "var(--surface)";
  wrap.style.border = "1px solid var(--border)";
  wrap.style.borderRadius = "8px";
  wrap.style.padding = "10px 12px";
  wrap.style.marginTop = "6px";

  const lab = document.createElement("div");
  lab.style.fontSize = "10px";
  lab.style.color = "var(--text-3)";
  lab.style.textTransform = "uppercase";
  lab.style.letterSpacing = "0.04em";
  lab.style.marginBottom = "6px";
  lab.style.fontWeight = "500";
  lab.textContent = "Fassade pro Geschoss";
  wrap.append(lab);

  if (!geschosse.length){
    const h = document.createElement("div");
    h.style.fontSize = "12px";
    h.style.color = "var(--text-2)";
    h.textContent = "Erst Geschosse in Sektion 2 anlegen";
    wrap.append(h);
    return wrap;
  }

  if (!entry.fassadePerGeschoss) entry.fassadePerGeschoss = {};

  for (const g of geschosse){
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "70px 1fr";
    row.style.gap = "8px";
    row.style.alignItems = "center";
    row.style.marginBottom = "4px";

    const gl = document.createElement("span");
    gl.style.fontFamily = "var(--font-mono)";
    gl.style.fontSize = "11px";
    gl.style.color = "var(--text-2)";
    gl.textContent = g.key;

    const sel = document.createElement("select");
    sel.className = "wiz-input";
    sel.style.fontSize = "12px";
    sel.style.padding = "6px 8px";
    const none = document.createElement("option");
    none.value = ""; none.textContent = "— wählen —";
    sel.append(none);
    for (const f of cat.fassaden){
      const opt = document.createElement("option");
      opt.value = f.key;
      opt.textContent = f.label + " · " + f.key;
      if (entry.fassadePerGeschoss[g.key] === f.key) opt.selected = true;
      sel.append(opt);
    }
    sel.addEventListener("change", () => {
      if (sel.value){
        entry.fassadePerGeschoss[g.key] = sel.value;
      } else {
        delete entry.fassadePerGeschoss[g.key];
      }
      touchActive();
      // Status-Pill aktualisieren — kein Full-Render nötig
      const itemEl = wrap.closest(".bauteil-item");
      if (itemEl){
        const statusEl = itemEl.querySelector(".bh-status");
        if (statusEl){
          const proj = findProject(activeProjectId);
          const status = bauteilStatus(proj, bauteilId);
          statusEl.className = "bh-status " + status.cls;
          statusEl.textContent = status.text;
        }
      }
    });
    row.append(gl, sel);
    wrap.append(row);
  }
  return wrap;
}

// ─── fenster (3.7): Rahmen-Einzelwahl + Dachfenster + Verschattung-Listen ───
function renderBauteilFenster(body, p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = ensureBauteilState(p, bauteilId);

  // Rahmenmaterial — Einzelwahl
  const rahmenCard = document.createElement("div");
  rahmenCard.style.background = "var(--surface)";
  rahmenCard.style.border = "1px solid var(--border)";
  rahmenCard.style.borderRadius = "8px";
  rahmenCard.style.padding = "10px 12px";
  rahmenCard.style.marginBottom = "10px";

  const rLab = document.createElement("div");
  rLab.style.fontSize = "10px";
  rLab.style.color = "var(--text-3)";
  rLab.style.textTransform = "uppercase";
  rLab.style.letterSpacing = "0.04em";
  rLab.style.marginBottom = "6px";
  rLab.style.fontWeight = "500";
  rLab.textContent = "Rahmenmaterial · eine Wahl fürs Gebäude";
  rahmenCard.append(rLab);

  const rPills = document.createElement("div");
  rPills.className = "option-pills";
  for (const o of cat.rahmenOptionen){
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "option-pill";
    if (state.rahmen === o.key) pill.classList.add("active");
    pill.textContent = o.label;
    pill.addEventListener("click", () => {
      state.rahmen = (state.rahmen === o.key) ? null : o.key;
      touchActive();
      renderSection3(p);
      renderWizardChrome();
    });
    rPills.append(pill);
  }
  rahmenCard.append(rPills);
  body.append(rahmenCard);

  // Dachfenster — zusätzliche Mehrfach-Option
  const dfCard = document.createElement("div");
  dfCard.style.background = "var(--surface)";
  dfCard.style.border = "1px solid var(--border)";
  dfCard.style.borderRadius = "8px";
  dfCard.style.padding = "0";
  dfCard.style.marginBottom = "10px";

  const dfRow = document.createElement("button");
  dfRow.type = "button";
  dfRow.className = "checkbox-row";
  dfRow.style.background = "transparent";
  dfRow.style.border = "none";
  dfRow.style.padding = "10px 12px";
  dfRow.style.width = "100%";
  if (state.dachfenster) dfRow.classList.add("checked");
  const box = document.createElement("span");
  box.className = "box";
  const svgNS = "http://www.w3.org/2000/svg";
  const svgC = document.createElementNS(svgNS, "svg");
  svgC.setAttribute("viewBox", "0 0 24 24");
  svgC.setAttribute("fill", "none");
  svgC.setAttribute("stroke", "currentColor");
  svgC.setAttribute("stroke-linecap", "round");
  svgC.setAttribute("stroke-linejoin", "round");
  const polyC = document.createElementNS(svgNS, "polyline");
  polyC.setAttribute("points", "5 12 10 17 19 7");
  svgC.append(polyC);
  box.append(svgC);
  const lab = document.createElement("span");
  lab.className = "label";
  lab.textContent = "Dachfenster vorhanden";
  dfRow.append(box, lab);
  dfRow.addEventListener("click", () => {
    state.dachfenster = !state.dachfenster;
    touchActive();
    renderSection3(p);
    renderWizardChrome();
  });
  dfCard.append(dfRow);
  body.append(dfCard);

  // Verschattung — pro Typ eine Mehrfachauswahl (Fenster-Nr.-Liste)
  const vsCard = document.createElement("div");
  vsCard.style.background = "var(--surface)";
  vsCard.style.border = "1px solid var(--border)";
  vsCard.style.borderRadius = "8px";
  vsCard.style.padding = "10px 12px";
  vsCard.style.marginBottom = "10px";

  const vsLab = document.createElement("div");
  vsLab.style.fontSize = "10px";
  vsLab.style.color = "var(--text-3)";
  vsLab.style.textTransform = "uppercase";
  vsLab.style.letterSpacing = "0.04em";
  vsLab.style.marginBottom = "8px";
  vsLab.style.fontWeight = "500";
  vsLab.append(document.createTextNode("Verschattung "));
  const hint = document.createElement("span");
  hint.style.fontWeight = "400";
  hint.style.textTransform = "none";
  hint.style.letterSpacing = "0";
  hint.style.color = "var(--text-3)";
  hint.textContent = "· Fenster-Nr. oder Raum eintragen, z.B. \"1, 3, 5\" oder \"Wohnzimmer, Bad\"";
  vsLab.append(hint);
  vsCard.append(vsLab);

  if (!state.verschattungen) state.verschattungen = {};

  for (const v of cat.verschattungOptionen){
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "120px 1fr";
    row.style.gap = "8px";
    row.style.alignItems = "center";
    row.style.marginBottom = "5px";

    const l = document.createElement("span");
    l.style.fontSize = "12px";
    l.style.color = "var(--text-2)";
    l.textContent = v.label;

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "wiz-input";
    inp.style.fontSize = "12px";
    inp.style.padding = "6px 10px";
    inp.maxLength = MAX_PROJECT_TEXT_LEN;
    inp.placeholder = "Fenster-Nr / Raum";
    inp.value = state.verschattungen[v.key] || "";
    inp.addEventListener("input", () => {
      const val = sanitizeStr(inp.value, MAX_PROJECT_TEXT_LEN);
      if (val.trim()) state.verschattungen[v.key] = val;
      else delete state.verschattungen[v.key];
      touchActive();
      // Status-Pill aktualisieren
      const itemEl = vsCard.closest(".bauteil-item");
      if (itemEl){
        const statusEl = itemEl.querySelector(".bh-status");
        if (statusEl){
          const proj = findProject(activeProjectId);
          const status = bauteilStatus(proj, bauteilId);
          statusEl.className = "bh-status " + status.cls;
          statusEl.textContent = status.text;
        }
      }
    });

    row.append(l, inp);
    vsCard.append(row);
  }
  body.append(vsCard);

  // Notiz
  body.append(makeNotizFeld(state.notiz || "", (val) => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }));
}

// ─── steildach (3.9): Standardaufbau editierbar + Innen-Einzelwahl ─────────
function renderBauteilSteildach(body, p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = ensureBauteilState(p, bauteilId);

  // Aktivierungs-Häkchen für den Standardaufbau
  const chk = document.createElement("button");
  chk.type = "button";
  chk.className = "checkbox-row";
  chk.style.background = "var(--surface)";
  chk.style.border = "1px solid var(--border)";
  chk.style.borderRadius = "8px";
  chk.style.padding = "10px 12px";
  chk.style.width = "100%";
  chk.style.marginBottom = "10px";
  if (state.aktiv) chk.classList.add("checked");
  const box = document.createElement("span");
  box.className = "box";
  const svgNS = "http://www.w3.org/2000/svg";
  const svgC = document.createElementNS(svgNS, "svg");
  svgC.setAttribute("viewBox", "0 0 24 24");
  svgC.setAttribute("fill", "none");
  svgC.setAttribute("stroke", "currentColor");
  svgC.setAttribute("stroke-linecap", "round");
  svgC.setAttribute("stroke-linejoin", "round");
  const polyC = document.createElementNS(svgNS, "polyline");
  polyC.setAttribute("points", "5 12 10 17 19 7");
  svgC.append(polyC);
  box.append(svgC);
  const lab = document.createElement("span");
  lab.className = "label";
  lab.textContent = "Steildach verbaut · Standard-Aufbau aktivieren";
  chk.append(box, lab);
  chk.addEventListener("click", () => {
    state.aktiv = !state.aktiv;
    touchActive();
    renderSection3(p);
    renderWizardChrome();
  });
  body.append(chk);

  if (state.aktiv){
    // Standard-Aufbau als Aufbau-Block (wiederverwendet, virtuelle Variante)
    const virtVariant = {
      key: "_standard",
      title: cat.standard.title,
      schichten: cat.standard.schichten
    };
    const entry = { schichten: state.schichten };
    const block = makeAufbauBlock(virtVariant, entry, p, bauteilId, null);
    // Nach jeder Änderung muss state.schichten gespiegelt werden — das funktioniert
    // schon automatisch, weil entry.schichten dieselbe Referenz ist.
    state.schichten = entry.schichten;
    body.append(block);

    // Innenausführung — Einzelwahl
    const innenCard = document.createElement("div");
    innenCard.style.marginTop = "12px";
    innenCard.style.background = "var(--surface)";
    innenCard.style.border = "1px solid var(--border)";
    innenCard.style.borderRadius = "8px";
    innenCard.style.padding = "10px 12px";

    const iLab = document.createElement("div");
    iLab.style.fontSize = "10px";
    iLab.style.color = "var(--text-3)";
    iLab.style.textTransform = "uppercase";
    iLab.style.letterSpacing = "0.04em";
    iLab.style.marginBottom = "8px";
    iLab.style.fontWeight = "500";
    iLab.textContent = "Innenausführung · eine Wahl";
    innenCard.append(iLab);

    const grid = document.createElement("div");
    grid.className = "variant-grid cols-1";
    for (const v of cat.innenausfuehrung){
      const card = makeVariantCard(v, state.innen === v.key, () => {
        state.innen = (state.innen === v.key) ? null : v.key;
        // Reset Schichten beim Wechsel
        state.innenSchichten = {};
        touchActive();
        renderSection3(p);
        renderWizardChrome();
      });
      grid.append(card);
    }
    innenCard.append(grid);

    // Wenn Innenausführung gewählt, Schicht-Block dazu
    if (state.innen){
      const iv = cat.innenausfuehrung.find(x => x.key === state.innen);
      if (iv && iv.schichten.length){
        const innenEntry = { schichten: state.innenSchichten };
        const innenBlock = makeAufbauBlock(iv, innenEntry, p, bauteilId, null);
        innenBlock.style.marginTop = "8px";
        innenCard.append(innenBlock);
        state.innenSchichten = innenEntry.schichten;
        // Note
        if (iv.note){
          const noteEl = document.createElement("div");
          noteEl.style.fontSize = "11px";
          noteEl.style.color = "var(--text-2)";
          noteEl.style.marginTop = "6px";
          noteEl.style.fontStyle = "italic";
          noteEl.textContent = iv.note;
          innenCard.append(noteEl);
        }
      }
    }

    body.append(innenCard);
  }

  // Notiz
  body.append(makeNotizFeld(state.notiz || "", (val) => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }));
}

// ─── sanitizeProject erweitern: tiefere Sanitisierung der bauteile.* ─────
// Wir patchen nicht die Funktion selbst, sondern wrappen den `projects.push`-
// Pfad in loadProjects/importProjects über einen Post-Sanitizer.
function sanitizeBauteile(p){
  if (!p || !p.bauteile || typeof p.bauteile !== "object") return p;
  const src = p.bauteile;
  const clean = {};
  for (const id of BAUTEIL_ORDER_3A){
    const s = src[id];
    if (!s || typeof s !== "object") continue;
    const cat = BAUTEIL_CATALOG[id];
    if (cat.type === "simple"){
      clean[id] = {
        aktiv: !!s.aktiv,
        daemmung_mm: sanitizeStr(s.daemmung_mm, 8),
        notiz: sanitizeStr(s.notiz, MAX_PROJECT_TEXT_LEN)
      };
    } else if (cat.type === "perGeschoss"){
      const pg = {};
      if (s.perGeschoss && typeof s.perGeschoss === "object"){
        for (const k in s.perGeschoss){
          const e = s.perGeschoss[k];
          if (!e || typeof e !== "object") continue;
          const variantKey = (cat.variants || []).some(v => v.key === e.variant) ? e.variant : null;
          pg[sanitizeLabel(k, 24)] = {
            variant: variantKey,
            schichten: sanitizeSchichten(e.schichten),
            notiz: sanitizeStr(e.notiz, MAX_PROJECT_TEXT_LEN)
          };
        }
      }
      clean[id] = { perGeschoss: pg, notiz: sanitizeStr(s.notiz, MAX_PROJECT_TEXT_LEN) };
    } else if (cat.type === "multiVariant"){
      const vs = {};
      if (s.varianten && typeof s.varianten === "object"){
        for (const v of cat.variants){
          const e = s.varianten[v.key];
          if (!e || typeof e !== "object") continue;
          const fpg = {};
          if (v.hasFassade && e.fassadePerGeschoss && typeof e.fassadePerGeschoss === "object" && cat.fassaden){
            const validKeys = new Set(cat.fassaden.map(f => f.key));
            for (const gk in e.fassadePerGeschoss){
              if (validKeys.has(e.fassadePerGeschoss[gk])){
                fpg[sanitizeLabel(gk, 12)] = e.fassadePerGeschoss[gk];
              }
            }
          }
          vs[v.key] = {
            aktiv: !!e.aktiv,
            schichten: sanitizeSchichten(e.schichten),
            fassadePerGeschoss: fpg
          };
        }
      }
      clean[id] = { varianten: vs, notiz: sanitizeStr(s.notiz, MAX_PROJECT_TEXT_LEN) };
    } else if (cat.type === "fenster"){
      const validRahmen = new Set(cat.rahmenOptionen.map(o => o.key));
      const verschVK = new Set(cat.verschattungOptionen.map(o => o.key));
      const vs = {};
      if (s.verschattungen && typeof s.verschattungen === "object"){
        for (const k in s.verschattungen){
          if (verschVK.has(k)){
            vs[k] = sanitizeStr(s.verschattungen[k], MAX_PROJECT_TEXT_LEN);
          }
        }
      }
      clean[id] = {
        rahmen: validRahmen.has(s.rahmen) ? s.rahmen : null,
        dachfenster: !!s.dachfenster,
        verschattungen: vs,
        notiz: sanitizeStr(s.notiz, MAX_PROJECT_TEXT_LEN)
      };
    } else if (cat.type === "steildach"){
      const validInnen = new Set((cat.innenausfuehrung || []).map(o => o.key));
      clean[id] = {
        aktiv: !!s.aktiv,
        schichten: sanitizeSchichten(s.schichten),
        innen: validInnen.has(s.innen) ? s.innen : null,
        innenSchichten: sanitizeSchichten(s.innenSchichten),
        notiz: sanitizeStr(s.notiz, MAX_PROJECT_TEXT_LEN)
      };
    } else {
      const variantKey = (cat.variants || []).some(v => v.key === s.variant) ? s.variant : null;
      clean[id] = {
        variant: variantKey,
        schichten: sanitizeSchichten(s.schichten),
        notiz: sanitizeStr(s.notiz, MAX_PROJECT_TEXT_LEN)
      };
    }
  }
  p.bauteile = clean;
  return p;
}

function sanitizeSchichten(raw){
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const k in raw){
    if (typeof k !== "string" || k.length > 32) continue;
    const v = raw[k];
    if (typeof v === "string" && v.length <= 8){
      out[k] = v;
    } else if (typeof v === "number" && isFinite(v)){
      out[k] = String(v);
    }
  }
  return out;
}


// ════════════════════════════════════════════════════════════════════════════
// SEKTIONEN 4-8 — Anlagentechnik & Hülle
// ════════════════════════════════════════════════════════════════════════════

// ─── Kataloge ──────────────────────────────────────────────────────

const HEIZUNG_TECHNIK = [
  {
    key: "waermepumpe",
    title: "Wärmepumpe",
    subTypes: [
      { key: "luftWasser",  label: "Luft-Wasser" },
      { key: "soleWasser",  label: "Sole-Wasser" },
      { key: "luftLuft",    label: "Luft-Luft" },
      { key: "wasserWasser",label: "Wasser-Wasser" }
    ]
  },
  { key: "pellet",       title: "Pelletkessel" },
  { key: "scheitholz",   title: "Scheitholzkessel" },
  { key: "hackschnitzel",title: "Holzhackschnitzelkessel" },
  {
    key: "waermenetz",
    title: "Wärmenetz",
    note: "Annahme für Eingabe Hottgenroth · Wert bauvorhabenbezogen bei Matthias Kilian anfragen",
    extras: [
      { key: "beheizteFlaeche", label: "Beheizte Fläche",       unit: "m²" },
      { key: "leistungWmqm",    label: "Leistung",              unit: "W/m²", hint: "EFH max. 5 Pers. z.B. 32 W/m²" },
      { key: "leistungKw",      label: "Gesamtleistung",        unit: "kW" }
    ]
  },
  {
    key: "elektroHk",
    title: "Elektrische Heizkörper",
    raeumePresets: ["Bad", "WC"]   // freie Raum-Liste, vorgeschlagen
  }
];

const VERTEIL_OPTIONEN = [
  { key: "fbh",       label: "Fußbodenheizung" },
  { key: "heizkoerper", label: "Heizkörper" },
  { key: "luft",      label: "Luft" }
];

const LUEFTUNG_OPTIONEN = [
  { key: "zentralWrg",   label: "zentral (mit WRG)" },
  { key: "dezentralWrg", label: "dezentral (mit WRG)" },
  { key: "fensterfalz",  label: "Fensterfalzlüfter" },
  { key: "manuell",      label: "manuell (Fensterlüftung)" }
];

const PV_STATUS = [
  { key: "gewuenscht",  label: "gewünscht" },
  { key: "vorgegeben",  label: "gesetzlich vorgeschrieben" }
];

const PV_DEFAULT_PRODUKTE = {
  aufdach: {
    hersteller: "Trina Solar",
    modul:      "102 × TSM-440-NEG9RC.27 VERTEX"
  },
  indach: {
    hersteller: "CS-Wismar",
    modul:      "Integration Glas-Glas 330M60 full Black und SOLRIF"
  }
};

const HUELLE_OPTIONEN = [
  { key: "ganz",         label: "gesamtes Gebäude" },
  { key: "ohneKeller",   label: "ohne Keller" },
  { key: "mitKtr",       label: "mit Kellertreppenraum" },
  { key: "ohneTreppe",   label: "ohne Treppenhaus" }
];

// ─── State-Helpers ─────────────────────────────────────────────────

function ensureHeizungState(p){
  if (!p.heizung || typeof p.heizung !== "object" || Array.isArray(p.heizung)) {
    p.heizung = {};
  }
  if (!p.heizung.techniken) p.heizung.techniken = {};
  if (!p.heizung.warmwasser) p.heizung.warmwasser = { typen: {}, speicherLiter: "" };
  if (typeof p.heizung.pufferspeicherLiter !== "string") p.heizung.pufferspeicherLiter = "";
  if (typeof p.heizung.notiz !== "string") p.heizung.notiz = "";
  return p.heizung;
}

function ensureVerteilState(p){
  if (!p.verteil || typeof p.verteil !== "object" || Array.isArray(p.verteil)) {
    p.verteil = {};
  }
  if (!p.verteil.aktiv) p.verteil.aktiv = {};
  if (typeof p.verteil.notiz !== "string") p.verteil.notiz = "";
  return p.verteil;
}

function ensureLueftungState(p){
  if (!p.lueftung || typeof p.lueftung !== "object" || Array.isArray(p.lueftung)) {
    p.lueftung = {};
  }
  if (!p.lueftung.typ) p.lueftung.typ = null;
  if (typeof p.lueftung.notiz !== "string") p.lueftung.notiz = "";
  return p.lueftung;
}

function ensurePvState(p){
  if (!p.pv || typeof p.pv !== "object" || Array.isArray(p.pv)) {
    p.pv = {};
  }
  if (!p.pv.status) p.pv.status = null;
  if (typeof p.pv.groesse !== "string") p.pv.groesse = "";
  if (typeof p.pv.ausrichtung !== "string") p.pv.ausrichtung = "";
  if (!p.pv.aufdach) p.pv.aufdach = { aktiv: false, hersteller: "", modul: "" };
  if (!p.pv.indach)  p.pv.indach  = { aktiv: false, hersteller: "", modul: "" };
  if (typeof p.pv.notiz !== "string") p.pv.notiz = "";
  return p.pv;
}

function ensureHuelleState(p){
  if (!p.huelle || typeof p.huelle !== "object" || Array.isArray(p.huelle)) {
    p.huelle = {};
  }
  if (!p.huelle.umfang) p.huelle.umfang = null;
  if (typeof p.huelle.kritischeRaeume !== "string") p.huelle.kritischeRaeume = "";
  if (typeof p.huelle.notiz !== "string") p.huelle.notiz = "";
  return p.huelle;
}

// ─── sectionHasData ────────────────────────────────────────────────

function sectionHasDataHeizung(p){
  const s = p.heizung;
  if (!s || typeof s !== "object") return false;
  if (s.techniken){
    for (const k in s.techniken){
      if (s.techniken[k] && s.techniken[k].aktiv) return true;
    }
  }
  if (s.pufferspeicherLiter && s.pufferspeicherLiter.trim()) return true;
  if (s.warmwasser && s.warmwasser.typen){
    for (const k in s.warmwasser.typen){
      if (s.warmwasser.typen[k]) return true;
    }
    if (s.warmwasser.speicherLiter && s.warmwasser.speicherLiter.trim()) return true;
  }
  if (s.notiz && s.notiz.trim()) return true;
  return false;
}

function sectionHasDataVerteil(p){
  const s = p.verteil;
  if (!s) return false;
  if (s.aktiv){
    for (const k in s.aktiv){ if (s.aktiv[k]) return true; }
  }
  if (s.notiz && s.notiz.trim()) return true;
  return false;
}

function sectionHasDataLueftung(p){
  const s = p.lueftung;
  if (!s) return false;
  if (s.typ) return true;
  if (s.notiz && s.notiz.trim()) return true;
  return false;
}

function sectionHasDataPv(p){
  const s = p.pv;
  if (!s) return false;
  if (s.status) return true;
  if ((s.groesse && s.groesse.trim()) || (s.ausrichtung && s.ausrichtung.trim())) return true;
  if (s.aufdach && s.aufdach.aktiv) return true;
  if (s.indach && s.indach.aktiv) return true;
  if (s.notiz && s.notiz.trim()) return true;
  return false;
}

function sectionHasDataHuelle(p){
  const s = p.huelle;
  if (!s) return false;
  if (s.umfang) return true;
  if (s.kritischeRaeume && s.kritischeRaeume.trim()) return true;
  if (s.notiz && s.notiz.trim()) return true;
  return false;
}

// ─── DOM-Helper für die Anlagensektionen ──────────────────────────

function makeFieldRow(label, hint, value, placeholder, onInput, mono){
  const card = document.createElement("div");
  card.className = "step-card";
  const lab = document.createElement("div");
  lab.className = "step-card-label";
  lab.textContent = label;
  if (hint){
    const h = document.createElement("span");
    h.className = "step-card-hint";
    h.textContent = "· " + hint;
    lab.append(" ", h);
  }
  card.append(lab);
  const inp = document.createElement("input");
  inp.type = "text";
  inp.className = "wiz-input" + (mono ? " mono" : "");
  inp.maxLength = MAX_PROJECT_TEXT_LEN;
  if (placeholder) inp.placeholder = placeholder;
  inp.value = value || "";
  inp.addEventListener("input", () => onInput(inp.value));
  card.append(inp);
  return card;
}

function makePillToggleCard(label, hint, items, isActiveFn, onToggle){
  const card = document.createElement("div");
  card.className = "step-card";
  const lab = document.createElement("div");
  lab.className = "step-card-label";
  lab.textContent = label;
  if (hint){
    const h = document.createElement("span");
    h.className = "step-card-hint";
    h.textContent = "· " + hint;
    lab.append(" ", h);
  }
  card.append(lab);

  const grid = document.createElement("div");
  grid.className = "option-pills";
  for (const it of items){
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-pill";
    if (isActiveFn(it.key)) btn.classList.add("active");
    btn.textContent = it.label;
    btn.addEventListener("click", () => onToggle(it.key));
    grid.append(btn);
  }
  card.append(grid);
  return card;
}

function makeCheckboxCard(label, checked, onChange){
  const card = document.createElement("div");
  card.className = "step-card";
  card.style.padding = "0";
  const row = document.createElement("button");
  row.type = "button";
  row.className = "checkbox-row";
  row.style.background = "transparent";
  row.style.border = "none";
  row.style.padding = "12px 14px";
  row.style.width = "100%";
  if (checked) row.classList.add("checked");
  const box = document.createElement("span");
  box.className = "box";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const poly = document.createElementNS(svgNS, "polyline");
  poly.setAttribute("points", "5 12 10 17 19 7");
  svg.append(poly);
  box.append(svg);
  const labEl = document.createElement("span");
  labEl.className = "label";
  labEl.textContent = label;
  row.append(box, labEl);
  row.addEventListener("click", () => {
    const newVal = !row.classList.contains("checked");
    onChange(newVal);
  });
  card.append(row);
  return card;
}

// ─── Sektion 4: Heizung & Warmwasser ────────────────────────────────
function renderSection4(p){
  clearChildren(wizardContainer);
  const state = ensureHeizungState(p);

  // ── Heizungstechnik ──
  const grpTitle = document.createElement("div");
  grpTitle.style.fontFamily = "var(--font-display)";
  grpTitle.style.fontSize = "16px";
  grpTitle.style.fontWeight = "500";
  grpTitle.style.color = "var(--text)";
  grpTitle.style.marginBottom = "10px";
  grpTitle.textContent = "Heizungstechnik";
  wizardContainer.append(grpTitle);

  const grpHint = document.createElement("div");
  grpHint.style.fontSize = "11px";
  grpHint.style.color = "var(--text-2)";
  grpHint.style.marginBottom = "12px";
  grpHint.textContent = "Mehrere Techniken kombinierbar (z.B. Wärmepumpe + elektr. Heizkörper im Bad)";
  wizardContainer.append(grpHint);

  for (const t of HEIZUNG_TECHNIK){
    const card = document.createElement("div");
    card.className = "step-card";

    const tEntry = state.techniken[t.key] || { aktiv: false };
    const isAktiv = !!tEntry.aktiv;

    // Aktivierungs-Zeile
    const row = document.createElement("button");
    row.type = "button";
    row.className = "checkbox-row";
    row.style.margin = "-16px";
    row.style.padding = "14px 16px";
    row.style.borderRadius = "12px";
    if (isAktiv) row.classList.add("checked");
    const box = document.createElement("span");
    box.className = "box";
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "5 12 10 17 19 7");
    svg.append(poly);
    box.append(svg);
    const lab = document.createElement("span");
    lab.className = "label";
    lab.textContent = t.title;
    row.append(box, lab);
    row.addEventListener("click", () => {
      if (!state.techniken[t.key]) state.techniken[t.key] = { aktiv: true };
      else state.techniken[t.key].aktiv = !state.techniken[t.key].aktiv;
      touchActive();
      renderSection4(p);
      renderWizardChrome();
    });
    card.append(row);

    // Detail-Felder nur bei aktiv
    if (isAktiv){
      const details = document.createElement("div");
      details.style.marginTop = "12px";
      details.style.paddingTop = "12px";
      details.style.borderTop = "1px solid var(--border)";

      // Sub-Typen bei Wärmepumpe — Einzelauswahl
      if (t.subTypes){
        const subLab = document.createElement("div");
        subLab.style.fontSize = "11px";
        subLab.style.color = "var(--text-2)";
        subLab.style.marginBottom = "6px";
        subLab.textContent = "Bauart";
        details.append(subLab);
        const subGrid = document.createElement("div");
        subGrid.className = "option-pills";
        subGrid.style.marginBottom = "10px";
        for (const st of t.subTypes){
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = "option-pill";
          if (tEntry.subType === st.key) pill.classList.add("active");
          pill.textContent = st.label;
          pill.addEventListener("click", () => {
            tEntry.subType = (tEntry.subType === st.key) ? null : st.key;
            touchActive();
            renderSection4(p);
            renderWizardChrome();
          });
          subGrid.append(pill);
        }
        details.append(subGrid);
      }

      // Extras (Wärmenetz: Fläche/Leistung)
      if (t.extras){
        for (const ex of t.extras){
          const exLab = document.createElement("div");
          exLab.style.fontSize = "11px";
          exLab.style.color = "var(--text-2)";
          exLab.style.marginTop = "8px";
          exLab.style.marginBottom = "4px";
          exLab.append(document.createTextNode(ex.label));
          if (ex.hint){
            const hintSpan = document.createElement("span");
            hintSpan.style.color = "var(--text-3)";
            hintSpan.style.marginLeft = "4px";
            hintSpan.textContent = "· " + ex.hint;
            exLab.append(hintSpan);
          }
          details.append(exLab);
          const flex = document.createElement("div");
          flex.style.display = "grid";
          flex.style.gridTemplateColumns = "1fr 36px";
          flex.style.gap = "8px";
          flex.style.alignItems = "center";
          const inp = document.createElement("input");
          inp.type = "text";
          inp.className = "wiz-input mono";
          inp.maxLength = 12;
          inp.value = (tEntry.extras && tEntry.extras[ex.key]) || "";
          inp.addEventListener("input", () => {
            if (!tEntry.extras) tEntry.extras = {};
            tEntry.extras[ex.key] = sanitizeStr(inp.value, 12);
            touchActive();
          });
          const unit = document.createElement("span");
          unit.style.fontFamily = "var(--font-mono)";
          unit.style.fontSize = "11px";
          unit.style.color = "var(--text-3)";
          unit.textContent = ex.unit;
          flex.append(inp, unit);
          details.append(flex);
        }
      }

      // Hersteller / Modell (frei)
      const hmGrid = document.createElement("div");
      hmGrid.style.marginTop = "10px";
      hmGrid.style.display = "grid";
      hmGrid.style.gap = "8px";

      for (const k of ["hersteller", "modell"]){
        const label = (k === "hersteller") ? "Hersteller" : "Modell";
        const wrap = document.createElement("div");
        const wLab = document.createElement("div");
        wLab.style.fontSize = "11px";
        wLab.style.color = "var(--text-2)";
        wLab.style.marginBottom = "4px";
        wLab.textContent = label;
        const inp = document.createElement("input");
        inp.type = "text";
        inp.className = "wiz-input";
        inp.maxLength = MAX_PROJECT_TEXT_LEN;
        inp.value = tEntry[k] || "";
        inp.addEventListener("input", () => {
          tEntry[k] = sanitizeStr(inp.value, MAX_PROJECT_TEXT_LEN);
          touchActive();
        });
        wrap.append(wLab, inp);
        hmGrid.append(wrap);
      }
      details.append(hmGrid);

      // Räume (für elektrische Heizkörper)
      if (t.raeumePresets){
        const rLab = document.createElement("div");
        rLab.style.fontSize = "11px";
        rLab.style.color = "var(--text-2)";
        rLab.style.marginTop = "10px";
        rLab.style.marginBottom = "4px";
        rLab.append(document.createTextNode("Räume "));
        const hint = document.createElement("span");
        hint.style.color = "var(--text-3)";
        hint.textContent = "· z.B. " + t.raeumePresets.join(", ");
        rLab.append(hint);
        details.append(rLab);
        const inp = document.createElement("input");
        inp.type = "text";
        inp.className = "wiz-input";
        inp.maxLength = MAX_PROJECT_TEXT_LEN;
        inp.placeholder = t.raeumePresets.join(", ");
        inp.value = tEntry.raeume || "";
        inp.addEventListener("input", () => {
          tEntry.raeume = sanitizeStr(inp.value, MAX_PROJECT_TEXT_LEN);
          touchActive();
        });
        details.append(inp);
      }

      // Hinweis-Text
      if (t.note){
        const noteEl = document.createElement("div");
        noteEl.style.fontSize = "11px";
        noteEl.style.color = "var(--text-2)";
        noteEl.style.marginTop = "10px";
        noteEl.style.fontStyle = "italic";
        noteEl.textContent = t.note;
        details.append(noteEl);
      }

      card.append(details);

      // State zurückschreiben (falls neu angelegt)
      state.techniken[t.key] = tEntry;
    }

    wizardContainer.append(card);
  }

  // Pufferspeicher
  wizardContainer.append(makeFieldRow(
    "Pufferspeicher", "in Liter",
    state.pufferspeicherLiter,
    "z.B. 800",
    val => { state.pufferspeicherLiter = sanitizeStr(val, 12); touchActive(); },
    true  // mono
  ));

  // ── Warmwasserbereitung ──
  const wwTitle = document.createElement("div");
  wwTitle.style.fontFamily = "var(--font-display)";
  wwTitle.style.fontSize = "16px";
  wwTitle.style.fontWeight = "500";
  wwTitle.style.color = "var(--text)";
  wwTitle.style.marginTop = "24px";
  wwTitle.style.marginBottom = "10px";
  wwTitle.textContent = "Warmwasserbereitung";
  wizardContainer.append(wwTitle);

  // Toggles
  wizardContainer.append(makePillToggleCard(
    "Bereitungsart", "Mehrfachauswahl möglich",
    [
      { key: "zentral",          label: "über zentrale Heizungsanlage" },
      { key: "dezentral",        label: "über dezentrale Anlage" },
      { key: "brauchwasserWp",   label: "Brauchwasser-Wärmepumpe" }
    ],
    k => !!(state.warmwasser.typen && state.warmwasser.typen[k]),
    k => {
      state.warmwasser.typen[k] = !state.warmwasser.typen[k];
      touchActive();
      renderSection4(p);
      renderWizardChrome();
    }
  ));

  // WW-Speicher Liter
  wizardContainer.append(makeFieldRow(
    "WW-Speicher", "in Liter",
    state.warmwasser.speicherLiter,
    "z.B. 300",
    val => { state.warmwasser.speicherLiter = sanitizeStr(val, 12); touchActive(); },
    true
  ));

  // Notiz
  wizardContainer.append(makeNotizFeld(state.notiz || "", val => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }, "Notiz · Besonderheiten zur Anlagentechnik"));
}

// ─── Sektion 5: Verteilsystem ───────────────────────────────────────
function renderSection5(p){
  clearChildren(wizardContainer);
  const state = ensureVerteilState(p);

  wizardContainer.append(makePillToggleCard(
    "Verteilsystem", "Mehrfachauswahl möglich",
    VERTEIL_OPTIONEN,
    k => !!state.aktiv[k],
    k => {
      state.aktiv[k] = !state.aktiv[k];
      touchActive();
      renderSection5(p);
      renderWizardChrome();
    }
  ));

  wizardContainer.append(makeNotizFeld(state.notiz || "", val => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }, "Notiz · Besonderheiten"));
}

// ─── Sektion 6: Lüftung ─────────────────────────────────────────────
function renderSection6(p){
  clearChildren(wizardContainer);
  const state = ensureLueftungState(p);

  // Einzelwahl
  wizardContainer.append(makePillToggleCard(
    "Lüftungsart", "eine Wahl pro Gebäude",
    LUEFTUNG_OPTIONEN,
    k => state.typ === k,
    k => {
      state.typ = (state.typ === k) ? null : k;
      touchActive();
      renderSection6(p);
      renderWizardChrome();
    }
  ));

  wizardContainer.append(makeNotizFeld(state.notiz || "", val => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }, "Notiz · Besonderheiten"));
}

// ─── Sektion 7: PV-Anlage ───────────────────────────────────────────
function renderSection7(p){
  clearChildren(wizardContainer);
  const state = ensurePvState(p);

  // Status
  wizardContainer.append(makePillToggleCard(
    "Status", "",
    PV_STATUS,
    k => state.status === k,
    k => {
      state.status = (state.status === k) ? null : k;
      touchActive();
      renderSection7(p);
      renderWizardChrome();
    }
  ));

  // Größe + Ausrichtung
  wizardContainer.append(makeFieldRow(
    "Größe", "z.B. kWp oder m²",
    state.groesse,
    "frei eintragen",
    val => { state.groesse = sanitizeStr(val, MAX_PROJECT_TEXT_LEN); touchActive(); }
  ));
  wizardContainer.append(makeFieldRow(
    "Ausrichtung", "z.B. Süd, Ost/West, 30° Neigung",
    state.ausrichtung,
    "frei eintragen",
    val => { state.ausrichtung = sanitizeStr(val, MAX_PROJECT_TEXT_LEN); touchActive(); }
  ));

  // Produkt-Wahl
  const prodTitle = document.createElement("div");
  prodTitle.style.fontFamily = "var(--font-display)";
  prodTitle.style.fontSize = "16px";
  prodTitle.style.fontWeight = "500";
  prodTitle.style.color = "var(--text)";
  prodTitle.style.marginTop = "20px";
  prodTitle.style.marginBottom = "4px";
  prodTitle.textContent = "Standard-Produkte (Ersteingabe)";
  wizardContainer.append(prodTitle);
  const prodHint = document.createElement("div");
  prodHint.style.fontSize = "11px";
  prodHint.style.color = "var(--text-2)";
  prodHint.style.marginBottom = "10px";
  prodHint.textContent = "Vorschlag wenn kein Angebot vorliegt · Hersteller/Modul sind editierbar";
  wizardContainer.append(prodHint);

  for (const kind of ["aufdach", "indach"]){
    const cardTitle = (kind === "aufdach") ? "Aufdach" : "Indach";
    const cardState = state[kind];

    const card = document.createElement("div");
    card.className = "step-card";

    // Aktivierungs-Häkchen
    const row = document.createElement("button");
    row.type = "button";
    row.className = "checkbox-row";
    row.style.margin = "-16px";
    row.style.padding = "14px 16px";
    row.style.borderRadius = "12px";
    if (cardState.aktiv) row.classList.add("checked");
    const box = document.createElement("span");
    box.className = "box";
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const poly = document.createElementNS(svgNS, "polyline");
    poly.setAttribute("points", "5 12 10 17 19 7");
    svg.append(poly);
    box.append(svg);
    const lab = document.createElement("span");
    lab.className = "label";
    lab.textContent = cardTitle;
    row.append(box, lab);
    row.addEventListener("click", () => {
      cardState.aktiv = !cardState.aktiv;
      // Beim ersten Aktivieren mit Defaults befüllen, wenn noch leer
      if (cardState.aktiv){
        if (!cardState.hersteller) cardState.hersteller = PV_DEFAULT_PRODUKTE[kind].hersteller;
        if (!cardState.modul)      cardState.modul      = PV_DEFAULT_PRODUKTE[kind].modul;
      }
      touchActive();
      renderSection7(p);
      renderWizardChrome();
    });
    card.append(row);

    if (cardState.aktiv){
      const details = document.createElement("div");
      details.style.marginTop = "12px";
      details.style.paddingTop = "12px";
      details.style.borderTop = "1px solid var(--border)";

      for (const k of ["hersteller", "modul"]){
        const wrap = document.createElement("div");
        wrap.style.marginBottom = "8px";
        const wLab = document.createElement("div");
        wLab.style.fontSize = "11px";
        wLab.style.color = "var(--text-2)";
        wLab.style.marginBottom = "4px";
        wLab.style.display = "flex";
        wLab.style.alignItems = "center";
        wLab.style.gap = "8px";
        const labText = document.createElement("span");
        labText.textContent = (k === "hersteller") ? "Hersteller" : "Modul";
        wLab.append(labText);
        // Reset-Button — immer im DOM, Sichtbarkeit per style
        const reset = document.createElement("button");
        reset.type = "button";
        reset.className = "ab-reset";
        reset.textContent = "auf Default";
        const isModified = () => cardState[k] !== PV_DEFAULT_PRODUKTE[kind][k];
        reset.style.display = isModified() ? "" : "none";
        reset.addEventListener("click", () => {
          cardState[k] = PV_DEFAULT_PRODUKTE[kind][k];
          touchActive();
          renderSection7(p);
          renderWizardChrome();
        });
        wLab.append(reset);

        const inp = document.createElement("input");
        inp.type = "text";
        inp.className = "wiz-input";
        inp.maxLength = MAX_PROJECT_TEXT_LEN;
        inp.value = cardState[k] || "";
        inp.addEventListener("input", () => {
          cardState[k] = sanitizeStr(inp.value, MAX_PROJECT_TEXT_LEN);
          touchActive();
          // Reset-Button-Sichtbarkeit live umschalten ohne Full-Render
          reset.style.display = isModified() ? "" : "none";
        });
        wrap.append(wLab, inp);
        details.append(wrap);
      }

      card.append(details);
    }
    wizardContainer.append(card);
  }

  wizardContainer.append(makeNotizFeld(state.notiz || "", val => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }, "Notiz · Besonderheiten"));
}

// ─── Sektion 8: Thermische Hülle + Sommerlicher Wärmeschutz ─────────
function renderSection8(p){
  clearChildren(wizardContainer);
  const state = ensureHuelleState(p);

  // Umfang Hülle — Einzelwahl
  wizardContainer.append(makePillToggleCard(
    "Umfang der thermischen Hülle", "eine Wahl",
    HUELLE_OPTIONEN,
    k => state.umfang === k,
    k => {
      state.umfang = (state.umfang === k) ? null : k;
      touchActive();
      renderSection8(p);
      renderWizardChrome();
    }
  ));

  // Sommerlicher Wärmeschutz
  const swTitle = document.createElement("div");
  swTitle.style.fontFamily = "var(--font-display)";
  swTitle.style.fontSize = "16px";
  swTitle.style.fontWeight = "500";
  swTitle.style.color = "var(--text)";
  swTitle.style.marginTop = "20px";
  swTitle.style.marginBottom = "10px";
  swTitle.textContent = "Sommerlicher Wärmeschutz";
  wizardContainer.append(swTitle);

  wizardContainer.append(makeFieldRow(
    "Kritische Räume", "z.B. Schlafzimmer DG Südseite",
    state.kritischeRaeume,
    "Räume mit erhöhter Aufheizgefahr eintragen",
    val => { state.kritischeRaeume = sanitizeStr(val, MAX_PROJECT_TEXT_LEN); touchActive(); }
  ));

  // Notiz
  wizardContainer.append(makeNotizFeld(state.notiz || "", val => {
    state.notiz = sanitizeStr(val, MAX_PROJECT_TEXT_LEN);
    touchActive();
  }, "Notiz · Besonderheiten"));
}

// ─── Sanitisierung für Sektionen 4-8 (Import/Reload) ────────────────

function sanitizeSection4(raw){
  const out = { techniken: {}, pufferspeicherLiter: "", warmwasser: { typen: {}, speicherLiter: "" }, notiz: "" };
  if (!raw || typeof raw !== "object") return out;
  out.pufferspeicherLiter = sanitizeStr(raw.pufferspeicherLiter, 12);
  out.notiz = sanitizeStr(raw.notiz, MAX_PROJECT_TEXT_LEN);
  if (raw.techniken && typeof raw.techniken === "object"){
    for (const t of HEIZUNG_TECHNIK){
      const e = raw.techniken[t.key];
      if (!e || typeof e !== "object") continue;
      const clean = { aktiv: !!e.aktiv };
      if (t.subTypes){
        const validSub = new Set(t.subTypes.map(s => s.key));
        if (validSub.has(e.subType)) clean.subType = e.subType;
      }
      if (t.extras){
        clean.extras = {};
        const validEx = new Set(t.extras.map(x => x.key));
        if (e.extras && typeof e.extras === "object"){
          for (const k in e.extras){
            if (validEx.has(k)) clean.extras[k] = sanitizeStr(e.extras[k], 12);
          }
        }
      }
      clean.hersteller = sanitizeStr(e.hersteller, MAX_PROJECT_TEXT_LEN);
      clean.modell     = sanitizeStr(e.modell,     MAX_PROJECT_TEXT_LEN);
      if (t.raeumePresets) clean.raeume = sanitizeStr(e.raeume, MAX_PROJECT_TEXT_LEN);
      out.techniken[t.key] = clean;
    }
  }
  if (raw.warmwasser && typeof raw.warmwasser === "object"){
    if (raw.warmwasser.typen && typeof raw.warmwasser.typen === "object"){
      const valid = new Set(["zentral", "dezentral", "brauchwasserWp"]);
      for (const k in raw.warmwasser.typen){
        if (valid.has(k)) out.warmwasser.typen[k] = !!raw.warmwasser.typen[k];
      }
    }
    out.warmwasser.speicherLiter = sanitizeStr(raw.warmwasser.speicherLiter, 12);
  }
  return out;
}

function sanitizeSection5(raw){
  const out = { aktiv: {}, notiz: "" };
  if (!raw || typeof raw !== "object") return out;
  out.notiz = sanitizeStr(raw.notiz, MAX_PROJECT_TEXT_LEN);
  if (raw.aktiv && typeof raw.aktiv === "object"){
    const valid = new Set(VERTEIL_OPTIONEN.map(o => o.key));
    for (const k in raw.aktiv){
      if (valid.has(k)) out.aktiv[k] = !!raw.aktiv[k];
    }
  }
  return out;
}

function sanitizeSection6(raw){
  const out = { typ: null, notiz: "" };
  if (!raw || typeof raw !== "object") return out;
  out.notiz = sanitizeStr(raw.notiz, MAX_PROJECT_TEXT_LEN);
  const valid = new Set(LUEFTUNG_OPTIONEN.map(o => o.key));
  if (valid.has(raw.typ)) out.typ = raw.typ;
  return out;
}

function sanitizeSection7(raw){
  const out = {
    status: null, groesse: "", ausrichtung: "",
    aufdach: { aktiv: false, hersteller: "", modul: "" },
    indach:  { aktiv: false, hersteller: "", modul: "" },
    notiz: ""
  };
  if (!raw || typeof raw !== "object") return out;
  out.notiz = sanitizeStr(raw.notiz, MAX_PROJECT_TEXT_LEN);
  out.groesse = sanitizeStr(raw.groesse, MAX_PROJECT_TEXT_LEN);
  out.ausrichtung = sanitizeStr(raw.ausrichtung, MAX_PROJECT_TEXT_LEN);
  const validStatus = new Set(PV_STATUS.map(o => o.key));
  if (validStatus.has(raw.status)) out.status = raw.status;
  for (const k of ["aufdach", "indach"]){
    const e = raw[k];
    if (e && typeof e === "object"){
      out[k].aktiv      = !!e.aktiv;
      out[k].hersteller = sanitizeStr(e.hersteller, MAX_PROJECT_TEXT_LEN);
      out[k].modul      = sanitizeStr(e.modul,      MAX_PROJECT_TEXT_LEN);
    }
  }
  return out;
}

function sanitizeSection8(raw){
  const out = { umfang: null, kritischeRaeume: "", notiz: "" };
  if (!raw || typeof raw !== "object") return out;
  out.notiz = sanitizeStr(raw.notiz, MAX_PROJECT_TEXT_LEN);
  out.kritischeRaeume = sanitizeStr(raw.kritischeRaeume, MAX_PROJECT_TEXT_LEN);
  const valid = new Set(HUELLE_OPTIONEN.map(o => o.key));
  if (valid.has(raw.umfang)) out.umfang = raw.umfang;
  return out;
}


// ════════════════════════════════════════════════════════════════════════════
// PDF-AUSGABE — Projektkartei als 2-3-Seiten-PDF im LACZY-Stil
// ════════════════════════════════════════════════════════════════════════════

// Farben (LACZY-Stil, RGB für jsPDF)
const PDF_COLORS = {
  bg:        [251, 248, 241],  // var(--surface) warmes Papier
  text:      [42, 47, 38],     // var(--text) dunkles Olivgrün
  text2:     [107, 116, 102],  // var(--text-2) gedämpft
  text3:     [163, 158, 142],  // var(--text-3) noch leiser
  border:    [203, 195, 174],  // dezent
  terra:     [168, 104, 64],   // var(--terra-deep)
  sage:      [122, 145, 104],  // var(--sage)
  ruleSoft:  [220, 213, 195]   // Trennlinien fein
};

// A4 Maße (jsPDF mm)
const PDF_PAGE = {
  width: 210, height: 297,
  marginX: 18, marginTop: 18, marginBottom: 18,
  contentWidth: 174  // 210 − 2×18
};

// Schriftarten-Pfade
const PDF_FONTS = [
  { file: "libs/fraunces-regular.ttf", name: "Fraunces",  style: "normal" },
  { file: "libs/fraunces-medium.ttf",  name: "Fraunces",  style: "bold" },
  { file: "libs/dmsans-regular.ttf",   name: "DMSans",    style: "normal" },
  { file: "libs/dmsans-medium.ttf",    name: "DMSans",    style: "bold" }
];

let pdfFontsLoaded = false;
let pdfFontsData = null;

async function loadPdfFonts(){
  if (pdfFontsLoaded) return pdfFontsData;
  const out = {};
  for (const f of PDF_FONTS){
    const res = await fetch(f.file);
    if (!res.ok) throw new Error("Font konnte nicht geladen werden: " + f.file);
    const buf = await res.arrayBuffer();
    // ArrayBuffer → Base64 (jsPDF braucht Base64-VFS)
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    out[f.file] = { b64: btoa(bin), name: f.name, style: f.style };
  }
  pdfFontsData = out;
  pdfFontsLoaded = true;
  return out;
}

// ─── PDF-Builder mit Cursor und Helpern ────────────────────────────
function makePdfBuilder(doc){
  let y = PDF_PAGE.marginTop;
  let pageNo = 1;
  let totalPages = 0;  // wird am Ende gesetzt
  const projectName = { value: "" };  // Closure-Box damit Footer aktualisiert

  function setFont(name, style, size){
    doc.setFont(name, style);
    doc.setFontSize(size);
  }
  function setColor(rgb){
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }
  function setDrawColor(rgb){
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  }
  function setFillColor(rgb){
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  }

  function paintPageBackground(){
    setFillColor(PDF_COLORS.bg);
    doc.rect(0, 0, PDF_PAGE.width, PDF_PAGE.height, "F");
  }

  function pageHeader(){
    // Logo + Subtitle (links)
    setFont("Fraunces", "bold", 22);
    setColor(PDF_COLORS.text);
    doc.text("Laczy", PDF_PAGE.marginX, PDF_PAGE.marginTop + 2);
    setFont("DMSans", "normal", 7);
    setColor(PDF_COLORS.text2);
    doc.text("Projektkartei für die EcoCad-Eingabe",
             PDF_PAGE.marginX, PDF_PAGE.marginTop + 6);

    // Rechts: Datum, Pfad
    setFont("DMSans", "normal", 7);
    setColor(PDF_COLORS.text2);
    const right = PDF_PAGE.width - PDF_PAGE.marginX;
    const today = new Date().toLocaleDateString("de-DE", {
      day: "numeric", month: "long", year: "numeric"
    });
    doc.text(today, right, PDF_PAGE.marginTop + 6, { align: "right" });

    // Terra-Linie unter dem Header
    setDrawColor(PDF_COLORS.terra);
    doc.setLineWidth(0.4);
    doc.line(PDF_PAGE.marginX, PDF_PAGE.marginTop + 9,
             right, PDF_PAGE.marginTop + 9);

    y = PDF_PAGE.marginTop + 14;
  }

  function pageFooter(){
    const bottom = PDF_PAGE.height - PDF_PAGE.marginBottom + 8;
    setDrawColor(PDF_COLORS.ruleSoft);
    doc.setLineWidth(0.2);
    doc.line(PDF_PAGE.marginX, bottom - 3,
             PDF_PAGE.width - PDF_PAGE.marginX, bottom - 3);
    setFont("DMSans", "normal", 6.5);
    setColor(PDF_COLORS.text3);
    doc.text(projectName.value + " · Projektkartei",
             PDF_PAGE.marginX, bottom);
    doc.text("Seite " + pageNo + (totalPages ? " von " + totalPages : ""),
             PDF_PAGE.width - PDF_PAGE.marginX, bottom, { align: "right" });
  }

  function newPage(){
    doc.addPage();
    pageNo++;
    paintPageBackground();
    pageHeader();
    pageFooter();
  }

  // Stellt sicher, dass auf der aktuellen Seite noch `needed` mm Platz ist
  function ensureSpace(needed){
    const bottomLimit = PDF_PAGE.height - PDF_PAGE.marginBottom - 4;
    if (y + needed > bottomLimit){
      newPage();
    }
  }

  // Sektions-Header (Nummer + Titel + Trennlinie)
  function sectionHeader(no, title){
    ensureSpace(11);
    setFont("DMSans", "bold", 7);
    setColor(PDF_COLORS.terra);
    doc.text(no, PDF_PAGE.marginX, y);
    setFont("Fraunces", "bold", 12);
    setColor(PDF_COLORS.text);
    doc.text(title, PDF_PAGE.marginX + 9, y);
    y += 1.8;
    setDrawColor(PDF_COLORS.ruleSoft);
    doc.setLineWidth(0.2);
    doc.line(PDF_PAGE.marginX, y,
             PDF_PAGE.width - PDF_PAGE.marginX, y);
    y += 4;
  }

  // Großer Projekttitel (nur einmal auf Seite 1)
  function projectTitle(name, pfad, gebTyp){
    projectName.value = name;
    setFont("Fraunces", "bold", 20);
    setColor(PDF_COLORS.text);
    doc.text(name, PDF_PAGE.marginX, y + 5);
    y += 9;
    setFont("DMSans", "normal", 8);
    setColor(PDF_COLORS.text2);
    const parts = [];
    if (pfad)   parts.push(pfad);
    if (gebTyp) parts.push(gebTyp);
    if (parts.length){
      doc.text(parts.join(" · "), PDF_PAGE.marginX, y + 2);
      y += 4;
    }
    y += 4;
  }

  // Label-Wert-Zeile in zwei Spalten
  function kvRow(label, value){
    const labelCol = 38;
    const lineH = 4.6;
    ensureSpace(lineH);
    setFont("DMSans", "normal", 8.5);
    setColor(PDF_COLORS.text2);
    doc.text(label, PDF_PAGE.marginX, y);
    setColor(PDF_COLORS.text);
    const valX = PDF_PAGE.marginX + labelCol;
    const valWidth = PDF_PAGE.contentWidth - labelCol;
    const valStr = value || "—";
    const lines = doc.splitTextToSize(valStr, valWidth);
    doc.text(lines, valX, y);
    y += Math.max(lineH, lines.length * 3.8);
  }

  // Drei-Spalten-Bauteil-Zeile: Nr | Label | Wert
  function bauteilRow(nr, label, value){
    const nrCol = 10, labelCol = 36;
    const lineH = 4.0;
    ensureSpace(lineH);
    setFont("DMSans", "bold", 7);
    setColor(PDF_COLORS.terra);
    doc.text(nr, PDF_PAGE.marginX, y);
    setFont("DMSans", "normal", 8);
    setColor(PDF_COLORS.text2);
    // Label clip: lange Bauteil-Titel kürzen mit splitTextToSize, max 1 Zeile
    const labelLines = doc.splitTextToSize(label, labelCol - 1);
    doc.text(labelLines[0], PDF_PAGE.marginX + nrCol, y);
    setColor(PDF_COLORS.text);
    const valX = PDF_PAGE.marginX + nrCol + labelCol;
    const valWidth = PDF_PAGE.contentWidth - nrCol - labelCol;
    const lines = doc.splitTextToSize(value || "—", valWidth);
    doc.text(lines, valX, y);
    y += Math.max(lineH, lines.length * 3.6);
    y += 0.5;
  }

  // Eingerückter Sub-Block (für Fassaden-Matrix etc.)
  function subBlock(title, lines){
    ensureSpace(8 + lines.length * 3.6);
    const x = PDF_PAGE.marginX + 4;
    // Terra-Strich links
    setDrawColor(PDF_COLORS.terra);
    doc.setLineWidth(0.8);
    doc.line(PDF_PAGE.marginX + 2, y - 1,
             PDF_PAGE.marginX + 2, y + 3 + lines.length * 3.6);
    setFont("DMSans", "bold", 6.5);
    setColor(PDF_COLORS.terra);
    doc.text((title || "").toUpperCase(), x, y);
    y += 3.2;
    setFont("DMSans", "normal", 8);
    setColor(PDF_COLORS.text);
    for (const line of lines){
      const wrapped = doc.splitTextToSize(line, PDF_PAGE.contentWidth - 6);
      doc.text(wrapped, x, y);
      y += wrapped.length * 3.6;
    }
    y += 2;
  }

  // Mehrzeilen-Notiz
  function noteBlock(label, text){
    if (!text || !text.trim()) return;
    ensureSpace(8);
    setFont("DMSans", "bold", 6.5);
    setColor(PDF_COLORS.text3);
    doc.text((label || "Notiz").toUpperCase(), PDF_PAGE.marginX, y);
    y += 3;
    setFont("DMSans", "normal", 8);
    setColor(PDF_COLORS.text);
    const lines = doc.splitTextToSize(text, PDF_PAGE.contentWidth);
    ensureSpace(lines.length * 3.6);
    doc.text(lines, PDF_PAGE.marginX, y);
    y += lines.length * 3.6 + 2;
  }

  function spacer(mm){
    y += mm;
  }

  return {
    paintPageBackground, pageHeader, pageFooter, newPage, ensureSpace,
    projectTitle, sectionHeader, kvRow, bauteilRow, subBlock, noteBlock, spacer,
    setPageInfo(p, t){ pageNo = p; totalPages = t; },
    getPageNo(){ return pageNo; },
    setProjectName(n){ projectName.value = n; }
  };
}

// ─── Mapping-Helper: State → Strings ────────────────────────────────
function pdfPfadLabel(p){
  return p.path === "sanierung" ? "Sanierung" : "Neubau";
}
function pdfVorhabenLabel(p){
  if (p.vorhaben === "anbau")   return "Anbau / Aufstockung";
  if (p.vorhaben === "neubau")  return "Neubau";
  return "";
}
function pdfGebTypLabel(p){
  if (p.gebTyp === "efh") return "EFH";
  if (p.gebTyp === "mfh") return "MFH";
  return "";
}
function pdfFoerderLabel(p){
  if (p.foerder === "gewuenscht") return "gewünscht";
  if (p.foerder === "nein")       return "nicht erforderlich";
  return "—";
}

function pdfDachTypLabel(typKey){
  const t = DACH_TYPEN.find(x => x.key === typKey);
  return t ? t.label : (typKey || "—");
}

// Bauteil-Zusammenfassung pro Sektion 3
function pdfBauteilSummary(p, bauteilId){
  const cat = BAUTEIL_CATALOG[bauteilId];
  const state = p.bauteile && p.bauteile[bauteilId];
  if (!state) return "—";

  if (cat.type === "simple"){
    const parts = [];
    if (state.aktiv) parts.push(cat.standardLabel + (state.daemmung_mm ? " · " + state.daemmung_mm + " mm" : ""));
    if (state.notiz) parts.push(state.notiz);
    return parts.length ? parts.join(" · ") : "—";
  }

  if (cat.type === "perGeschoss"){
    const ges = getGeschosseFor(bauteilId, p);
    const lines = [];
    for (const g of ges){
      const e = state.perGeschoss && state.perGeschoss[g.id];
      if (!e || !e.variant) continue;
      const v = findVariant(bauteilId, e.variant);
      if (!v) continue;
      const total = sumSchichten(e, v);
      const mod = hasAnyModification(e, v) ? "*" : "";
      lines.push(g.label + " " + v.title + (total ? " " + total + " mm" : "") + mod);
    }
    return lines.length ? lines.join(" · ") : "—";
  }

  if (cat.type === "multiVariant"){
    const aktive = [];
    for (const v of cat.variants){
      const e = state.varianten && state.varianten[v.key];
      if (!e || !e.aktiv) continue;
      const total = sumSchichten(e, v);
      const mod = hasAnyModification(e, v) ? "*" : "";
      aktive.push(v.tag + (total ? " " + total + " mm" : "") + mod);
    }
    return aktive.length ? aktive.join(" · ") : "—";
  }

  if (cat.type === "fenster"){
    const parts = [];
    if (state.rahmen){
      const r = cat.rahmenOptionen.find(o => o.key === state.rahmen);
      if (r) parts.push("Rahmen " + r.label);
    }
    if (state.dachfenster) parts.push("Dachfenster");
    const versch = [];
    for (const v of cat.verschattungOptionen){
      const val = state.verschattungen && state.verschattungen[v.key];
      if (val && val.trim()) versch.push(v.label + " " + val);
    }
    if (versch.length) parts.push(versch.join(" · "));
    return parts.length ? parts.join(" · ") : "—";
  }

  if (cat.type === "steildach"){
    if (!state.aktiv) return "—";
    const sch = cat.standard.schichten.map(s => {
      const v = (state.schichten && state.schichten[s.key]) || s.def;
      const vStr = (v === "" || v === undefined || v === null) ? "—" : v;
      return s.name + " " + vStr;
    }).join(" · ");
    let result = sch;
    if (state.innen){
      const inn = cat.innenausfuehrung.find(x => x.key === state.innen);
      if (inn){
        const innSch = inn.schichten.map(s => {
          const v = (state.innenSchichten && state.innenSchichten[s.key]) || s.def;
          return s.name + " " + v;
        }).join(" · ");
        result += " · " + inn.title + (innSch ? " (" + innSch + ")" : "");
      }
    }
    return result;
  }

  // single
  if (!state.variant) return "—";
  const v = findVariant(bauteilId, state.variant);
  if (!v) return "—";
  const total = sumSchichten(state, v);
  const mod = hasAnyModification(state, v) ? "*" : "";
  if (v.schichten.length){
    const sch = v.schichten.map(s => {
      const val = (state.schichten && state.schichten[s.key]) || s.def;
      const valStr = (val === "" || val === undefined || val === null) ? "—" : val;
      return s.name + " " + valStr;
    }).join(" · ");
    return v.title + " · " + sch + (total ? " · " + total + " mm" : "") + mod;
  }
  return v.title + mod;
}

// ─── PDF-Hauptfunktion ──────────────────────────────────────────────
async function exportProjectAsPdf(projectId){
  const p = findProject(projectId);
  if (!p){ showToast("Projekt nicht gefunden", "warn"); return; }

  // jsPDF + Fonts vorbereiten
  if (typeof window.jspdf === "undefined" && typeof window.jsPDF === "undefined"){
    showToast("PDF-Bibliothek nicht geladen — bitte neu laden", "warn");
    return;
  }
  const jsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

  showToast("PDF wird erzeugt …");
  let fonts;
  try { fonts = await loadPdfFonts(); }
  catch(e){
    showToast("Schriftarten konnten nicht geladen werden", "warn");
    return;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  // Schriften registrieren
  for (const path in fonts){
    const f = fonts[path];
    const fileName = path.split("/").pop();
    doc.addFileToVFS(fileName, f.b64);
    doc.addFont(fileName, f.name, f.style);
  }

  const b = makePdfBuilder(doc);
  b.setProjectName(p.name);
  b.paintPageBackground();
  b.pageHeader();

  // Projekttitel
  b.projectTitle(p.name, pdfPfadLabel(p), pdfGebTypLabel(p));

  // ── Sektion 1 Objektdaten ──
  b.sectionHeader("01", "Objektdaten");
  if (p.path === "neubau"){
    b.kvRow("Vorhaben",     pdfVorhabenLabel(p));
  } else {
    b.kvRow("Baujahr",      p.baujahr);
    b.kvRow("Energieausweis", p.energieausweisVorhanden ? "vorhanden" : "—");
    if (p.bisherigeMassnahmen && p.bisherigeMassnahmen.length){
      for (const m of p.bisherigeMassnahmen){
        if (!m.jahr && !m.massnahme) continue;
        b.kvRow(m.jahr || "—", m.massnahme || "—");
      }
    }
  }
  b.kvRow("Gebäudetyp",   pdfGebTypLabel(p));
  b.kvRow("Adresse",      p.adresse);
  b.kvRow("Fördergelder", pdfFoerderLabel(p));
  b.spacer(2);

  // ── Sektion 2 Maße ──
  b.sectionHeader("02", "Maße");
  b.kvRow("Grundrisse bemaßt", p.grundrisseBemasst ? "ja" : "—");
  // Lichte Höhen
  if (p.geschosse && p.geschosse.length){
    const hLines = p.geschosse.map(g => {
      const key = g.key || "—";
      const val = g.value ? g.value + " m" : "—";
      return key + " · " + val;
    });
    b.subBlock("Lichte Raumhöhen", [hLines.join("   ")]);
  }
  if (p.daecher && p.daecher.length){
    const dLines = p.daecher.map(d => {
      const typ = pdfDachTypLabel(d.typ);
      const ks  = d.kniestock  ? d.kniestock  + " cm" : "—";
      const ne  = d.neigung    ? d.neigung    + "°"   : "—";
      const ue  = d.ueberstand ? d.ueberstand + " cm" : "—";
      return typ + " · Kniestock " + ks + " · Neigung " + ne + " · Überstand " + ue;
    });
    b.subBlock("Dächer", dLines);
  }
  b.spacer(2);

  // ── Sektion 3 Bauteile ──
  b.sectionHeader("03", "Bauteile");
  let anyModified = false;
  for (const id of BAUTEIL_ORDER_3A){
    const txt = pdfBauteilSummary(p, id);
    if (txt.indexOf("*") !== -1) anyModified = true;
    const cat = BAUTEIL_CATALOG[id];
    b.bauteilRow(id, cat.title, txt);
  }
  // Fassaden-Matrix bei Wänden Holz (nur wenn vorhanden)
  if (p.bauteile && p.bauteile["3.6"]){
    const cat36 = BAUTEIL_CATALOG["3.6"];
    const state36 = p.bauteile["3.6"];
    for (const v of cat36.variants){
      if (!v.hasFassade) continue;
      const e = state36.varianten && state36.varianten[v.key];
      if (!e || !e.aktiv || !e.fassadePerGeschoss) continue;
      const fasLines = [];
      for (const g of (p.geschosse || [])){
        if (!g.key || !g.key.trim() || !g.value || !g.value.trim()) continue;
        const fas = e.fassadePerGeschoss[g.key];
        if (!fas) continue;
        const fasEntry = cat36.fassaden.find(x => x.key === fas);
        if (fasEntry){
          fasLines.push(g.key + " " + fasEntry.label + " (" + fasEntry.key + ")");
        }
      }
      if (fasLines.length){
        b.subBlock("Fassaden Wände Holz · " + v.tag, [fasLines.join("   ")]);
      }
    }
  }
  if (anyModified){
    b.ensureSpace(4);
    doc.setFont("DMSans", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.terra);
    doc.text("* Standardstärke angepasst", PDF_PAGE.marginX, 297 - PDF_PAGE.marginBottom - 2 - 4);
    // bewusst nicht in y eintragen, weil das ohnehin am Seitenrand sitzt
  }
  b.spacer(2);

  // ── Sektion 4 Heizung & Warmwasser ──
  b.sectionHeader("04", "Heizung & Warmwasser");
  const h = p.heizung || {};
  if (h.techniken){
    const techLines = [];
    for (const t of HEIZUNG_TECHNIK){
      const e = h.techniken[t.key];
      if (!e || !e.aktiv) continue;
      const parts = [t.title];
      if (t.subTypes && e.subType){
        const st = t.subTypes.find(x => x.key === e.subType);
        if (st) parts[0] = t.title + " (" + st.label + ")";
      }
      if (e.hersteller) parts.push("Hersteller: " + e.hersteller);
      if (e.modell)     parts.push("Modell: " + e.modell);
      if (t.extras && e.extras){
        for (const ex of t.extras){
          if (e.extras[ex.key]){
            parts.push(ex.label + " " + e.extras[ex.key] + " " + ex.unit);
          }
        }
      }
      if (e.raeume) parts.push("Räume: " + e.raeume);
      techLines.push(parts.join(" · "));
    }
    if (techLines.length){
      for (const line of techLines){
        b.kvRow("Heiztechnik", line);
      }
    } else {
      b.kvRow("Heiztechnik", "—");
    }
  } else {
    b.kvRow("Heiztechnik", "—");
  }
  b.kvRow("Pufferspeicher", h.pufferspeicherLiter ? h.pufferspeicherLiter + " Liter" : "—");

  const ww = h.warmwasser || {};
  const wwParts = [];
  if (ww.typen){
    if (ww.typen.zentral)         wwParts.push("zentrale Heizungsanlage");
    if (ww.typen.dezentral)       wwParts.push("dezentral");
    if (ww.typen.brauchwasserWp)  wwParts.push("Brauchwasser-Wärmepumpe");
  }
  b.kvRow("Warmwasser",  wwParts.length ? wwParts.join(" + ") : "—");
  b.kvRow("WW-Speicher", ww.speicherLiter ? ww.speicherLiter + " Liter" : "—");
  if (h.notiz) b.noteBlock("Notiz Anlage", h.notiz);
  b.spacer(2);

  // ── Sektion 5 Verteilsystem ──
  b.sectionHeader("05", "Verteilsystem");
  const vr = p.verteil || {};
  const vrParts = [];
  for (const o of VERTEIL_OPTIONEN){
    if (vr.aktiv && vr.aktiv[o.key]) vrParts.push(o.label);
  }
  b.kvRow("Verteilsystem", vrParts.length ? vrParts.join(", ") : "—");
  if (vr.notiz) b.noteBlock("Notiz", vr.notiz);
  b.spacer(2);

  // ── Sektion 6 Lüftung ──
  b.sectionHeader("06", "Lüftung");
  const lu = p.lueftung || {};
  let luLabel = "—";
  if (lu.typ){
    const o = LUEFTUNG_OPTIONEN.find(x => x.key === lu.typ);
    if (o) luLabel = o.label;
  }
  b.kvRow("Lüftungsart", luLabel);
  if (lu.notiz) b.noteBlock("Notiz", lu.notiz);
  b.spacer(2);

  // ── Sektion 7 PV ──
  b.sectionHeader("07", "PV-Anlage");
  const pv = p.pv || {};
  let pvStatus = "—";
  if (pv.status){
    const o = PV_STATUS.find(x => x.key === pv.status);
    if (o) pvStatus = o.label;
  }
  b.kvRow("Status",      pvStatus);
  b.kvRow("Größe",       pv.groesse || "—");
  b.kvRow("Ausrichtung", pv.ausrichtung || "—");
  if (pv.aufdach && pv.aufdach.aktiv){
    b.kvRow("Aufdach", (pv.aufdach.hersteller || "—") + " · " + (pv.aufdach.modul || "—"));
  }
  if (pv.indach && pv.indach.aktiv){
    b.kvRow("Indach",  (pv.indach.hersteller || "—") + " · " + (pv.indach.modul || "—"));
  }
  const aufdachAktiv = pv.aufdach && pv.aufdach.aktiv;
  const indachAktiv  = pv.indach  && pv.indach.aktiv;
  if (!aufdachAktiv && !indachAktiv){
    b.kvRow("Produkt", "—");
  }
  if (pv.notiz) b.noteBlock("Notiz", pv.notiz);
  b.spacer(2);

  // ── Sektion 8 Thermische Hülle ──
  b.sectionHeader("08", "Thermische Hülle");
  const hu = p.huelle || {};
  let huLabel = "—";
  if (hu.umfang){
    const o = HUELLE_OPTIONEN.find(x => x.key === hu.umfang);
    if (o) huLabel = o.label;
  }
  b.kvRow("Umfang Hülle",    huLabel);
  b.kvRow("Kritische Räume", hu.kritischeRaeume);
  if (hu.notiz) b.noteBlock("Notiz", hu.notiz);

  // ── Footer auf jeder Seite mit korrekter Gesamtseiten-Zahl ──
  const finalPageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= finalPageCount; i++){
    doc.setPage(i);
    // Footer-Bereich überzeichnen mit BG und neu schreiben
    doc.setFillColor(...PDF_COLORS.bg);
    doc.rect(0, PDF_PAGE.height - PDF_PAGE.marginBottom - 2,
             PDF_PAGE.width, PDF_PAGE.marginBottom + 2, "F");
    doc.setDrawColor(...PDF_COLORS.ruleSoft);
    doc.setLineWidth(0.2);
    const bottom = PDF_PAGE.height - PDF_PAGE.marginBottom + 8;
    doc.line(PDF_PAGE.marginX, bottom - 3,
             PDF_PAGE.width - PDF_PAGE.marginX, bottom - 3);
    doc.setFont("DMSans", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...PDF_COLORS.text3);
    doc.text(p.name + " · Projektkartei",
             PDF_PAGE.marginX, bottom);
    doc.text("Seite " + i + " von " + finalPageCount,
             PDF_PAGE.width - PDF_PAGE.marginX, bottom, { align: "right" });
  }

  // Dateinamen aus Projektname (sanitisiert)
  const safeName = (p.name || "Projekt")
    .replace(/[^\wÄÖÜäöüß \-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 60);
  const ts = new Date().toISOString().slice(0, 10);
  doc.save("laczy-" + safeName + "-" + ts + ".pdf");
  showToast("PDF erstellt", "sage");
}

// ─── Wizard-Button verdrahten ──────────────────────────────────────
function setupPdfExportTriggers(){
  // Wizard "Daten ausgeben" — überschreibt den Default-Handler in wizardNext
  const origWizardNext = wizardNext;
  wizardNext = function(){
    if (currentSection === PROJECT_SECTIONS.length){
      exportProjectAsPdf(activeProjectId);
      return;
    }
    origWizardNext();
  };
}

// Da wizardNext schon registriert wurde mit dem alten Handler, müssen wir
// die Event-Listener-Bindung neu machen. Wir hooken stattdessen direkt:
(function patchWizardNext(){
  // Remove old listener — wir können den nicht direkt entfernen, also stattdessen
  // den Handler im Aufruf abfangen: an wizardNextBtn einen neuen Listener anhängen,
  // der vor dem alten feuert.
  if (typeof wizardNextBtn !== "undefined" && wizardNextBtn){
    wizardNextBtn.addEventListener("click", (e) => {
      if (currentSection === PROJECT_SECTIONS.length){
        e.stopImmediatePropagation();
        exportProjectAsPdf(activeProjectId);
      }
    }, true);  // capture phase, läuft vor dem bestehenden Bubbling-Handler
  }
})();
