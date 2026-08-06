<!-- ========================================================================== -->
<!-- RZD Builder                                                                -->
<!-- DOCUMENTATION ARCHITECTURE                                                  -->
<!-- ========================================================================== -->

# DOCUMENTATION ARCHITECTURE

| Eigenschap | Waarde |
|------------|--------|
| Document | DOCUMENTATION_ARCHITECTURE.md |
| Project | RZD Builder |
| Versie | 1.0 |
| Status | Actief |
| Laatste wijziging | 04-08-2026 |
| Eigenaar | Documentatiearchitectuur |

---

# Inhoud

1. Doel
2. Algemene ontwerpprincipes
3. Documentatiesuite
4. Documenthiërarchie
5. Rollen van documenten
6. Eén bron per informatietype
7. Verwijzingsregels
8. Documentlevenscyclus
9. Onderhoud van de documentatiesuite
10. Kernregel

<!-- ========================================================================== -->
<!-- HOOFDSTUK 1                                                                -->
<!-- DOEL                                                                        -->
<!-- ========================================================================== -->

# Hoofdstuk 1 – Doel

Dit document beschrijft de officiële documentatiestructuur van RZD Builder.

Het document legt vast:

- welke documenten deel uitmaken van de documentatiesuite;
- welk doel ieder document heeft;
- welke informatie in welk document thuishoort;
- wanneer documenten worden bijgewerkt;
- welke informatie niet mag worden gedupliceerd.

DOCUMENTATION_ARCHITECTURE.md is de bron van waarheid voor de structuur van de documentatiesuite.

<!-- ========================================================================== -->
<!-- HOOFDSTUK 2                                                                -->
<!-- ALGEMENE ONTWERPPRINCIPES                                                  -->
<!-- ========================================================================== -->

# Hoofdstuk 2 – Algemene ontwerpprincipes

## Eén officiële bron

Iedere soort informatie heeft precies één officiële bron.

Informatie wordt vastgelegd in het document dat daarvoor verantwoordelijk is.

---

## Geen duplicatie

Documenten mogen geen informatie dupliceren.

Wanneer informatie in een ander document thuishoort, wordt verwezen naar de officiële bron.

---

## Duidelijke rollen

Ieder document heeft één duidelijke rol en verantwoordelijkheid.

Documenten bevatten uitsluitend informatie die bij die rol hoort.

---

## Verwijzen boven herhalen

Verwijzen heeft altijd de voorkeur boven herhalen.

Een document verwijst naar een ander document wanneer aanvullende, actuele of historische informatie daar wordt beheerd.

<!-- ========================================================================== -->
<!-- HOOFDSTUK 3                                                                -->
<!-- DOCUMENTATIESUITE                                                          -->
<!-- ========================================================================== -->

# Hoofdstuk 3 – Documentatiesuite

De documentatiesuite bestaat uit de volgende documenten:

- README.md
- DOCUMENTATION_ARCHITECTURE.md
- ARCHITECTURE.md
- AI_RULES.md
- PROJECT_STATUS.md
- BACKLOG.md
- CHECKPOINT.md
- CHANGELOG.md
- ROADMAP.md
- WORDPRESS_ARCHITECTURE.md
- CONTRIBUTING.md
- RELEASE_NOTES.md

## Historisch ontwerpdocument

Opzet documentatiesuite.txt is een historisch ontwerpdocument.

Dit document behoort niet meer tot de actieve documentatiesuite.

DOCUMENTATION_ARCHITECTURE.md is de officiële opvolger.

<!-- ========================================================================== -->
<!-- HOOFDSTUK 4                                                                -->
<!-- DOCUMENTHIËRARCHIE                                                         -->
<!-- ========================================================================== -->

# Hoofdstuk 4 – Documenthiërarchie

```text
README.md
│
├── DOCUMENTATION_ARCHITECTURE.md
├── ARCHITECTURE.md
├── AI_RULES.md
├── PROJECT_STATUS.md
├── BACKLOG.md
├── CHECKPOINT.md
├── CHANGELOG.md
├── ROADMAP.md
├── WORDPRESS_ARCHITECTURE.md
├── CONTRIBUTING.md
└── RELEASE_NOTES.md
```

<!-- ========================================================================== -->
<!-- HOOFDSTUK 5                                                                -->
<!-- ROLLEN VAN DOCUMENTEN                                                      -->
<!-- ========================================================================== -->

# Hoofdstuk 5 – Rollen van documenten

## README.md

### Doel

README.md is het ingangspunt van de documentatiesuite.

### Officiële inhoud

- overzicht van de documentatiesuite;
- leesvolgorde;
- verwijzingen naar beschikbare documentatie.

### Hoort niet in dit document

- actuele projectstatus;
- architectuurdetails;
- openstaande taken;
- wijzigingshistorie;
- sessie-informatie.

### Bijwerken

Bij wijzigingen in de documentatiestructuur of documentatie-index.

---

## DOCUMENTATION_ARCHITECTURE.md

### Doel

DOCUMENTATION_ARCHITECTURE.md beschrijft de volledige structuur, rollen en onderhoudsregels van de documentatiesuite.

### Officiële inhoud

- documentrollen;
- bron per informatietype;
- bijwerkmomenten;
- verwijzingsregels;
- onderhoudsregels.

### Hoort niet in dit document

- actuele projectstatus;
- openstaande taken;
- technische architectuurdetails;
- wijzigingshistorie;
- sessie-informatie.

### Bijwerken

Bij een wijziging in de documentatiestructuur, documentrollen of onderhoudsregels.

---

## ARCHITECTURE.md

### Doel

ARCHITECTURE.md beschrijft de architectuur en componenten van RZD Builder.

### Officiële inhoud

- architectuuroverzicht;
- ontwerpprincipes;
- systeemarchitectuur;
- projectstructuur;
- componenten;
- services;
- adapters;
- modules;
- metadata;
- synchronisatie;
- logging;
- foutafhandeling;
- testing.

### Hoort niet in dit document

- actuele projectstatus;
- openstaande taken;
- sessieoverdracht;
- volledige wijzigingshistorie;
- productroadmap;
- release-overzicht.

### Bijwerken

Alleen bij architectuurwijzigingen.

---

## AI_RULES.md

### Doel

AI_RULES.md beschrijft de werkwijze voor AI tijdens ontwikkeling van RZD Builder.

### Officiële inhoud

- werkwijze;
- wijzigingsregels;
- reviewregels;
- testregels;
- communicatie;
- besluitvorming;
- sessiebeheer.

### Hoort niet in dit document

- actuele projectstatus;
- openstaande taken;
- afgeronde wijzigingen;
- technische architectuurdetails;
- roadmap.

### Bijwerken

Zelden, wanneer de werkwijze voor AI wijzigt.

---

## PROJECT_STATUS.md

### Doel

PROJECT_STATUS.md geeft een overzicht van de huidige projectstatus.

### Officiële inhoud

- projectdoel;
- huidige projectstatus;
- hoofdlijnen van prioriteiten;
- samenvattende reviewstatus;
- belangrijke projectontwikkelingen.

### Hoort niet in dit document

- volledige openstaande taken;
- volledige afgeronde wijzigingshistorie;
- sessieoverdracht;
- gedetailleerde testuitvoer;
- werkwijze voor AI.

### Bijwerken

Alleen bij grote wijzigingen in projectstatus, prioriteiten of architectuurstatus.

---

## BACKLOG.md

### Doel

BACKLOG.md bevat openstaande werkzaamheden.

### Officiële inhoud

- openstaande taken;
- lopende taken;
- prioriteiten;
- taakstatus;
- ideeën die nog niet zijn ingepland.

### Hoort niet in dit document

- afgeronde wijzigingshistorie;
- actuele sessieoverdracht;
- volledige projectstatus;
- technische architectuurdetails;
- werkwijze voor AI.

### Bijwerken

Zodra taken, prioriteiten of taakstatussen veranderen.

---

## CHECKPOINT.md

### Doel

CHECKPOINT.md bevat de actuele stand van zaken na een werksessie.

### Officiële inhoud

- laatste afgeronde werkzaamheden;
- laatste succesvolle test;
- volgende taak;
- relevante overdrachtsinformatie voor de volgende sessie.

### Hoort niet in dit document

- volledige backlog;
- volledige wijzigingshistorie;
- blijvende projectstatus;
- architectuurdetails;
- algemene werkwijze voor AI.

### Bijwerken

Na iedere werksessie.

---

## CHANGELOG.md

### Doel

CHANGELOG.md bevat de volledige historie van afgeronde wijzigingen.

### Officiële inhoud

- belangrijke afgeronde wijzigingen;
- ontwikkelingshistorie;
- architectuurmijlpalen;
- verwijderde onderdelen;
- documentatiegeschiedenis.

### Hoort niet in dit document

- openstaande werkzaamheden;
- actuele sessie-informatie;
- actuele projectstatus;
- roadmap;
- algemene ontwikkelregels.

### Bijwerken

Na een afgeronde belangrijke wijziging.

CHANGELOG.md wordt nooit overschreven; wijzigingen worden uitsluitend toegevoegd.

---

## ROADMAP.md

### Doel

ROADMAP.md beschrijft de ontwikkelrichting en toekomstige fasen van RZD Builder en Reizen zonder Drempels.

### Officiële inhoud

- ontwikkelfasen;
- toekomstige productontwikkeling;
- toekomstige technische ontwikkeling;
- langetermijnrichting.

### Hoort niet in dit document

- actuele openstaande taken;
- sessie-informatie;
- actuele projectstatus;
- afgeronde wijzigingshistorie;
- gedetailleerde architectuur.

### Bijwerken

Wanneer de ontwikkelrichting, fasering of planning wijzigt.

---

## WORDPRESS_ARCHITECTURE.md

### Doel

WORDPRESS_ARCHITECTURE.md beschrijft de WordPress-integratie van RZD Builder.

### Officiële inhoud

- WordPress-publicatiepipeline;
- publicatiemodel;
- Airtable-naar-WordPress-veldtoewijzing;
- WordPress-specifieke toekomstige uitbreidingen.

### Hoort niet in dit document

- algemene RZD Builder-architectuur;
- openstaande werkzaamheden;
- sessie-informatie;
- volledige productroadmap;
- wijzigingshistorie.

### Bijwerken

Bij wijzigingen in de WordPress-integratie of WordPress-architectuur.

---

## CONTRIBUTING.md

### Doel

CONTRIBUTING.md bevat ontwikkelrichtlijnen voor bijdragers.

### Officiële inhoud

- ontwikkelrichtlijnen;
- bijdrageproces;
- relevante verwijzingen naar projectafspraken.

### Hoort niet in dit document

- AI-specifieke werkwijze;
- actuele taken;
- projectstatus;
- technische architectuurdetails;
- wijzigingshistorie.

### Bijwerken

Wanneer ontwikkelrichtlijnen of het bijdrageproces wijzigen.

---

## RELEASE_NOTES.md

### Doel

RELEASE_NOTES.md bevat het release-overzicht.

### Officiële inhoud

- releases;
- versie-informatie;
- wijzigingen per release.

### Hoort niet in dit document

- volledige interne wijzigingshistorie;
- openstaande taken;
- sessie-informatie;
- technische architectuurdetails;
- roadmap.

### Bijwerken

Bij een release.

<!-- ========================================================================== -->
<!-- HOOFDSTUK 6                                                                -->
<!-- ÉÉN BRON PER INFORMATIETYPE                                                -->
<!-- ========================================================================== -->

# Hoofdstuk 6 – Eén bron per informatietype

| Informatietype | Officiële bron |
|---|---|
| Documentatiestructuur, documentrollen en onderhoudsregels | DOCUMENTATION_ARCHITECTURE.md |
| Navigatie en leesvolgorde van documentatie | README.md |
| Technische architectuur en componenten | ARCHITECTURE.md |
| Werkwijze voor AI | AI_RULES.md |
| Huidige projectstatus | PROJECT_STATUS.md |
| Openstaande en lopende werkzaamheden | BACKLOG.md |
| Laatste sessiestatus, test en volgende taak | CHECKPOINT.md |
| Afgeronde wijzigingshistorie | CHANGELOG.md |
| Toekomstige ontwikkelrichting en fasering | ROADMAP.md |
| WordPress-integratie en WordPress-veldtoewijzing | WORDPRESS_ARCHITECTURE.md |
| Ontwikkelrichtlijnen voor bijdragers | CONTRIBUTING.md |
| Release-overzicht en wijzigingen per release | RELEASE_NOTES.md |

<!-- ========================================================================== -->
<!-- HOOFDSTUK 7                                                                -->
<!-- VERWIJZINGSREGELS                                                          -->
<!-- ========================================================================== -->

# Hoofdstuk 7 – Verwijzingsregels

## Algemene regel

Wanneer informatie al wordt beheerd door de officiële bron, wordt die informatie niet gekopieerd naar een ander document.

Het document verwijst in dat geval naar de officiële bron.

---

## Voorbeelden

- Een open taak wordt opgenomen in BACKLOG.md, niet in PROJECT_STATUS.md of CHECKPOINT.md.
- Een afgeronde belangrijke wijziging wordt opgenomen in CHANGELOG.md.
- De laatste sessiestatus en test worden opgenomen in CHECKPOINT.md.
- Architectuurdetails worden opgenomen in ARCHITECTURE.md.
- Toekomstige fasering wordt opgenomen in ROADMAP.md.
- WordPress-specifieke architectuur wordt opgenomen in WORDPRESS_ARCHITECTURE.md.
- AI-werkwijze wordt opgenomen in AI_RULES.md.

<!-- ========================================================================== -->
<!-- HOOFDSTUK 8                                                                -->
<!-- DOCUMENTLEVENSCYCLUS                                                       -->
<!-- ========================================================================== -->

# Hoofdstuk 8 – Documentlevenscyclus

Documentatie doorloopt de volgende levenscyclus:

Concept

↓

Review

↓

Actief

↓

Gearchiveerd

<!-- ========================================================================== -->
<!-- HOOFDSTUK 9                                                                -->
<!-- ONDERHOUD VAN DE DOCUMENTATIESUITE                                         -->
<!-- ========================================================================== -->

# Hoofdstuk 9 – Onderhoud van de documentatiesuite

## Documentrollen bewaken

Ieder document behoudt zijn eigen rol.

Informatie die niet bij die rol hoort, wordt niet toegevoegd maar verwezen naar de officiële bron.

---

## Bijwerken volgens verantwoordelijkheid

Documenten worden bijgewerkt volgens hun vastgelegde bijwerkmoment.

De bijwerkmomenten zijn vastgelegd in dit document.

---

## Nieuwe documenten

Nieuwe documenten worden uitsluitend toegevoegd wanneer bestaande documenten de informatie niet logisch kunnen bevatten.

---

## Historie behouden

CHANGELOG.md bevat de historie van afgeronde wijzigingen.

Bestaande wijzigingsregels worden niet overschreven.

---

## Structuurwijzigingen

Wijzigingen in documentrollen, documentstructuur, informatietypen of onderhoudsregels worden vastgelegd in DOCUMENTATION_ARCHITECTURE.md.

<!-- ========================================================================== -->
<!-- HOOFDSTUK 10                                                               -->
<!-- KERNREGEL                                                                  -->
<!-- ========================================================================== -->

# Hoofdstuk 10 – Kernregel

Iedere soort informatie heeft precies één officiële bron van waarheid. Andere documenten verwijzen uitsluitend naar deze bron.

Nieuwe informatie wordt altijd eerst gekoppeld aan het juiste document en pas daarna toegevoegd.

Verwijzen heeft altijd de voorkeur boven herhalen.

---

**Einde document**
