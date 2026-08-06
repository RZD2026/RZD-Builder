# RZD Builder

> **Professional Builder Framework for Reizen zonder Drempels (RZD)**

RZD Builder is een modulair ontwikkelplatform voor het beheren, valideren, synchroniseren en publiceren van gegevens voor het project **Reizen zonder Drempels (RZD)**.

De Builder is ontworpen met de nadruk op betrouwbaarheid, onderhoudbaarheid, uitbreidbaarheid en een duidelijke scheiding van verantwoordelijkheden. Dankzij de modulaire architectuur kunnen nieuwe functionaliteiten, connectors en publicatieplatformen eenvoudig worden toegevoegd.

---

# Kernfunctionaliteiten

- BuilderKernel
- Compiler Framework
- Pipeline-architectuur
- Metadata-gestuurde verwerking
- Synchronisatie met externe systemen
- Doctor Framework
- Validatie
- Logging
- Rapportage
- Professionele documentatiesuite

---

# Projectstructuur

```text
RZD Builder
│
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
│
├── adapters/
├── airtableScripts/
├── backup/
├── build/
├── builders/
├── canon/
├── compiler/
├── config/
├── core/
├── docs/
├── engines/
├── generated/
├── logs/
├── mcp/
├── modules/
├── node_modules/
├── services/
├── tools/
│
├── index.js
└── test*.js
```

> **Opmerking**
>
> Mappen zoals `node_modules/`, `logs/` en gegenereerde bestanden worden niet opgenomen in Git en maken geen onderdeel uit van de broncode.

---

# Documentatie

Alle projectdocumentatie bevindt zich in de map **docs/**.

| Document | Omschrijving |
|----------|--------------|
| README.md | Startpunt van de documentatiesuite |
| AGENTS.md | Startpunt voor AI-coding agents |
| PROJECT_STATUS.md | Actuele projectstatus |
| CHECKPOINT.md | Overdracht tussen ontwikkelsessies |
| BACKLOG.md | Openstaande werkzaamheden |
| CHANGELOG.md | Historische wijzigingen |
| ARCHITECTURE.md | Technische architectuur |
| AI_RULES.md | Ontwikkelworkflow voor AI |
| CONTRIBUTING.md | Richtlijnen voor bijdragen |
| DOCUMENTATION_ARCHITECTURE.md | Opbouw van de documentatiesuite |
| ROADMAP.md | Lange termijn planning |
| RELEASE_NOTES.md | Releasehistorie |
| WORDPRESS_ARCHITECTURE.md | WordPress-publicatiearchitectuur |

---

# Ontwikkelprincipes

RZD Builder is gebaseerd op de volgende uitgangspunten:

- Modulaire architectuur
- Eén verantwoordelijkheid per component
- Metadata boven hardcoded logica
- Kleine, veilige wijzigingen
- Testen na iedere wijziging
- Architectuur vóór implementatie
- Consistente documentatie
- Hoge onderhoudbaarheid

---

# Huidige status

**Actieve ontwikkeling**

De huidige focus ligt op:

- verdere ontwikkeling van de BuilderKernel;
- verdere modularisering van de compiler;
- uitbreiding van de pipeline;
- verdere Airtable-integratie;
- ontwikkeling van de WordPress-publicatiepipeline;
- voorbereiding van de eerste stabiele release.

---

# Nieuwe ontwikkelsessie

Iedere ontwikkelsessie start vanuit:

1. `docs/AGENTS.md`
2. `docs/CHECKPOINT.md`
3. `docs/PROJECT_STATUS.md`
4. `docs/BACKLOG.md`

Daarna wordt gewerkt volgens de richtlijnen uit **docs/AI_RULES.md**.

---

# Bijdragen

Alle ontwikkelrichtlijnen zijn vastgelegd in:

**docs/CONTRIBUTING.md**

---

# Licentie

Zie:

**LICENSE**

---

# Meer informatie

De volledige technische documentatie bevindt zich in de map **docs/**.

De documentatiesuite vormt samen met de BuilderKernel de centrale basis van het RZD Builder-project.

