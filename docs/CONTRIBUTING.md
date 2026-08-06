# CONTRIBUTING

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | CONTRIBUTING.md |
| Status | Actief |
| Rol | Ontwikkelrichtlijnen |
| Laatste wijziging | 06-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document beschrijft de algemene ontwikkelrichtlijnen voor bijdragen aan **RZD Builder**.

Het doel is om ervoor te zorgen dat iedere wijziging:

- veilig wordt uitgevoerd;
- aansluit op de bestaande architectuur;
- voldoende wordt getest;
- volledig wordt gedocumenteerd;
- de onderhoudbaarheid van het project vergroot.

De dagelijkse ontwikkelworkflow is vastgelegd in **AI_RULES.md**.

---

# Ontwikkelfilosofie

RZD Builder wordt ontwikkeld volgens de volgende uitgangspunten:

- kwaliteit boven snelheid;
- kleine, gecontroleerde wijzigingen;
- modulaire architectuur;
- uitbreidbaarheid;
- onderhoudbaarheid;
- testbaarheid;
- documentatie als integraal onderdeel van de ontwikkeling.

---

# Ontwikkelproces

Iedere wijziging verloopt volgens dezelfde hoofdlijn:

1. Analyse
2. Bespreken
3. Goedkeuring
4. Implementatie
5. Testen
6. Documentatie bijwerken
7. CHANGELOG.md bijwerken (indien van toepassing)
8. CHECKPOINT.md bijwerken bij het afsluiten van de sessie

De volledige werkwijze is beschreven in **AI_RULES.md**.

---

# Projectstructuur

Belangrijke onderdelen van RZD Builder zijn:

- BuilderKernel
- Compiler Pipeline
- Metadata Services
- Synchronisatie
- Validators
- WordPress-publicatie
- Documentatiesuite

Nieuwe functionaliteit sluit altijd aan op de bestaande architectuur.

---

# Codekwaliteit

Nieuwe code voldoet minimaal aan de volgende uitgangspunten:

- één duidelijke verantwoordelijkheid per component;
- geen dubbele logica;
- hergebruik van bestaande componenten;
- consistente naamgeving;
- leesbare structuur;
- minimale afhankelijkheden;
- bestaande architectuur respecteren.

---

# Testen

Iedere wijziging wordt getest voordat deze wordt afgerond.

Afhankelijk van de wijziging kunnen onder andere de volgende controles worden uitgevoerd:

- functionele testen;
- regressietesten;
- validatie;
- foutafhandeling;
- integratietesten.

Indien relevant worden testresultaten opgenomen in de documentatie.

---

# Documentatie

Documentatie maakt integraal onderdeel uit van iedere wijziging.

Werk uitsluitend de documenten bij die inhoudelijk door de wijziging worden geraakt.

Afhankelijk van de wijziging kunnen onder andere worden bijgewerkt:

- PROJECT_STATUS.md
- BACKLOG.md
- ARCHITECTURE.md
- CHANGELOG.md
- CHECKPOINT.md
- ROADMAP.md
- RELEASE_NOTES.md

Documentatie is onderdeel van de definitie van **gereed**.

---

# Git-richtlijnen

Bij het werken met Git gelden de volgende uitgangspunten:

- één logisch samenhangende wijziging per commit;
- duidelijke en beschrijvende commitberichten;
- wijzigingen eerst testen;
- relevante documentatie gelijktijdig bijwerken;
- geen tijdelijke of gegenereerde bestanden committen.

---

# AI-ondersteuning

AI-assistenten ondersteunen de ontwikkeling, maar nemen geen architectuurbeslissingen zelfstandig.

Voor iedere AI geldt:

- volg de werkwijze uit **AGENTS.md**;
- respecteer de bestaande architectuur;
- analyseer voordat wijzigingen worden uitgevoerd;
- doe geen aannames wanneer informatie ontbreekt;
- onderbouw voorgestelde wijzigingen;
- houd documentatie en broncode synchroon.

---

# Gerelateerde documentatie

Kern:

- README.md
- AGENTS.md
- PROJECT_STATUS.md
- BACKLOG.md
- ARCHITECTURE.md
- AI_RULES.md

Aanvullend:

- CHANGELOG.md
- CHECKPOINT.md
- DOCUMENTATION_ARCHITECTURE.md
- ROADMAP.md
- RELEASE_NOTES.md
- WORDPRESS_ARCHITECTURE.md

---

# Opmerking

CONTRIBUTING.md beschrijft de algemene ontwikkelrichtlijnen van RZD Builder.

De dagelijkse ontwikkelworkflow is vastgelegd in **AI_RULES.md**.

De startprocedure voor AI-coding agents is beschreven in **AGENTS.md**.