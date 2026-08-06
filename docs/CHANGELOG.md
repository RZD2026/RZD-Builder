# CHANGELOG

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | CHANGELOG.md |
| Status | Actief |
| Rol | Historisch wijzigingsoverzicht |
| Laatste wijziging | 05-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document registreert alle **belangrijke afgeronde wijzigingen** binnen RZD Builder.

Iedere afgeronde ontwikkelingstaak wordt na voltooiing vanuit **BACKLOG.md** naar dit document verplaatst.

De changelog vormt daarmee de officiële historische registratie van de ontwikkeling van het project.

Kleine experimenten, tussentijdse commits en tijdelijke wijzigingen blijven onderdeel van de Git-geschiedenis.

---

# Registratieregels

Een wijziging wordt alleen opgenomen wanneer:

- de taak volledig is afgerond;
- de wijziging getest is;
- de documentatie is bijgewerkt;
- de wijziging daadwerkelijk onderdeel wordt van het project.

Iedere registratie bevat minimaal:

- datum;
- werkcode;
- type wijziging;
- reden;
- uitgevoerde wijziging;
- resultaat.

---

# Werkcodes

| Code | Onderdeel |
|------|-----------|
| CORE | BuilderKernel |
| COMP | Compiler |
| PIPE | Pipeline |
| SYNC | Synchronisatie |
| API | Metadata |
| DR | Doctor Framework |
| VAL | Validators |
| DOC | Documentatie |
| TEST | Testen |
| CFG | Configuratie |
| REL | Releases |

---

# Wijzigingen

## 2026-07-29

### DOC-001 — Professionele documentatiesuite

**Type**

Documentatie

**Waarom**

De bestaande documentatie was onvoldoende gestructureerd voor langdurige ontwikkeling.

**Wijziging**

Complete documentatiesuite ontworpen en gestandaardiseerd.

Nieuwe documenten:

- README
- PROJECT_STATUS
- ARCHITECTURE
- BACKLOG
- CHANGELOG
- CHECKPOINT
- AI_RULES
- RELEASE_NOTES

**Resultaat**

- Professionele documentatiestructuur.
- Duidelijke verantwoordelijkheden per document.
- Betere ondersteuning voor AI en ontwikkelaars.

---

### CORE-001 — BuilderKernel actief

**Type**

Refactor

**Waarom**

De oorspronkelijke Builder-implementatie was moeilijk uitbreidbaar.

**Wijziging**

BuilderKernel ingevoerd als centrale build-pipeline.

Verwijderd:

- services/moduleRunner.js
- builders/builder.js

**Resultaat**

- Eén centrale uitvoeringslaag.
- Minder afhankelijkheden.
- Betere onderhoudbaarheid.

---

### PIPE-001 — Pipeline Framework

**Type**

Nieuwe functionaliteit

**Waarom**

Voorbereiden op uitbreidbare build-processen.

**Wijziging**

Pipeline Framework geïntroduceerd.

**Resultaat**

- Losse stages.
- Uitbreidbare pipeline.
- Betere scheiding van verantwoordelijkheden.

---

### COMP-001 — Compiler Framework

**Type**

Nieuwe functionaliteit

**Waarom**

Ondersteuning voor een modulaire compilerarchitectuur.

**Wijziging**

Nieuw compilerframework ontwikkeld.

**Resultaat**

- Reference Resolver.
- Statistics Builder.
- Interne datamodellen.
- Modulaire compiler.

---

### SYNC-001 — Dynamische updateService

**Type**

Refactor

**Waarom**

Hardcoded PATCH-opbouw maakte onderhoud lastig.

**Wijziging**

PATCH-payload volledig metadata-gestuurd gemaakt.

**Resultaat**

- Dynamische payload.
- Minder onderhoud.
- Minder foutgevoelig.

---

### DR-001 — Doctor Framework

**Type**

Nieuwe functionaliteit

**Waarom**

Verbeteren van validatie en kwaliteitscontrole.

**Wijziging**

Doctor Framework ontwikkeld.

**Resultaat**

- Uitgebreide kwaliteitscontrole.
- Betere foutanalyse.
- Rapportage.

---

# Gerelateerde documentatie

- README.md
- PROJECT_STATUS.md
- BACKLOG.md
- ARCHITECTURE.md
- AI_RULES.md
- RELEASE_NOTES.md

---

# Opmerking

De CHANGELOG bevat uitsluitend **afgeronde werkzaamheden**.

Openstaande werkzaamheden behoren in **BACKLOG.md**.

De actuele projectstatus wordt bijgehouden in **PROJECT_STATUS.md**.

Architectuurwijzigingen worden beschreven in **ARCHITECTURE.md**.

Ontwikkelrichtlijnen zijn vastgelegd in **AI_RULES.md**.