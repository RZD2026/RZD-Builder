# BACKLOG

| Eigenschap | Waarde |
|---|---|
| Project | RZD Builder |
| Document | BACKLOG.md |
| Status | Actief |
| Rol | Centrale projectbacklog |
| Laatste wijziging | 09-11-2026 |
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

**Historische prioriteiten**

`MASTER-WERKDOSSIER` versie 4 bevat nog historische P0-statussen voor SYNC-01,
SYNC-03 en TEST-01, en P0/P3-statussen voor MCP-02 en CHOICE-01. Deze zijn
niet allemaal opnieuw bevestigd of als opgelost gemarkeerd. De P0-sectie
hierboven betekent daarom: geen als actuele P0 bevestigde backlogtaak; zij
beslecht de historische registerstatussen niet. De historische
prioriteitsdiscrepantie blijft onbeslist; A002 betreft de BuilderKernel-review
hieronder en harmoniseert deze prioriteiten niet. NONDOC-06/NONDOC-07 blijven
open. Het masterdossier markeert ook MOBILE-01.2 t/m+MOBILE-01.5 als P0 OPEN, terwijl A006 in deze backlog P1 is; een eerdere
voorziening-reviewappendix bevat daarnaast twee P0-controlepunten zonder eigen
backlog-ID. Deze prioriteiten zijn niet geharmoniseerd. SYNC-01 is in de
eerdere code-only controle als open tellerprobleem aangetroffen; de historische
P0-ernst is niet opnieuw beoordeeld.

---

## P1 — Architectuur

### A002 — Volledige review BuilderKernel

**Status**

🟢 AFGEROND / COMPLETED

**Prioriteit**

⭐⭐⭐⭐⭐

**Doel**

De BuilderKernel-review is herbevestigd aan de hand van de huidige werkboom en de
actuele A002-criteria.

**Controlepunten**

- verantwoordelijkheden volledig scheiden;
- afhankelijkheden controleren;
- resterende legacy identificeren;
- actieve build-pipeline volledig documenteren;
- eerdere afrondingsclaim en actuele code-/testevidence met elkaar in lijn brengen.

**Afrondingscriterium**

De review is opnieuw uitgevoerd en de bevindingen zijn onderbouwd met actuele code- en testevidence.

**Bevindingen**

- `index.js build` roept `BuilderKernel.buildModule()` aan; de kernel coördineert
  bootstrap, workflow, synchronisatie, rapportage en logging.
- `builders/builder.js` bestaat nu als dunne wrapper naar dezelfde kernel. Er
  zijn geen huidige callsites voor de wrapper gevonden; de oude v1.4-workflow
  staat niet in dit bestand.
- `index.js validate` gebruikt een aparte validatorroute. De Compiler/Pipeline
  bestaat, maar maakt geen deel uit van de actieve `index.js build`-route; de
  expliciete `buildPipeline`-callsite is `tools/test-pipeline.js`. Of deze
  afzonderlijke onderdelen als legacy moeten worden verwijderd, is niet
  vastgesteld en valt niet onder A002.
- De mocktest `scripts/testBuilderKernelMocked.js` is eerder succesvol
  uitgevoerd met de echte `BuilderKernel.buildModule`-route voor de lokale
  create/dry-run-casus. Airtable-reads, providerwrites, logging en
  rapportbestandsschrijvers waren gemockt. De test dekt geen skip- of
  update-route en is tijdens deze afrondingsreview niet opnieuw uitgevoerd.
- De oorspronkelijke afrondingsclaim is niet met historische evidence te
  verifiëren. A002 is nu afgesloten op basis van deze herbevestiging en de
  beschikbare testregistratie; de historische claim wordt daarmee niet
  achteraf bewezen.

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
- Op 10-11-2026 zijn de vier gerichte lokale fixturetests voor CampingAggregate, recordlinks, preview en mapper uitgevoerd en geslaagd. Dit bevestigt geen actuele Airtable-schema- of recordinhoud; er zijn geen externe reads of writes uitgevoerd.
- De mapper en preview filteren nu whitespace-only velden en lege reizigerservaringen. Expliciete `false`, `0` en `Onbekend` blijven behouden. De aggregate leest het volgens de bestaande schema-notitie niet-bestaande veld `Foto's` niet langer.
- De lokale preview voegt `locatie.adres` toe aan de content; de directe mapper doet dat niet. De gewenste adresweergave en de aanvullende toegankelijkheidsvelden zijn niet bevestigd.
- Eerdere projectnotities melden dat het straatadres niet in openbare content wordt getoond, een dubbele Page-titel is verwijderd en geen slug- of featured-imagevelden zijn toegevoegd.
- Deze eerdere bevindingen zijn hier niet opnieuw gevalideerd.
- De vastgelegde accommodatiepagina-layout blijft het historische ontwerpuitgangspunt.

**Resterend**

- de aanvullende toegankelijkheidsvelden met een actuele, goedgekeurde veldlijst of snapshot bevestigen;
- de adresweergave tussen preview en directe mapper/payload beoordelen;
- aggregate- en previewdekking met actuele, bevestigde gegevens controleren;
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

### A006 — Offline-first mobiele reviews en goedkeuringsflow

**Status**

🟡 ANALYSE VASTGELEGD — UITVOERING WACHT OP AKKOORD

**Prioriteit**

⭐⭐⭐⭐⭐

**Doel**

De mobiele RZD-reviewworkflow offline-first maken: invoer eerst duurzaam op de telefoon bewaren, later beveiligd synchroniseren naar een aparte submissionopslag en pas na beoordeling door Pascalle gecontroleerd naar Airtable promoveren.

**Actuele bevindingen**

- `mobile-review.html` / `mobile-review.js` zijn een eenvoudige browser-UI; er is geen IndexedDB of service worker.
- `services/mobileReviewStorage.js` bewaart reviews in JSON op de Node-host, niet op de telefoon.
- `services/mobileReviewHttpServer.js` bindt standaard op `127.0.0.1:3000`; telefoonbereikbaarheid en Cloud86-geschiktheid zijn niet bevestigd.
- De huidige mobiele sync schrijft via `reviewWriteService.upsertReview()` direct naar `Accommodatie beoordelingen`; een aparte approval-gate ontbreekt.
- De queue verwerkt `pending` / `error`; stale `syncing`, duurzame idempotency en retry/back-off zijn open.
- Batchwrites ontbreken; per record wordt de reviewtabel gelezen en single-record geschreven.

**Volgorde en afhankelijkheden**

1. Bevestig eerst de beschikbare beveiligde HTTPS-endpoint zonder hostingaankoop.
2. Bouw browseropslag, stabiele client-ID en offline herstel.
3. Ontwerp beveiligde sync naar aparte submissionsopslag en herstelbare queue.
4. Voeg rollen, review door Pascalle en approval op exacte submissionversie toe.
5. Optimaliseer reads en voeg maximaal-10 batches uitsluitend voor goedgekeurde verwerking toe.
6. Voeg gerichte offline-, crash-, retry-, authorization-, approval- en partial-batchtests toe.

**Afrondingscriteria**

- Telefooninzendingen blijven na offline gebruik, browserherstart en tijdelijke serveruitval behouden.
- Sync is aantoonbaar idempotent en herstelt vastgelopen of partieel verwerkte items.
- Inzendingen blijven gescheiden van definitieve reviewrecords; onbevoegde gebruikers kunnen niet goedkeuren en submitters kunnen hun eigen inzending niet goedkeuren.
- CREATE/UPDATE/duplicatechecks blijven behouden; alleen goedgekeurde versies worden verwerkt.
- Batchrequests blijven maximaal 10 records en markeren resultaten per inzending.
- Tests zijn lokaal met mocks/fixtures geslaagd; geen live-write vereist.

**Externe afhankelijkheden en kosten**

Geen extra server, abonnement of Cloud86-functionaliteit is bevestigd. Verifieer de bestaande hosting/API-mogelijkheden eerst; maak geen aankoop. Airtable Free blijft uitgangspunt, maar het workspaceverbruik is niet gemeten.

**Dossier**

Zie `MASTER-WERKDOSSIER`, hoofdstuk `MOBILE-01`, voor codebewijs, callschattingen, open vragen en bestands-/testplan.

De onderzochte tijdelijke helperformulierroute staat los van MOBILE-01. Er is geen formulierdienst gekozen of gekoppeld aan de mobiele sync; helperinzendingen blijven buiten RZD totdat Pascalle ze controleert en verwerkt.

---

### A007 — Vertrouwde productiecontext voor reviewwrites

**Status**

🟠 GEDEELTELIJK AFGEROND — BESLUIT EN GOEDKEURING NODIG

**Prioriteit**

⭐⭐⭐⭐⭐

**Doel**

Een betrouwbare productie-actor-, autorisatie- en bevestigingscontext bepalen voordat gecontroleerde CLI- of mobiele reviewwrites kunnen worden toegestaan.

**Actuele bevindingen**

- `reviewWriteService` en de reviewtable-adapter vereisen PlanStore-autorisatie voor live reviewwrites.
- De productiecontext die een geldige permit kan uitgeven is niet vastgesteld; callers zonder geldige context blijven fail-closed geblokkeerd.
- Directe providercalls en niet-reviewmutaties vallen niet allemaal onder dezelfde adaptergrens.
- De adapter herhaalt nu vóór de providerwrite de actuele matchcontrole voor reviewwrites: CREATE vereist nul matches; UPDATE vereist precies één match met het geautoriseerde record-ID. De centrale writer-preflight blijft behouden. Deze controle is niet atomair met de write.
- De voorziening-CLI gebruikt een eigen Plan-ID/confirmatie en dat vervangt geen vertrouwde actor of PlanStore-permit.

**Resterend**

- Eerst de autorisatie-/bevestigingskeuzes en exacte caller-scope laten goedkeuren.
- Alle bedoelde productie-write-entrypoints en resterende bypasses afbakenen voordat live writes worden toegestaan.
- Vóór een productiepermit de trusted-context-, autorisatie- en fail-closed-flow testen; de adapter-preflight op stale CREATE- en ambigue UPDATE-matches is lokaal met mocks getest.

De adapter-preflight is geïmplementeerd; er is geen productiecontext of autorisatie-architectuur toegevoegd en live writes blijven geblokkeerd zonder vertrouwde context.

---

## P2 — Verbeteringen

### H001 — Tijdelijk helperformulier voor gegevensverzameling

**Status**

🟠 READ-ONLY ONDERZOEK AFGEROND — BESLUIT NODIG

**Prioriteit**

⭐⭐⭐

**Doel**

Een eenvoudige formulierdienst beoordelen voor maximaal 2–3 helpers, waarbij Pascalle alle inzendingen controleert en zelf verwerkt.

**Vastgesteld**

- Helpers hoeven voorlopig geen directe RZD Builder-toegang te krijgen.
- Tally Free is alleen een voorlopige kandidaat uit eerder onderzoek; er is geen definitieve keuze of account.
- De lokale code bevat één volledige moduledefinitie (`Toegang & Entree`); andere mobiele modules worden dynamisch uit Airtable geladen.
- Drie punten staan op `NO_MATCH`; twee exacte mappings zijn lokaal op module/naam gebaseerd en hun eerder opgeloste IDs zijn niet opnieuw live geverifieerd.
- Geen directe formulierimport naar Airtable of WordPress is geïmplementeerd.

**Volgende veilige stap**

Na Pascalles akkoord de providerkeuze, actuele gratis limieten/privacy, eerste locaties en betrouwbaar gemapte punten vaststellen. Geen formulier of koppeling aanmaken voordat dit is goedgekeurd.

---

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
