# RZD Builder Documentation

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | README.md |
| Status | Actief |
| Rol | Officiële index van de documentatiesuite |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Welkom bij de officiële documentatiesuite van **RZD Builder**.

Deze README indexeert de officiële, actieve documentatiesuite. Het is geen volledige inventaris van alle bestanden in `docs/`.

De documentatiesuite zorgt ervoor dat:

- iedere ontwikkelsessie consistent start;
- architectuur en broncode synchroon blijven;
- wijzigingen volledig worden gedocumenteerd;
- AI-assistenten en ontwikkelaars volgens dezelfde werkwijze werken.

---

# Documentstructuur

## Startdocumenten

| Document | Doel |
|----------|------|
| AGENTS.md | Startpunt voor AI-coding agents |
| PROJECT_STATUS.md | Actuele projectstatus |
| CHECKPOINT.md | Overdracht tussen ontwikkelsessies |
| BACKLOG.md | Openstaande werkzaamheden |

## Architectuur

| Document | Doel |
|----------|------|
| ARCHITECTURE.md | Softwarearchitectuur |
| WORDPRESS_ARCHITECTURE.md | Gecontroleerde WordPress-concept- en Page-flow |
| DOCUMENTATION_ARCHITECTURE.md | Structuur van de documentatiesuite |

## Ontwikkelrichtlijnen

| Document | Doel |
|----------|------|
| AI_RULES.md | Ontwikkelworkflow voor AI |
| CONTRIBUTING.md | Richtlijnen voor bijdragen |

## Projectbeheer

| Document | Doel |
|----------|------|
| CHANGELOG.md | Historische wijzigingen |
| ROADMAP.md | Strategische ontwikkelrichting |
| RELEASE_NOTES.md | Officiële releases en wijzigingen per versie |

## Aanvullende en historische bestanden

| Bestand | Status en doel |
|---------|----------------|
| FIELD_SPECIFICATION.md | Aanvullende veld- en mappingreferentie; geen runtime-bron van waarheid |
| SESSION_STATE.md | Historische momentopname; actuele status staat in PROJECT_STATUS.md, BACKLOG.md en CHECKPOINT.md |
| archive/DOCUMENTATION_INITIAL_DESIGN.md | Historisch ontwerpdocument |

---

# Leesvolgorde voor een nieuwe sessie

Nieuwe ontwikkelsessies starten altijd in onderstaande volgorde:

1. AGENTS.md
2. CHECKPOINT.md
3. PROJECT_STATUS.md
4. BACKLOG.md

Raadpleeg daarna indien nodig:

- ARCHITECTURE.md
- AI_RULES.md
- CHANGELOG.md
- DOCUMENTATION_ARCHITECTURE.md
- WORDPRESS_ARCHITECTURE.md
- CONTRIBUTING.md
- ROADMAP.md
- RELEASE_NOTES.md

---

# Ontwikkelworkflow

Iedere ontwikkeling verloopt volgens dezelfde werkwijze:

1. Analyse
2. Bespreken
3. Goedkeuring
4. Wijzigen
5. Testen
6. Documentatie bijwerken
7. CHECKPOINT.md bijwerken
8. CHANGELOG.md bijwerken indien van toepassing

De actuele projectstatus, openstaande werkzaamheden en sessieoverdracht worden bijgehouden in hun eigen officiële documenten.

---

# Onderhoud

De documentatie is onderdeel van het project en wordt gelijktijdig met de broncode onderhouden.

Wijzigingen aan architectuur, workflow of projectstructuur worden direct verwerkt in de relevante documenten.

Iedere documentatie-update volgt de vastgelegde documentrollen en verwijzingsregels.

---

# Relatie met de repository

De root `README.md` geeft een overzicht van het gehele project.

Deze documentatie-README vormt het startpunt van de officiële documentatiesuite.

De documentatiesuite is geen vervanging voor de root README en bevat geen volledige inventaris van alle repositorybestanden.

---

# Licentie

Interne ontwikkeling van **Reizen zonder Drempels (RZD)**.

Alle rechten voorbehouden.

**Open aandachtspunt**

`LICENSE` vermeldt proprietary/all rights reserved, terwijl `package.json` de licentie als `ISC` opgeeft.

Deze documentatie-update lost die afwijking niet op. De licentie-inconsistentie moet afzonderlijk worden beoordeeld en afgestemd.
