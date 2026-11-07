# CONTRIBUTING.md

| Eigenschap | Waarde |
|---|---|
| Project | RZD Builder |
| Document | CONTRIBUTING.md |
| Status | Actief |
| Rol | Ontwikkelrichtlijnen voor bijdragers |
| Laatste wijziging | 06-11-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

CONTRIBUTING.md bevat de ontwikkelrichtlijnen voor bijdragers aan RZD Builder.

Het document beschrijft:

- ontwikkelrichtlijnen;
- het bijdrageproces;
- relevante verwijzingen naar projectafspraken.

Het doel is om wijzigingen gecontroleerd, begrijpelijk en volgens de bestaande projectstructuur uit te voeren.

---

# Algemene bijdrageprincipes

## 1. Werk vanuit de bestaande projectstructuur

- Respecteer de bestaande mappenstructuur.
- Gebruik de bestaande componenten en verantwoordelijkheden.
- Voeg geen nieuwe architectuur toe zonder dat dit nodig is.
- Houd wijzigingen beperkt tot het doel van de opdracht.
- Voorkom onnodige wijzigingen aan bestaande functionaliteit.

## 2. Eén bron per informatietype

Gebruik de officiële documentatiebron voor het betreffende onderwerp.

| Informatietype | Officiële bron |
|---|---|
| Documentstructuur en onderhoudsregels | DOCUMENTATION_ARCHITECTURE.md |
| Navigatie en leesvolgorde | README.md |
| Technische architectuur | ARCHITECTURE.md |
| AI-werkwijze | AI_RULES.md |
| Projectstatus | PROJECT_STATUS.md |
| Openstaande werkzaamheden | BACKLOG.md |
| Laatste sessiestatus en validaties | CHECKPOINT.md |
| Afgeronde wijzigingen | CHANGELOG.md |
| Ontwikkelrichting | ROADMAP.md |
| WordPress-integratie | WORDPRESS_ARCHITECTURE.md |
| Ontwikkelrichtlijnen | CONTRIBUTING.md |
| Release-overzicht | RELEASE_NOTES.md |

Informatie die al in een officiële bron wordt beheerd, wordt niet onnodig gekopieerd naar andere documenten.

---

# Bijdrageproces

## 1. Bepaal de opdracht

Voordat een wijziging wordt uitgevoerd:

- bepaal het doel;
- controleer welke onderdelen relevant zijn;
- controleer of de opdracht aansluit op de bestaande architectuur;
- bepaal welke documentatie eventueel moet worden bijgewerkt.

Openstaande werkzaamheden worden beheerd in BACKLOG.md.

## 2. Beperk de wijziging

- Wijzig alleen onderdelen die nodig zijn voor de opdracht.
- Behoud bestaande functionaliteit, tenzij de opdracht expliciet anders bepaalt.
- Vermijd onnodige refactoring.
- Maak duidelijk welke onderdelen wel en niet zijn aangepast.

## 3. Controleer de wijziging

Voer passende controles uit wanneer dit mogelijk is.

Maak onderscheid tussen:

- codewijzigingen;
- uitgevoerde tests;
- mocktests;
- lokale handmatige controles;
- live-validatie.

Een testbestand is geen bewijs dat een test is uitgevoerd.

Een mocktest is geen bewijs van een werkende live-integratie.

Vermeld alleen controles die daadwerkelijk zijn uitgevoerd.

## 4. Werk documentatie bij

Werk documentatie bij wanneer de wijziging gevolgen heeft voor de officiële documentatie.

Gebruik hiervoor de bestaande documentrollen:

- PROJECT_STATUS.md voor de actuele projectstatus;
- BACKLOG.md voor openstaande werkzaamheden;
- CHECKPOINT.md voor de laatste sessiestatus, validaties en volgende taak;
- CHANGELOG.md voor belangrijke afgeronde wijzigingen;
- ARCHITECTURE.md voor technische architectuur;
- WORDPRESS_ARCHITECTURE.md voor WordPress-specifieke wijzigingen;
- ROADMAP.md voor wijzigingen in de ontwikkelrichting.

Voeg geen volledige backlog, sessiegeschiedenis of architectuurdetails toe aan CONTRIBUTING.md.

---

# Afronding van werkzaamheden

Een wijziging wordt niet uitsluitend op basis van codeaanpassing als volledig gevalideerd beschouwd.

Bij afronding wordt duidelijk gemaakt:

- wat is gewijzigd;
- welke bestanden zijn aangepast;
- welke controles zijn uitgevoerd;
- welke controles niet zijn uitgevoerd;
- welke beperkingen of aandachtspunten blijven bestaan;
- welke documentatie is bijgewerkt.

Wanneer een wijziging nog niet volledig is gecontroleerd, wordt dit expliciet vermeld.

Openstaande punten worden opgenomen in BACKLOG.md.

De actuele status en uitgevoerde validaties worden bijgewerkt in PROJECT_STATUS.md en CHECKPOINT.md.

---

# Documentatieonderhoud

CONTRIBUTING.md wordt bijgewerkt wanneer:

- ontwikkelrichtlijnen wijzigen;
- het bijdrageproces wijzigt;
- projectafspraken voor bijdragers wijzigen.

Het document bevat geen:

- AI-specifieke werkwijze;
- actuele taken;
- projectstatus;
- technische architectuurdetails;
- wijzigingshistorie.

Voor AI-specifieke instructies wordt verwezen naar AI_RULES.md.

---

# Uitgangspunt

Wijzigingen aan RZD Builder worden gecontroleerd en beperkt uitgevoerd.

De projectdocumentatie moet overeenkomen met de daadwerkelijk uitgevoerde werkzaamheden.

Onbevestigde implementatie, tests of live-integratie worden niet als afgerond of gevalideerd beschreven.
