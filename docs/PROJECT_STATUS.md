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
| Builder 3.0  | 🟡 Ontwerpfase           |
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

Er is nog geen productie-write uitgevoerd voor de nieuwe schema-aanpassing.

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

🟡 Start volgende ontwikkelfase

Builder 3.0 bouwt voort op de stabiele basis van Builder 2.0.

Nieuwe functionaliteit wordt uitsluitend nog binnen Builder 3.0 ontwikkeld.

De huidige focus ligt op de **Content Engine** en de koppeling met de bestaande RZD 5.1-structuur.

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

## Documentation Engine

Genereert automatisch:

- PROJECT_STATUS
- CHANGELOG
- ARCHITECTURE
- API-documentatie
- Module-documentatie

De automatische documentatievoorziening blijft onderdeel van de Builder 3.0-agenda.

Het doel is dat status, checkpoints en relevante projectdocumentatie uiteindelijk automatisch worden bijgewerkt in plaats van handmatig te moeten worden onderhouden.

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

Start:

- Content Engine
- Documentation Engine
- Export Engine

Status

🟡 Gereed om te starten

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

1. Bestaande tabel **Modules** analyseren.
2. Bestaande tabel **Beoordelingspunten** analyseren.
3. Bestaande tabel **Accommodatie beoordelingen** analyseren.
4. Exacte Canon-naar-Airtable veldmapping bepalen.
5. Naam-/tabelmapping in de Builder definiëren.
6. Builder aanpassen zodat de bestaande RZD 5.1-structuur wordt herkend.
7. Volledige dry-run uitvoeren.
8. Resultaat controleren.
9. Pas daarna synchronisatie uitvoeren.
10. Documentation Engine verder uitwerken.

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