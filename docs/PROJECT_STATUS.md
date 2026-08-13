# PROJECT STATUS

**Project:** RZD Builder

Dit document beschrijft de actuele status van het project. Het dient als centraal dashboard voor ontwikkelaars en AI-assistenten en wordt aan het begin van iedere ontwikkelsessie geraadpleegd.

---

# Project

## Naam

RZD Builder

## Versie

Builder 2.0 Final (Stabiele basis)

## Doel

RZD Builder is het ontwikkelplatform voor **Reizen zonder Drempels (RZD)**.

De Builder beheert niet alleen Airtable-schema's, maar vormt de centrale ontwikkelomgeving voor het complete RZD-platform.

De Builder werkt vanuit één Canon Model en synchroniseert dit naar meerdere platformen.

---

# Huidige Status

| Onderdeel    | Status                   |
| ------------ | ------------------------ |
| Ontwikkeling | 🟢 Actief                |
| Builder 2.0  | 🟢 Afgerond              |
| Builder 3.0  | 🟢 Actief                |
| Canon Model  | 🟢 Actief                |
| Teststatus   | 🟢 Alle testen succesvol |
| Documentatie | 🟢 Actief onderhouden    |

---

# Samenvatting

Builder 2.0 is functioneel afgerond.

Alle kernonderdelen zijn geïmplementeerd en succesvol getest.

De resterende verschillen bestaan uitsluitend uit inhoudelijke metadata (zoals descriptions) en zijn geen programmeerfouten.

Vanaf dit punt wordt alle nieuwe functionaliteit ontwikkeld binnen Builder 3.0.

De huidige ontwikkelfase richt zich op de Content Engine en de koppeling van het Canon Model aan de bestaande RZD 5.1 Airtable-structuur.

---

# Architectuur

De Builder is opgebouwd rondom het Canon Model.

                Canon Model
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
 Airtable      WordPress        Exports
      │              │              │
      └──────────────┼──────────────┘
                     │
                     ▼
               RZD Platform

Het Canon Model vormt de enige bron van waarheid.

Alle synchronisaties vertrekken vanuit dit model.

---

# Builder 2.0

## Status

🟢 Afgerond

### Geïmplementeerd

- Canon Model
- FieldDefinition
- BuilderContext
- SchemaValidator
- Comparison Engine
- Difference Engine
- Update Planner
- Rollback Planner
- Synchronization Service
- Airtable Adapter
- Metadata Write API
- Report Generator
- Report Formatter
- Audit Service
- Dry Run
- JSON Reports
- Markdown Reports

---

# Teststatus

Succesvol getest:

- validate
- build
- dry-run
- rollback
- metadata updates
- synchronisatie
- rapportgeneratie
- Airtable-verbinding
- Airtable schema dry-run
- dependency dry-run
- execution safety dry-run

Alle testen succesvol.

De Airtable-verbinding en schema-functionaliteit zijn succesvol gevalideerd.

Er heeft recent een gecontroleerde productie-execute plaatsgevonden voor één geval (Karios, `recQzECjVOUbQjc5g`) na uitgebreide dry-runs en validaties. Deze execute betrof gecontroleerde updates en is bewust uitgevoerd door het team.

---

# Airtable

RZD 5.1 is de actieve database.

De juiste Airtable-base is bevestigd:

Base ID: appImdZ7AGoXCAlto

De Builder kan de bestaande RZD 5.1-structuur uitlezen.

Bevestigde tabellen:

- Accommodaties
- Modules
- Beoordelingspunten
- Accommodatie beoordelingen
- Standaard beoordelingssets
- Opmerkingen
- Verbeterpunten
- Reizigerservaringen

Belangrijke ontwerpbeslissing:

De tabel **Accommodaties** bevat uitsluitend basisgegevens.

Toegankelijkheidsgegevens worden niet langer opgeslagen als honderden kolommen.

De bestaande RZD 5.1-structuur blijft leidend.

Er wordt geen nieuwe Airtable-base aangemaakt.

Bestaande tabellen worden niet onnodig vervangen of opnieuw aangemaakt.

---

# Definitieve Databasestructuur

    Accommodaties
          │
          ▼
       Modules
          │
          ▼
    Beoordelingspunten
          │
          ▼
    Accommodatie Beoordelingen

Hiermee blijft de database schaalbaar en onderhoudbaar.

De Canon-benamingen moeten waar nodig worden gekoppeld aan de bestaande RZD-benamingen:

    Content Modules
          ↓
       Modules

    Beoordelingspunten
          ↓
    Beoordelingspunten

    Accommodatie Beoordelingen
          ↓
    Accommodatie beoordelingen

De bestaande tabellen blijven leidend.

---

# Builder 3.0

## Status

🟢 Actief

Builder 3.0 bouwt voort op de stabiele basis van Builder 2.0.

Nieuwe functionaliteit wordt uitsluitend nog binnen Builder 3.0 ontwikkeld.

De huidige focus ligt op de **Content Engine** en de koppeling met de bestaande RZD 5.1-structuur.
De Canon-naar-RZD 5.1 tabelmapping is vastgesteld en in de Builder vastgelegd.

De Documentation Engine is inmiddels gevalideerd tot en met fase 3G.

---

# Geplande Engines

## Schema Engine

Beheert:

- tabellen
- velden
- relaties

De Schema Engine kan inmiddels schema's, velden, afhankelijkheden en linked-table relaties als dry run opbouwen.

De volgende stap is het correct mappen van de bestaande RZD 5.1-structuur in plaats van nieuwe tabellen te creëren.

---

## Content Engine

Beheert:

- Modules
- Beoordelingspunten
- Templates
- Vragenstructuren

De Canon ContentDefinition ondersteunt momenteel de typen:

- checkbox
- number
- text
- longtext
- select
- attachment

De volgende technische stap is het koppelen van deze Canon-structuur aan de bestaande tabellen **Modules**, **Beoordelingspunten** en **Accommodatie beoordelingen**.

---

## RZD 5.1 Mapping & Write Safety

De RZD 5.1 Canon point mapping/resolver is inmiddels read-only gevalideerd.

De gecombineerde dry-run heeft 10 Canon-punten behandeld. De huidige `pointMappings.js` bevat 6 × EXACT, 1 × POSSIBLE en 3 × NO_MATCH entries. Niet alle genoemde entries zijn automatisch via de resolver verwerkt; enkele blijven `NO_MATCH` of `POSSIBLE` en vereisen een inhoudelijke beslissing.

Er zijn 7 bestaande Airtable-records gevonden.

Alle 6 EXACT mappings hebben een geldig Airtable Beoordelingspunt-record-ID.

De write-flow is beveiligd zodat uitsluitend mappings met status `EXACT` schrijfbaar zijn. Dit is toegepast in `bulkRecordWriteFinal.js` en `bulkRecordWriteSafe2.js`.

`automatic_door` blijft `NO_MATCH` en wordt niet geschreven.


De gecombineerde mapping dry-run en de Final Bulk Write dry-run zijn succesvol uitgevoerd.

Operationele update (2026-08-14):

- `services/reviewWriteService.js` is ingevoerd als centrale upsert-service voor `Accommodatie beoordelingen`. De service implementeert duplicate-safety: 0 matches → CREATE, 1 match → UPDATE, >1 matches → BLOCKED_MULTIPLE_MATCHES (geen automatische keuze/verwijdering).
- Diverse scripts zijn gemigreerd naar het gebruik van `reviewWriteService.upsertReview(...)` (o.a. `writeMappedRecords.js`, `bulkRecordWrite.js`, `bulkRecordWriteFinal.js`, `bulkRecordWriteSafe2.js`).
- Gecontroleerde execute uitgevoerd voor accommodatie Karios (`recQzECjVOUbQjc5g`): 5 vooraf geverifieerde lege duplicaten verwijderd; na opschoning 7 beoordelingen en 0 duplicaten; `writeMappedRecords.js --execute` resulteerde in 6 updates, 0 creates en 0 deletes.

Mapping status (canon module `toegang`, samenvatting): 10 Canon-punten verwerkt — 6 × EXACT, 1 × POSSIBLE, 3 × NO_MATCH. De huidige `pointMappings.js` bevat:

- 4 × EXACT (parking gerelateerd)
- `entrance_threshold` — EXACT
- `entrance_turning_circle` — EXACT
- `entrance_route` — POSSIBLE
- `route_slope` — NO_MATCH
- `main_entrance_accessible` — NO_MATCH
- `automatic_door` — NO_MATCH

Besluit rond NO_MATCH (beleid): een `NO_MATCH` betekent niet automatisch dat er een nieuw Airtable-beoordelingspunt gemaakt wordt. Teambesluiten:

- `route_slope` wordt niet toegevoegd als apart Airtable-punt; hellingsinformatie kan binnen beoordeling/omschrijving worden vastgelegd.
- `automatic_door` blijft voorlopig `NO_MATCH`.
- `main_entrance_accessible` blijft voorlopig `NO_MATCH`.
- `entrance_route` wordt niet automatisch aangemaakt zonder expliciet inhoudelijk besluit.

Open technisch aandachtspunt:

- De Canon content IDs en de `pointMappings.js` keys verschillen op enkele punten (bijv. `route_to_entrance` vs `entrance_route`, `turning_circle` vs `entrance_turning_circle`). De huidige resolver (`content/mapping/airtablePointResolver.js`) matcht uitsluitend op `contentPoint.id` en kent geen alias/ID‑vertaling laag. Dit is een open technisch aandachtspunt dat nog besloten moet worden; het wordt hier geregistreerd maar niet automatisch opgelost.

`scripts/testCombinedPointMapping.js` is toegevoegd als read-only regressietest en succesvol uitgevoerd.

---

## Documentation Engine

De Documentation Engine is ontwikkeld en gevalideerd tot en met fase 3G.

De afgeronde fases zijn:

- 3A — documentatiestructuur en veiligheidsregels
- 3B — bron-naar-document mapping
- 3C — mapping laden en toepassen
- 3D — concrete documentgeneratie dry-run
- 3E — sectiecontrole
- 3F — managed-block dry-run
- - 3G — gecontroleerde document-write uitgevoerd en geverifieerd

**Write-status:** gecontroleerde document-write uitgevoerd.

**Airtable:** de Documentation Engine voerde geen ongecontroleerde Airtable-writes uit.

**GitHub:** wijzigingen zijn lokaal gecommit en naar GitHub gepusht.

De engine werkt met RZD-AUTO START/END managed blocks.

Bestaande documentinhoud buiten deze blocks wordt beschermd.

Protected documenten worden niet automatisch gewijzigd.

CHANGELOG.md blijft append-only.

---

## Export Engine

Synchroniseert het Canon Model naar:

- Airtable
- WordPress
- JSON
- API
- AI

---

# Prioriteiten

## P1

Builder 2.0 Final

Status

🟢 Afgerond

---

## P2

Builder 3.0

Focus:

- Content Engine
- RZD 5.1 mapping
- Documentation Engine
- Export Engine

Status

🟢 Actief

---

# Ontwikkelafspraken

- Werk altijd aan één bestand tegelijk.
- Analyseer vóór iedere wijziging.
- Test direct na iedere wijziging.
- Gebruik Windows CMD voor alle testcommando's.
- Wacht op volledige testuitvoer voordat conclusies worden getrokken.
- Grote architectuurwijzigingen worden vooraf ontworpen.
- Het Canon Model is altijd leidend.
- Bestaande RZD 5.1-tabellen en data worden niet onnodig vervangen.
- Maak geen nieuwe Airtable-base.
- Maak geen parallelle tabellen wanneer de bestaande RZD 5.1-tabel dezelfde functie heeft.
- Voer geen productie-write uit voordat een volledige dry-run succesvol en gecontroleerd is.

---

# Volgende ontwikkelsessie

1. documentationMapping.js controleren en synchroniseren met de definitieve Documentation Engine-status.
2. CHANGELOG.md aanvullen met de afgeronde Documentation Engine-werkzaamheden.
3. Volledige documentatie-audit uitvoeren.
4. Bestaande tabel Modules analyseren.
5. Bestaande tabel Beoordelingspunten analyseren.
6. Bestaande tabel Accommodatie beoordelingen analyseren.
7. Exacte Canon-naar-Airtable veldmapping bepalen.
8. Naam-/tabelmapping in de Builder definiëren.
9. Builder aanpassen waar nodig.
10. Volledige dry-run uitvoeren.
11. Resultaat controleren.
12. Pas daarna eventueel productie-synchronisatie uitvoeren.

---

# Gerelateerde documentatie

- ARCHITECTURE.md
- CHANGELOG.md
- BACKLOG.md
- CHECKPOINT.md
- AI_RULES.md

---

# Opmerking

Builder 2.0 wordt beschouwd als de stabiele basis van het project.

Vanaf dit moment wordt alle nieuwe ontwikkeling uitgevoerd binnen Builder 3.0.

De Builder wordt niet langer ontworpen rondom Airtable, maar rondom het Canon Model. Airtable is daarmee één van de synchronisatiedoelen geworden, naast WordPress, exports en toekomstige API-koppelingen.

De bestaande RZD 5.1 Airtable-base blijft daarbij de actieve database.

De volgende sessie moet niet opnieuw beginnen met het aanmaken van Airtable-tabellen of het instellen van een nieuwe base.

De verbinding met RZD 5.1 is al succesvol gevalideerd.

De eerstvolgende taak is het analyseren en mappen van de bestaande structuur.

<!-- RZD-AUTO:START PROJECT_STATUS -->
### Documentation Engine actuele status

- 3A — documentatiestructuur gevalideerd
- 3B — documentation mapping vastgesteld
- 3C — mapping geladen en toegepast
- 3D — concrete documentgeneratie getest
- 3E — bestaande headings gevalideerd
- 3F — managed-block diff gevalideerd
- 3G — gecontroleerde document-write beschikbaar

**Write-status:** gecontroleerde write-fase actief.

**Airtable:** geen writes uitgevoerd door de Documentation Engine.

**GitHub:** wijzigingen worden via de lokale Git-workflow gecommit en gepusht.
<!-- RZD-AUTO:END PROJECT_STATUS -->
