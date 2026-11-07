# BACKLOG

| Eigenschap | Waarde |
|---|---|
| Project | RZD Builder |
| Document | BACKLOG.md |
| Status | Actief |
| Rol | Centrale projectbacklog |
| Laatste wijziging | 06-11-2026 |
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

🟡 OPEN — HERBEVESTIGING NODIG

**Prioriteit**

⭐⭐⭐⭐⭐

**Doel**

Vaststellen of de eerder gerapporteerde BuilderKernel-review ook geldt voor de huidige werkboom.

Eerdere versies van de projectstatus melden A002 als afgerond, maar de afronding is in deze documentatie-update niet opnieuw onderbouwd.

Totdat actuele evidence is bevestigd, blijft de taak open.

**Controlepunten**

- verantwoordelijkheden volledig scheiden;
- afhankelijkheden controleren;
- resterende legacy identificeren;
- actieve build-pipeline volledig documenteren;
- eerdere afrondingsclaim en actuele code-/testevidence met elkaar in lijn brengen.

**Afrondingscriterium**

De review is opnieuw uitgevoerd en de bevindingen zijn onderbouwd met actuele code- en testevidence.

---

### A003 — Legacy opschonen

**Status**

🟢 AFGEROND IN DE HUIDIGE WERKBOOM — COMMITSTATUS NIET BEVESTIGD

**Prioriteit**

⭐⭐⭐⭐

**Doel**

Legacy-bestanden controleren en de bekende opruiming vastleggen.

**Bevestigde bevindingen uit PROJECT_STATUS.md en CHECKPOINT.md**

- `services/fieldDefinition.js` is in de huidige werkboom verwijderd.
- De eerder genoemde historische kopie `builders/builder_werkend_2026-07-26.js` is niet aangetroffen.
- De taak is afgerond voor de huidige werkboom.
- Dit bevestigt niet dat de verwijdering in Git is gecommit.

**Resterend buiten deze taak**

De commitstatus moet afzonderlijk worden bevestigd zodra de Git-repository beschikbaar is.

Dit is geen reden om de cleanup in de huidige werkboom opnieuw als gedeeltelijk te registreren.

---

### A004 — CampingAggregate presentatie-/publicatielaag

**Status**

🟡 GEDEELTELIJK GEREALISEERD — RESTANT OPEN

**Prioriteit**

⭐⭐⭐⭐

**Doel**

Borgen dat `CampingAggregate` via `services/campingReadService.js` volledig en correct wordt gepresenteerd, zonder de bestaande schema-sync Builder (`BuilderKernel` / `BuilderWorkflow` / `SynchronizationCoordinator`) onnodig te verbouwen.

**Context**

- De read-/aggregatielaag bestaat.
- `scripts/previewCamping.js` bevat een lokale HTML- en JSON-previewrunner.
- De WordPress-mapper en payloadvalidatie ondersteunen CampingAggregate Pages.
- Preview- en mocktestbestanden zijn aanwezig.
- Deze tests zijn niet uitgevoerd tijdens deze documentatie-update.
- Historische testresultaten gelden alleen voor de toenmalige testuitvoering.
- De inhoudelijke volledigheid van het aggregate en de actuele preview is niet in deze stap opnieuw gevalideerd.
- Eerdere projectnotities melden dat het straatadres niet in openbare content wordt getoond, een dubbele Page-titel is verwijderd en geen slug- of featured-imagevelden zijn toegevoegd.
- Deze eerdere bevindingen zijn hier niet opnieuw gevalideerd.
- De vastgelegde accommodatiepagina-layout blijft het historische ontwerpuitgangspunt.

**Resterend**

- bevestigen welke velden en gekoppelde gegevens nog in het aggregate ontbreken;
- de preview-inhoud controleren op basis van actuele gegevens en bestaande tests;
- ontbrekende informatie niet invullen;
- geen lege of niet-bestaande informatie als inhoud tonen.

**Afrondingscriterium**

De gegevensdekking en preview zijn gecontroleerd met actuele gegevens en de relevante tests zijn uitgevoerd.

---

### A005 — WordPress-publicatie op basis van CampingAggregate

**Status**

🟡 GEDEELTELIJK GEREALISEERD — RESTANT OPEN

**Prioriteit**

⭐⭐⭐

**Doel**

De bestaande flow gebruikt `CampingAggregate` voor WordPress Page-payloads en ondersteunt gevalideerde draft-aanmaak en paginahergebruik.

De huidige payload blijft `draft`.

Een bestaande match wordt hergebruikt maar niet automatisch bijgewerkt.

Dit is geen volledige openbare publicatie.

**Afhankelijkheid**

Volgt op A004.

**Resterend**

- behoud de expliciete dry-run-/apply-grenzen voor updates;
- herbevestig de historische live draft-status alleen na expliciete toestemming;
- een gecombineerde live Airtable-/WordPress-eindtest is niet aangetoond;
- een live-test vereist een afzonderlijk goedgekeurde, veilige scope.

**Afrondingscriterium**

De draft-flow, bestaande Page-hergebruikflow en afzonderlijke update-flow zijn gecontroleerd.

Live-validatie vindt uitsluitend plaats na expliciete toestemming en met een veilige scope.

Openbare publicatie valt niet automatisch onder deze taak.

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

### V004 — Voorzieningstype-specifieke beoordelingspunten

**Status**

🟢 OPEN

**Doel**

Voorzieningen gebruiken voorlopig bestaande Canon-punten/modules, gedeeld met accommodaties.

Onderzoeken of en wanneer specifieke beoordelingspunten per voorzieningstype nodig zijn.

---

### V005 — Bron/verificatie-administratie

**Status**

🟢 OPEN

**Doel**

Het interne `CampingAggregate`-datamodel bevat al een optioneel `bron`-blok:

- type;
- geverifieerd;
- referentie.

Dit is voorbereid op AI-informatie en geverifieerde externe reviews.

Er is nog geen bronadministratie geïmplementeerd.

---

### V006 — Volledige beoordeling aangepaste accommodaties

**Status**

🟢 OPEN

**Doel**

Aangepaste accommodatie is voorlopig alleen een beschikbaarheidslaag:

- Ja;
- Nee;
- Onbekend.

Een volledige beoordeling van een specifieke stacaravan of bungalow is een latere uitbreiding.

---

### V007 — Paginatie in airtablePointResolver

**Status**

🟢 OPEN

**Doel**

`airtablePointResolver.getModules()` en `getPoints()` verwerken geen `offset`/paginatie.

Deze methoden worden ook gebruikt door `pointLookupCache.js`.

Bij meer dan 100 records in Modules of Beoordelingspunten worden records gemist.

Dit aandachtspunt is bewust nog niet opgelost.

---

### V008 — RZD-iconenset afzonderlijk ontwerpen en testen

**Status**

🟢 OPEN

**Doel**

Een eigen, herkenbare RZD-iconentaal ontwikkelen voor de vaste categorieën op camping- en bestemmingspagina's.

**Uitgangspunten**

- werk eerst afzonderlijke iconen uit en beoordeel deze apart;
- ontwerp niet opnieuw direct een volledige set van negen iconen;
- test elk icoon op klein formaat, onder meer op circa 32, 48 en 80 px;
- gebruik sterke contouren, weinig details en een moderne, herkenbare stijl;
- houd aqua/teal, terra en rustige neutralen als RZD-kleurwereld aan;
- maak iconen bruikbaar met tekst en zelfstandig in buttons, kaarten, filters en eventueel mobiele navigatie.

De categorieën en concrete ontwerpreferenties staan in **PROJECT_STATUS.md**.

De iconenset is nog niet definitief.

---

## P3 — Documentatie

### D001 — ARCHITECTURE.md actualiseren

**Status**

🟢 OPEN

**Doel**

De architectuurdocumentatie laten aansluiten op de actuele code en de verschillende workflows.

---

### D002 — README.md synchroniseren

**Status**

🟢 OPEN

**Doel**

Synchroniseren met de actuele architectuur, projectstatus en documentatie-ingang.

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
7. CHANGELOG bijwerken indien afgerond
8. Nieuw CHECKPOINT maken

---

# Afgeronde taken

### B001 — services/updateService.js

**Status**

AFGEROND / COMPLETED

- De hardcoded payloadkwestie is opgelost.
- `testUpdateService.js` is omgebouwd naar een veilige lokale mocktest.
- `node .\testUpdateService.js` is succesvol uitgevoerd.

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
