# AGENTS

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | AGENTS.md |
| Status | Actief |
| Rol | Startpunt voor AI-coding agents |
| Laatste wijziging | 06-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document is het centrale startpunt voor AI-coding agents die aan **RZD Builder** werken.

Het beschrijft:

- hoe een nieuwe ontwikkelsessie wordt gestart;
- welke documentatie eerst gelezen moet worden;
- hoe relevante informatie wordt gevonden;
- wanneer documentatie moet worden bijgewerkt.

Dit document bevat **geen ontwikkelregels** en **geen architectuurregels**. Daarvoor wordt verwezen naar de daarvoor bestemde documentatie.

---

# Ondersteunde AI-agents

Dit document is bedoeld voor AI-coding agents die rechtstreeks met de repository werken, waaronder:

- GitHub Copilot
- GitHub Copilot Agent
- Gemini CLI
- Claude Code
- Roo Code
- Cline

Nieuwe AI-agents kunnen dezelfde werkwijze volgen.

---

# Ontwikkelsessie starten

Start iedere nieuwe sessie volgens onderstaande volgorde.

## Stap 1 – Project begrijpen

Lees altijd eerst:

1. docs/README.md
2. docs/CHECKPOINT.md
3. docs/PROJECT_STATUS.md
4. docs/BACKLOG.md
5. docs/ARCHITECTURE.md
6. docs/AI_RULES.md

Deze documenten vormen samen de minimale context voor iedere ontwikkelsessie.

---

## Stap 2 – Taak bepalen

Bepaal vervolgens:

- de actuele projectstatus;
- de eerstvolgende taak;
- welke onderdelen van de architectuur relevant zijn;
- welke aanvullende documentatie nodig is.

Lees uitsluitend aanvullende documenten wanneer de taak daar betrekking op heeft.

Mogelijke aanvullende documentatie:

- DOCUMENTATION_ARCHITECTURE.md
- WORDPRESS_ARCHITECTURE.md
- ROADMAP.md
- CHANGELOG.md
- CONTRIBUTING.md
- RELEASE_NOTES.md

---

## Stap 3 – Ontwikkelen

Tijdens de uitvoering gelden altijd de regels uit:

**docs/AI_RULES.md**

Respecteer altijd de architectuur uit:

**docs/ARCHITECTURE.md**

---

# Documentatiebeheer

Na iedere afgeronde taak wordt eerst bepaald welke documentatie daadwerkelijk door de wijziging is geraakt.

Werk uitsluitend de documenten bij waarvoor een inhoudelijke wijziging noodzakelijk is.

Pas nooit documentatie aan zonder inhoudelijke aanleiding.

---

# Veelvoorkomende situaties

| Gebeurtenis | Mogelijke documenten |
|-------------|----------------------|
| Nieuwe taak | BACKLOG.md |
| Taak afgerond | BACKLOG.md, CHANGELOG.md, CHECKPOINT.md |
| Projectstatus gewijzigd | PROJECT_STATUS.md |
| Architectuur gewijzigd | ARCHITECTURE.md |
| Nieuwe planning | ROADMAP.md |
| WordPress-architectuur gewijzigd | WORDPRESS_ARCHITECTURE.md |
| Nieuwe ontwikkelrichtlijnen | AI_RULES.md of CONTRIBUTING.md |
| Nieuwe release | RELEASE_NOTES.md |

Deze tabel is een richtlijn.

Niet ieder genoemd document hoeft daadwerkelijk te worden aangepast.

---

# Werkwijze

Bij iedere taak:

1. Analyseer de opdracht.
2. Bepaal welke bestanden worden geraakt.
3. Geef een kort uitvoeringsplan.
4. Vraag goedkeuring wanneer de wijziging invloed heeft op de architectuur of grote delen van het project.
5. Voer de wijziging uit.
6. Voer de benodigde testen uit.
7. Bepaal welke documentatie moet worden bijgewerkt.
8. Geef een overzicht van alle gewijzigde bestanden.

---

# Belangrijke uitgangspunten

- Respecteer altijd de bestaande projectstructuur.
- Doe geen aannames wanneer informatie ontbreekt.
- Voorkom dubbele code.
- Voorkom dubbele documentatie.
- Houd wijzigingen zo klein mogelijk.
- Licht keuzes kort toe wanneer dit helpt bij het begrijpen van de wijziging.

---

# Gerelateerde documentatie

Kern:

- docs/README.md
- docs/PROJECT_STATUS.md
- docs/BACKLOG.md
- docs/ARCHITECTURE.md
- docs/AI_RULES.md
- docs/CHECKPOINT.md

Aanvullend:

- docs/DOCUMENTATION_ARCHITECTURE.md
- docs/WORDPRESS_ARCHITECTURE.md
- docs/ROADMAP.md
- docs/CHANGELOG.md
- docs/CONTRIBUTING.md
- docs/RELEASE_NOTES.md

---

# Opmerking

AGENTS.md is uitsluitend bedoeld als **ingangspunt voor AI-coding agents**.

Dit document bevat geen projectstatus, geen architectuurbeschrijving en geen ontwikkelregels.

Die informatie blijft ondergebracht in de daarvoor aangewezen documenten volgens de documentatiearchitectuur van RZD Builder.