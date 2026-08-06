# BACKLOG

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | BACKLOG.md |
| Status | Actief |
| Rol | Centrale projectbacklog |
| Laatste wijziging | 05-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document bevat alle **openstaande**, **lopende** en **geplande** werkzaamheden van RZD Builder.

Iedere taak doorloopt dezelfde vaste ontwikkelworkflow.

Afgeronde werkzaamheden worden uit dit document verwijderd en vastgelegd in **CHANGELOG.md**.

---

# Workflow

Iedere taak doorloopt onderstaande status.

```text
OPEN
↓
ANALYSE
↓
GOEDGEKEURD
↓
IN UITVOERING
↓
GETEST
↓
AFGEROND
↓
VERPLAATST NAAR CHANGELOG
```

Nieuwe ideeën worden nooit direct uitgevoerd.

Ze worden eerst geanalyseerd, besproken en vervolgens ingepland.

---

# Prioriteiten

## P0 — Kritieke bugs

Geen open kritieke issues.

---

## P1 — Architectuur

### A002 — Volledige review BuilderKernel

**Status**

🟡 LOPEND

**Prioriteit**

⭐⭐⭐⭐⭐

**Doel**

Volledige controle van de actieve BuilderKernel-architectuur.

**Controlepunten**

- verantwoordelijkheden volledig scheiden;
- afhankelijkheden controleren;
- resterende legacy identificeren;
- actieve build-pipeline volledig documenteren.

---

### A003 — Legacy opschonen

**Status**

🟢 OPEN

**Prioriteit**

⭐⭐⭐⭐

**Doel**

Controleren welke oude bestanden veilig verwijderd kunnen worden.

**Bekende aandachtspunten**

- services/fieldDefinition.js maakt geen onderdeel uit van de actieve BuilderKernel.
- builders/builder_werkend_2026-07-26.js is uitsluitend een historische kopie.

Bestanden worden pas verwijderd nadat objectief is vastgesteld dat er geen afhankelijkheden meer bestaan.

---

## P2 — Verbeteringen

### V001 — Logger uitbreiden

**Status**

🟢 OPEN

**Doel**

Verbeteren van logging en rapportage.

**Mogelijke uitbreidingen**

- uitgebreidere samenvatting;
- duidelijkere foutmeldingen;
- extra timinginformatie.

---

### V002 — SchemaValidator uitbreiden

**Status**

🟢 OPEN

**Doel**

Onderzoeken of aanvullende validaties wenselijk zijn.

---

### V003 — HealthCheck verbeteren

**Status**

🟢 OPEN

**Doel**

Alleen uitbreiden wanneer dit aantoonbaar onderhoudbaarheid of leesbaarheid verbetert.

---

## P3 — Documentatie

### D001 — ARCHITECTURE.md actualiseren

**Status**

🟢 OPEN

---

### D002 — README.md synchroniseren

**Status**

🟢 OPEN

Doel:

Synchroniseren met de actuele BuilderKernel-architectuur.

---

# Ideeën

Nieuwe ideeën worden hier verzameld.

Voor ieder idee geldt:

- eerst analyseren;
- daarna bespreken;
- vervolgens prioriteren;
- pas daarna een taaknummer toekennen.

Ideeën worden nooit direct uitgevoerd.

---

# Volgende sessie

Start iedere nieuwe ontwikkelsessie met:

1. README.md
2. PROJECT_STATUS.md
3. BACKLOG.md
4. CHECKPOINT.md

Daarna:

1. Analyse
2. Bespreken
3. Goedkeuring
4. Wijzigen
5. Testen
6. Documentatie bijwerken
7. CHANGELOG bijwerken (indien afgerond)
8. Nieuw CHECKPOINT maken

---

# Gerelateerde documentatie

- README.md
- PROJECT_STATUS.md
- ARCHITECTURE.md
- AI_RULES.md
- CHANGELOG.md
- CHECKPOINT.md

---

# Opmerking

De BACKLOG is uitsluitend bedoeld voor werkzaamheden die nog niet volledig zijn afgerond.

Na afronding wordt een taak verwijderd uit dit document en opgenomen in **CHANGELOG.md**.

Hierdoor blijft de backlog compact, actueel en gericht op toekomstig werk.