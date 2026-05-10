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
