# RZD Builder

> **Professional Builder Framework for Reizen zonder Drempels (RZD)**

RZD Builder heeft afzonderlijke workflows voor schema-/configuratiesynchronisatie, het read-only samenstellen van een CampingAggregate, lokale previews en een gecontroleerde WordPress Page-flow.

Nieuwe Pages worden als `draft` aangemaakt; een bestaande Page kan worden hergebruikt zonder automatisch te worden bijgewerkt. Openbare publicatie en een volledige live-keten zijn niet aangetoond.

---

# Kernfunctionaliteiten

- BuilderKernel
- Compiler- en Pipeline-componenten zijn aanwezig, maar maken geen deel uit van de huidige `index.js build`-uitvoeringsvolgorde
- Metadata-gestuurde verwerking
- Schema-/configuratiesynchronisatie
- Read-only CampingAggregate
- Lokale campingpreview
- Gecontroleerde WordPress Page-flow met draft-aanmaak en hergebruik
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
├── content/
├── core/
├── developer/
├── docs/
├── engines/
├── generated/
├── logs/
├── mcp/
├── modules/
├── node_modules/
├── reports/
├── scripts/
├── services/
├── tests/
├── tools/
│
├── index.js
└── test*.js
```

> **Opmerking**
>
> Deze projectstructuur is een schematische, niet-volledige weergave. Onder meer `content/`, `developer/`, `reports/`, `scripts/` en `tests/` zijn aanwezig; niet iedere map bevat broncode.

---

# Documentatie

De canonieke projectdocumentatiesuite staat in **docs/**. Aanvullende ontwikkelaarshandleidingen en historische of dubbele bestanden kunnen elders in de repository staan.

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
| WORDPRESS_ARCHITECTURE.md | Gecontroleerde WordPress-concept- en Page-flow |

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

Builder 2.0 is de stabiele basis; Builder 3.0 is in ontwikkeling. De huidige focus ligt op de Content Engine en de koppeling van het Canon Model aan de bestaande RZD 5.1 Airtable-structuur.

De CampingAggregate-preview en WordPress-draftflow zijn gedeeltelijk gerealiseerd. De volledigheid van preview-inhoud en een gecombineerde live-keten zijn niet aangetoond. Raadpleeg `docs/PROJECT_STATUS.md` en `docs/BACKLOG.md` voor de actuele status en openstaande werkzaamheden.

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

De officiële projectdocumentatiesuite bevindt zich in **docs/**.

De BuilderKernel coördineert de schema-/configuratiesynchronisatie; andere workflows starten via hun eigen scripts en services.
