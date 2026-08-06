# PROJECT STATUS

**Project:** RZD Builder

Dit document beschrijft de actuele status van het project. Het dient als centraal dashboard voor ontwikkelaars en AI-assistenten en wordt aan het begin van iedere ontwikkelsessie geraadpleegd.

---

# Project

## Naam

RZD Builder

## Doel

RZD Builder is een modulair ontwikkelplatform voor **Reizen zonder Drempels (RZD)**.

Het systeem ondersteunt het beheren, vergelijken, synchroniseren en publiceren van Airtable-schema's en gegevens, met een sterke focus op onderhoudbaarheid, betrouwbaarheid en uitbreidbaarheid.

De Builder is ontworpen om:

- modulair te zijn;
- stabiel te functioneren;
- veilig wijzigingen uit te voeren;
- eenvoudig uitbreidbaar te zijn;
- volledig testbaar te blijven.

---

# Actuele status

| Onderdeel | Status |
|-----------|--------|
| Ontwikkeling | 🟢 Actief |
| Kernarchitectuur | 🟢 Gestabiliseerd |
| BuilderKernel | 🟢 Actieve build-pipeline |
| Teststatus | 🟢 Alle kernfunctionaliteit succesvol getest |
| Documentatie | 🟢 Actief onderhouden |

---

# Actieve architectuur

De actieve build-pipeline wordt uitgevoerd door **BuilderKernel**.

De volledige architectuur is beschreven in:

- `ARCHITECTURE.md`

---

# Werkwijze

Iedere ontwikkelingstaak volgt dezelfde vaste workflow.

1. Analyse
2. Bespreken
3. Wijzigen
4. Testen
5. Documentatie bijwerken
6. Volgende taak bepalen

## Ontwikkelafspraken

- Werk altijd aan één bestand tegelijk.
- Geen wijzigingen zonder voorafgaande analyse.
- Test direct na iedere codewijziging.
- Gebruik Windows CMD voor alle testcommando's.
- Wacht bij meerdere opdrachten altijd op alle uitvoer voordat conclusies worden getrokken.
- Werk na iedere afgeronde taak de documentatie bij.
- Grote architectuurwijzigingen worden vooraf volledig onderzocht.

---

# Prioriteiten

## P0 — Kritiek

Geen open kritieke issues.

---

## P1 — Hoog

### BuilderKernel review

Doel:

- resterende verantwoordelijkheden controleren;
- afhankelijkheden verifiëren;
- laatste inconsistenties verwijderen.

Status:

🟡 Lopend

---

## P2 — Normaal

### Legacy-opruiming

Doel:

- ongebruikte bestanden identificeren;
- verouderde implementaties verwijderen;
- documentatie volledig synchroniseren.

Status:

🟡 Lopend

---

# Laatste afgeronde mijlpalen

Recent succesvol afgerond:

- BuilderKernel migratie
- updateService refactor
- Architectuuronderzoek
- Legacy-analyse

Voor de volledige wijzigingsgeschiedenis:

➡ **CHANGELOG.md**

---

# Reviewstatus

## Core

- BuilderKernel
- buildPipeline
- preflight
- moduleLoader
- builderContext
- builderMetadata
- runContextFactory

## Synchronisatie

- comparisonService
- fieldComparer
- differenceEngine
- synchronizationPlan
- synchronizationService
- rollbackPlanner
- rollbackService
- updatePlanner

## Metadata

- metadataEngine
- mcpEngine
- mcpService
- fieldOptionsFactory

## Services

- airtableAdapter
- auditService
- schemaValidator
- schemaExportService
- logger
- reportFormatter
- reportGenerator

## Legacy

Verwijderd:

- services/moduleRunner.js
- builders/builder.js

Nog aanwezig:

- services/fieldDefinition.js (legacy, momenteel ongebruikt)

---

# Laatste succesvolle test

**Datum**

27-07-2026

**Uitgevoerd**

```cmd
node tools\test-module-runner.js
```

**Resultaat**

- ✅ BuilderKernel
- ✅ Vergelijking
- ✅ Synchronisatie
- ✅ Rollback
- ✅ Metadata
- ✅ Rapportgeneratie

Alle testen succesvol afgerond.

---

# Gerelateerde documentatie

Lees afhankelijk van de taak:

- `ARCHITECTURE.md`
- `BACKLOG.md`
- `CHANGELOG.md`
- `CHECKPOINT.md`
- `AI_RULES.md`

---

# Opmerking

Dit document beschrijft uitsluitend de **actuele projectstatus**.

Voor:

- wijzigingsgeschiedenis → `CHANGELOG.md`
- sessieoverdracht → `CHECKPOINT.md`
- architectuur → `ARCHITECTURE.md`
- planning → `BACKLOG.md`
- AI-richtlijnen → `AI_RULES.md`