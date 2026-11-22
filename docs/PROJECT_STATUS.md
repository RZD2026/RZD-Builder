# PROJECT STATUS

| Eigenschap | Waarde |
|---|---|
| Project | RZD Builder |
| Document | PROJECT_STATUS.md |
| Status | Actief |
| Rol | Centraal projectdashboard |
| Laatste wijziging | 10-11-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Project

## Naam

RZD Builder

## Versie

RZD Builder 2.0 is de stabiele basis.
Builder 3.0 is actief in ontwikkeling.

## Doel

RZD Builder is het ontwikkelplatform voor Reizen zonder Drempels (RZD).

De Builder vormt de centrale ontwikkelomgeving voor het beheren, valideren, verwerken en synchroniseren van gegevens binnen het RZD-platform.

De Builder werkt vanuit het Canon Model.

De bestaande RZD 5.1 Airtable-structuur blijft de actieve database.

Airtable is één van de synchronisatiedoelen. Het Canon Model vormt het uitgangspunt voor verdere ontwikkeling.

---

# Huidige status

| Onderdeel | Status |
|---|---|
| Ontwikkeling | Actief |
| Builder 2.0 | Stabiele basis |
| Builder 3.0 | Actief in ontwikkeling |
| Canon Model | Actief |
| Content Engine | In ontwikkeling |
| Documentation Engine | Gevalideerd tot en met fase 3G |
| CampingAggregate | Lokale preview en draft-flow aanwezig |
| WordPress | Draft-flow; geen openbare publicatie aangetoond |
| Mobiele review | Node-host JSON-queue aanwezig; telefoon offline-first en approval-gate ontbreken |
| Review-write beveiliging | PlanStore-permit vereist voor centrale live reviewwrites; vertrouwde productiecontext ontbreekt, dus live writes blijven fail-closed |
| Accounts en helpers | Geen RZD-accountbeheer of helperformulier geïmplementeerd; formulieronderzoek afgerond, dienstkeuze open |
| Teststatus | Gerichte tests; geen actuele volledige suite |
| Documentatie | Actief onderhouden |

---

# Samenvatting

Builder 2.0 is de stabiele basis van het project.

Nieuwe functionaliteit wordt ontwikkeld binnen Builder 3.0.

De huidige ontwikkelfase richt zich op de Content Engine, het Canon Model en de koppeling met de bestaande RZD 5.1 Airtable-structuur.

De Canon-naar-RZD 5.1 tabelmapping is vastgesteld en in de Builder vastgelegd.

De Documentation Engine is gevalideerd tot en met fase 3G.

## Recente onderzoeken en wijzigingen — 09-11-2026

### PlanStore en productieautorisatie

- De centrale reviewwriter en reviewtable-adapter vereisen PlanStore-autorisatie voor live writes.
- Er is geen vertrouwde productie-actor-, autorisatie- en bevestigingscontext vastgesteld. Live reviewwrites zonder geldige permit blijven geblokkeerd.
- De adapter herhaalt nu vóór reviewwrites de actuele matchcontrole: CREATE vereist nul matches; UPDATE vereist precies één match met het geautoriseerde record-ID. Stale of ambigue matches en leesfouten blokkeren de providerwrite. Deze read-check is niet atomair met de write.
- Dit is geen algemene mutatiegrens: directe Axios-calls, andere providers, schema-/delete-acties en andere mutatieroutes moeten afzonderlijk worden gecontroleerd. Zie `SECURITY-REVIEW.md`.
- PlanStore blijft lokale plan-/uitvoeringsopslag en is geen centrale gebruikersdatabase.

### Accounts en helperformulier

- Productie-login, e-mailverificatie, wachtwoordherstel, uitnodigingen en centrale gebruikers-/rechtenadministratie zijn niet geïmplementeerd.
- Managed authenticatie met afzonderlijke RZD-rechtenopslag is onderzocht als richting, maar er is geen provider- of implementatiebesluit genomen.
- Een apart formulier voor tijdelijke gegevensverzameling is de voorlopige richting; Tally Free is slechts een kandidaat uit eerder onderzoek. Gratis limieten en privacyvoorwaarden zijn niet opnieuw geverifieerd; geen account of formulier is aangemaakt.
- Helpers krijgen in het huidige ontwerp geen directe write-, goedkeurings- of publicatierechten. Pascalle blijft verantwoordelijk voor controle en verwerking.

### Modulecatalogus en mappings

- Lokaal is één volledige contentmodule aanwezig: `content/modules/toegang.js`, met acht optionele punten en invoertypen Ja/Nee, Meting of Tekst.
- De mobiele route noemt zeven modulelabels, maar haalt de meeste puntdefinities dynamisch uit Airtable. Andere modules en hun volledige actuele catalogus zijn niet read-only extern gecontroleerd.
- Vijf lokale punten zijn als exact gekoppeld beschreven; drie punten blijven `NO_MATCH`. De lokale mapping bevat vaste record-ID’s voor drie punten en module-/naamkoppelingen voor twee. Eerder opgeloste IDs voor die twee zijn niet opnieuw live geverifieerd.
- Een gecontroleerde formulierexport/import naar de bestaande RZD-ID’s bestaat niet.

De account-, helperformulier- en moduleonderzoeken waren read-only. In de A007-vervolgtaak is de adapter-preflight aangepast; vier gerichte lokale mocktests zijn geslaagd. Er zijn geen Git-commando’s, Airtable-/WordPress-acties, accounts of formulieren uitgevoerd/aangemaakt. De vertrouwde productiecontext blijft ontbreken.

## Actuele technische taken

### A001

Status: AFGEROND / COMPLETED

### A002 — Volledige review BuilderKernel

Status: AFGEROND / COMPLETED

De huidige `index.js build`-route en de verantwoordelijkheden van de
BuilderKernel zijn herbevestigd. De aparte validator- en Compiler/Pipeline-paden
zijn als afzonderlijke routes beoordeeld; hun eventuele verwijdering valt niet
onder A002.

De eerder succesvol uitgevoerde mocktest `scripts/testBuilderKernelMocked.js`
dekt de echte `BuilderKernel.buildModule`-route voor een lokale create/dry-run-
casus, niet de skip- of update-route. De test is tijdens deze afrondingsreview
niet opnieuw uitgevoerd. De oorspronkelijke afrondingsclaim blijft historisch
niet verifieerbaar; de huidige status berust op de actuele review en de
beschikbare testregistratie.

### A003 — Legacy Cleanup

Status: AFGEROND IN DE HUIDIGE WERKBOOM; COMMITSTATUS NIET BEVESTIGD

- `services/fieldDefinition.js` is in de huidige werkboom verwijderd.
- De eerder genoemde historische kopie `builders/builder_werkend_2026-07-26.js` is niet aangetroffen.
- De verwijdering is niet bevestigd als Git-commit.

De afgeronde status geldt voor de huidige werkboom en niet als bevestiging van de gecommitte repositorystatus.

### A004 — CampingAggregate presentatie-/publicatielaag

Status: GEDEELTELIJK GEREALISEERD — LOKALE PREVIEW EN DRAFT-FLOW; RESTANT OPEN

- `services/campingReadService.js` levert het CampingAggregate.
- `scripts/previewCamping.js` bevat een lokale HTML- en JSON-previewrunner.
- `wordpressMapper.mapCampingAggregate()` en `wordpressPublisher.preparePage()` bereiden en valideren de WordPress-payload.
- De inhoudelijke volledigheid van het aggregate en de actuele preview zijn niet opnieuw met actuele brongegevens gevalideerd.
- De bestaande Airtable-tabel `Accommodaties` bevat aanvullende toegankelijkheidsvelden die nog niet allemaal door `buildCamping()` worden gelezen.
- Het veld `Foto's` bestaat niet in de actuele metadata/schema van `Accommodaties`.
- Op 10-11-2026 zijn de vier gerichte lokale aggregate-, relatie-, preview- en mappertests met fixtures geslaagd. Er zijn geen actuele Airtable-gegevens gelezen of providerwrites uitgevoerd.
- `buildCamping()` leest het niet-bestaande veld `Foto's` niet langer. Mapper en preview laten whitespace-only waarden en lege ervaringen weg en behouden expliciete `false`, `0` en `Onbekend`.
- De beschikbare documenten noemen de aanvullende toegankelijkheidsvelden niet bij naam; er zijn daarom geen nieuwe bronvelden toegevoegd.
- De lokale preview voegt momenteel `locatie.adres` toe, terwijl de directe WordPress-mapper dit veld niet in de content opneemt. De bedoelde presentatie is niet bevestigd.
- Er is geen openbare WordPress-publicatie aangetoond.

Resterend:

- de aanvullende toegankelijkheidsvelden met een actuele, goedgekeurde veldlijst of snapshot bevestigen;
- de adresweergave tussen preview en directe mapper/payload beoordelen;
- aggregate- en previewdekking met actuele, bevestigde gegevens controleren;
- ontbrekende informatie niet invullen;
- eventuele WordPress-uitbreidingen gecontroleerd als draft voorbereiden.

### A005 — WordPress-publicatie op basis van CampingAggregate

Status: GEDEELTELIJK GEREALISEERD — DRAFT-CREATE/HERGEBRUIK; RESTANT OPEN

- De code ondersteunt payloadvalidatie.
- Page-lookup vindt plaats op `rzd_camping_id`.
- Eén bestaande match wordt hergebruikt.
- Meerdere matches worden geblokkeerd.
- De huidige create-flow houdt de Page op `draft`.
- Een bestaande Page wordt bij hergebruik niet automatisch bijgewerkt.
- De afzonderlijke update-flow heeft een dry-run- en apply-modus.
- Lokale mocktests zijn aanwezig, maar tijdens de documentatie-update niet uitgevoerd.
- Een gecombineerde live Airtable-/WordPress-eindtest is niet aangetoond.

De eerder gedocumenteerde live draft voor Piani di Clodia is niet opnieuw gecontroleerd.

Openstaand:

- live-validatie alleen na expliciete toestemming en met gecontroleerde scope;
- openbare publicatie valt niet onder de huidige draft-flow.

---

# Architectuur

De Builder is opgebouwd rondom het Canon Model.

Het Canon Model vormt het uitgangspunt voor synchronisatie naar verschillende platformen.

De bestaande schema-sync-engine bestaat uit:

- BuilderKernel;
- BuilderWorkflow;
- SynchronizationCoordinator.

De CampingAggregate-read- en previewflow staat hier bewust los van.

De verschillende workflows delen onderdelen, maar vormen geen enkele algemene publicatiepipeline.

---

# Builder 2.0

## Status

STABIELE BASIS

## Geïmplementeerd

- Canon Model
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

De huidige documentatie-update bevestigt niet opnieuw de volledige werking van alle onderdelen.

---

# Builder 3.0

## Status

ACTIEF IN ONTWIKKELING

## Focus

- Content Engine
- RZD 5.1 mapping
- Documentation Engine
- Export Engine
- CampingAggregate
- gecontroleerde WordPress-draft-flow

Nieuwe functionaliteit wordt binnen Builder 3.0 ontwikkeld.

---

# Teststatus

`package.json` bevat geen projectbrede test-runner.

`npm test` is een placeholder die met een foutmelding afsluit.

Tests worden als afzonderlijke Node-scripts uitgevoerd.

## Documentatie-update 06-11-2026

Tijdens deze documentatie-update zijn geen tests uitgevoerd.

De hieronder genoemde resultaten zijn eerder in projectdocumentatie vastgelegd en zijn niet opnieuw uitgevoerd.

## Historisch gerapporteerde resultaten

- `validate`, `build`, dry-run, rollback, metadata-updates, synchronisatie, rapportgeneratie en diverse Airtable-/dependency-dry-runs zijn eerder als succesvol beschreven.
- Een validatie is eerder gerapporteerd als 3/3 modules valid, 0 errors.
- Een test-build met `--dry-run` is eerder als succesvol beschreven, zonder productie-write.
- De publication-readiness-test van 28-10-2026 gebruikte fixtures en controleerde uitsluitend readinesslogica.
- WordPress- en CampingAggregate-tests bestaan als afzonderlijke tests.
- `scripts/testPublishCamping.js` gebruikt mocks voor aggregate-read en postservice.
- `testWordPressCampingPageReuseFlow.js` test payloadvoorbereiding en postservice met een gemockte `fetch`.
- De mapper wordt afzonderlijk getest.

Deze tests vormen samen geen gecombineerde live end-to-end-test.

Eerdere projectnotities melden:

- een gecontroleerde productie-execute voor Karios (`recQzECjVOUbQjc5g`);
- een WordPress-draft voor Piani di Clodia (Page-ID `1554`).

Dit zijn historische live-validatieclaims. Ze zijn tijdens deze documentatie-update niet opnieuw gecontroleerd.

---

# Mobiele RZD-reviewlaag

## Status

LOKALE REVIEWKETEN EN EENVOUDIGE MOBIELE BROWSER-UI HISTORISCH GEBOUWD EN GETEST; IN DEZE STATUSUPDATE GEEN TESTS UITGEVOERD.

GECOMBINEERDE PRODUCTIE-/AIRTABLE-E2E-FLOW NOG NIET AANWEZIG.

De technische mobiele reviewketen loopt momenteel van:

`accommodatie → module → beoordelingspunt → invoermodel → waarde → lokale opslag → status → opgeslagen lijst → handmatige synchronisatie`

## Gebouwd en eerder getest

- selectie van accommodatie, module en beoordelingspunt via `services/mobileReviewSelection.js` en bestaande selection viewmodels;
- bestaande inputmodellen voor `Ja/Nee`, `Meting` en `Tekst`;
- JSON-reviewopslag op de Node-host via `services/mobileReviewStorage.js`; dit is geen browser-/telefoonopslag;
- unieke `localId` en standaard `pending`-opslag;
- statusweergave en lijstitems;
- eenvoudige browser-UI in `mobile-review.html` en `mobile-review.js`;
- HTTP-selectieroutes en `POST /mobile-review/reviews`;
- `GET /mobile-review/reviews` voor lokale lijstitems;
- menselijke accommodatie- en puntnamen wanneer deze zijn opgehaald, met ID als fallback;
- reset van afhankelijke browserstate bij nieuwe keuzes;
- bescherming tegen verouderde responses;
- bescherming tegen dubbele review-POSTs;
- pending/error-selectie;
- sequentiële synchronisatiequeue;
- statusovergangen `syncing`, `synced`, `error` en `conflict`;
- bestaande adapter naar `reviewWriteService.upsertReview()`;
- handmatige synchronisatie via `POST /mobile-review/sync` en een syncpoging bij het browser-`online`-event;
- opnieuw laden van de lokale reviewlijst na synchronisatie;
- relevante browser-, opslag-, flow-, adapter- en synchronisatietests.

De huidige JSON-opslag staat op de Builder-host (`data/mobile-reviews.json`). Er is geen IndexedDB, `localStorage` of service worker aangetroffen; offline invoer op de telefoon is dus niet bewezen en niet geïmplementeerd.

De browser synchroniseert handmatig en start ook een serverqueue-sync bij een `online`-event. Dit bewaart geen review die nog niet succesvol naar de Node-server is gepost.

## Actuele mobiele codecontrole — 08-11-2026

- De Node-server bindt standaard aan `127.0.0.1:3000`; telefoonbereikbaarheid is hiermee niet aangetoond.
- De serverqueue selecteert `pending` en `error`; stale `syncing` wordt niet hersteld. Retrylimiet/back-off is niet aangetroffen.
- De mobiele adapter schrijft direct naar `Accommodatie beoordelingen`; er is geen aparte submissionopslag of server-side Pascalle-approval-gate aangetroffen.
- CREATE/UPDATE/multiple-match-blocking bestaat op basis van accommodatie/voorziening en beoordelingspunt. De mobiele `localId` is geen Airtable-idempotency key.
- De huidige mobiele pagina bevat geen aparte voorziening-, foto-, opmerking-, conceptbeheer- of expliciete reviewbevestigingsscherm.
- Cloud86-capaciteiten en werkelijk Airtable-gebruik zijn niet vastgesteld.
- Dit is een statische codecontrole; tests en live-integraties zijn niet uitgevoerd.

De bestaande lijstitems bevatten geen `moduleId`. Een module-naam kan daarom niet betrouwbaar worden getoond zonder uitbreiding buiten de huidige lijstgegevens.

De tests gebruiken lokale tijdelijke opslag en mocks/dry-run op de write-grens.

Op 21-09-2026 zijn daarnaast gecontroleerde Airtable-updates uitgevoerd voor twee bestaande records. Er zijn geen nieuwe Airtable-punten toegevoegd.

## Mobiele reviewmapping

De actuele mobiele reviewmapping bevat vijf exacte koppelingen:

| RZD key | Airtable pointId | Airtable-naam | Type |
|---|---|---|---|
| `parking` | `recI6rZO6eGjP4tUS` | Parkeerplaats bij accommodatie aanwezig | checkbox |
| `accessible_parking` | `rec2bCHQvPPxwxn4O` | GPK-plaats aanwezig | checkbox |
| `parking_notes` | `recwAXGNhEwG4JTz9` | Parkeren opmerkingen | text |
| `entrance_threshold` | `reccLP2AChiYS9cS0` | Drempelhoogte entree | number |
| `entrance_turning_circle` | `recActExxUP7FcKLy` | Draaicirkel bij entree | number |

Voor parkeren zijn `parking` en `accessible_parking` de twee vaste ja/nee-punten.

Aanvullende parkeerinformatie wordt als vrije tekst opgeslagen bij `parking_notes`.

`parking_distance`, `parking_surface` en `entrance_route` zijn geen zelfstandige content- of beoordelingspunten.

De oude Accommodaties-velden voor afstand, ondergrond en route zijn eveneens verwijderd.

De korte accommodatiebeschrijving blijft bedoeld voor algemene informatie.

De drie resterende punten zijn bewust `NO_MATCH`:

- `route_slope`
- `main_entrance_accessible`
- `automatic_door`

De bestaande review-writeflow is read-only gecontroleerd voor de gekoppelde punten.

De bestaande `upsertReview()`-logica:

- 0 matches → CREATE
- 1 match → UPDATE
- meer dan 1 match → BLOCKED_MULTIPLE_MATCHES

## Mobiele Airtable-writecontrole — 21-09-2026

De vier gekoppelde mobiele punten zijn in de actieve RZD 5.1-base gecontroleerd.

| RZD key | Reviewrecord | Waarde |
|---|---|---|
| `parking` | `recA1UUj3TIya4X4q` | `"Ja"` |
| `accessible_parking` | `recRfB4HqAXzQqkKJ` | `"Ja"` |
| `entrance_threshold` | `recdL6KIPXiYS9cS0` | `"10"` |
| `entrance_turning_circle` | `recn8pyCAoJBapCPH` | `"150"` |

De twee meetwaarden worden als tekst doorgegeven, passend bij het Airtableveld `Waarde / Resultaat` van type `multilineText`.

De eerdere HTTP 422 op numerieke meetwaarden is hiermee opgelost.

De relevante tests zijn eerder geslaagd:

- `testMobileReviewAdapter.js`
- `testMobileReviewInput.js`
- `testMobileReviewFlow.js`

De laatste gecombineerde read-only controle bevestigde alle vier waarden.

De terminaluitvoer van de laatste writeopdracht was beschadigd. De afzonderlijke actievelden konden daardoor niet betrouwbaar worden uitgelezen; de read-only eindcontrole bevestigde wel de actuele waarden.

Er zijn geen nieuwe Airtable-punten toegevoegd.

Een gecombineerde echte browser-tot-Airtable-E2E-test blijft open.

## E2E-test-readiness audit — 21-09-2026

De actieve Airtable-base is:

`appImdZ7AGoXCAlto`

De vier bestaande beoordelingspunten zijn beschikbaar en bruikbaar.

De historisch en code-matig genoemde testaccommodatie-IDs:

- `receCbuC0qSuQAZK0`
- `recu7druA9BMOZhDk`

bestaan niet in de actuele tabel `Accommodaties`.

Karios (`recQzECjVOUbQjc5g`) bestaat wel, maar is geen veilige testscope: voor de relevante punten zijn daar al bestaande reviewrecords aanwezig.

Er is geen aantoonbaar veilige dedicated testaccommodatie en geen veilige CREATE-scope.

Er zijn geen testmarker-records aangetroffen.

De huidige delete-/cleanup-logica biedt geen voldoende harde isolatiegarantie om zonder risico een productie-record te verwijderen.

Conclusie:

Een echte Airtable E2E-test is voorlopig niet verantwoord.

Tijdens deze audit zijn geen Airtable-writes uitgevoerd, is geen code gewijzigd en zijn geen tests uitgevoerd.

Er is geen nieuwe testaccommodatie of nieuw beoordelingspunt aangemaakt.

---

# Airtable

RZD 5.1 is de actieve database.

De juiste Airtable-base is bevestigd:

`appImdZ7AGoXCAlto`

De Builder kan de bestaande RZD 5.1-structuur uitlezen.

## Bevestigde tabellen

- Accommodaties
- Modules
- Beoordelingspunten
- Accommodatie beoordelingen
- Standaard beoordelingssets
- Opmerkingen
- Verbeterpunten
- Reizigerservaringen
- Voorzieningen

## Ontwerpbeslissingen

De tabel `Accommodaties` bevat uitsluitend basisgegevens.

Toegankelijkheidsgegevens worden niet langer opgeslagen als honderden kolommen.

De bestaande RZD 5.1-structuur blijft leidend.

Er wordt geen nieuwe Airtable-base aangemaakt.

Bestaande tabellen worden niet onnodig vervangen of opnieuw aangemaakt.

---

# Definitieve databasestructuur

Accommodaties  
↓  
Modules  
↓  
Beoordelingspunten  
↓  
Accommodatie Beoordelingen

De database blijft schaalbaar en onderhoudbaar.

De Canon-benamingen worden waar nodig gekoppeld aan bestaande RZD-benamingen.

De bestaande tabellen blijven leidend.

---

# CampingAggregate en read-architectuur

- `services/campingReadService.js` bevat `getCampingAggregate(campingId)`.
- Het CampingAggregate bevat camping-basisgegevens, voorzieningen met eigen gegevens/beoordelingen, campingbeoordelingen en de accommodatie-laag.
- De huidige Airtable-tabel `Accommodaties` bevat aanvullende toegankelijkheidsvelden die nog niet allemaal door `buildCamping()` worden gelezen.
- Het veld `Foto's` bestaat niet in de actuele metadata/schema van `Accommodaties`.
- De harde regel blijft maximaal 3 camping-specifieke Airtable-readcalls: camping-record, alle voorzieningen en alle relevante beoordelingen in één gecombineerde query.
- Nooit één call per voorziening.
- `services/pointLookupCache.js` bevat een procesbrede lazy cache voor Modules/Beoordelingspunten.
- De ontbrekende paginatie in de onderliggende resolver-methoden is een bekend, nog niet opgelost aandachtspunt.
- De bestaande Builder-kern blijft een schema-sync-engine.
- `campingReadService.js` staat hier bewust los van.

---

# Documentation Engine

De Documentation Engine is ontwikkeld en gevalideerd tot en met fase 3G.

## Afgeronde fases

- 3A — documentatiestructuur en veiligheidsregels
- 3B — bron-naar-document mapping
- 3C — mapping laden en toepassen
- 3D — concrete documentgeneratie dry-run
- 3E — sectiecontrole
- 3F — managed-block dry-run
- 3G — gecontroleerde document-write uitgevoerd en geverifieerd

## Write-status

Gecontroleerde document-write uitgevoerd.

## Airtable

De Documentation Engine voerde geen ongecontroleerde Airtable-writes uit.

## GitHub

Wijzigingen zijn lokaal gecommit en naar GitHub gepusht.

De engine werkt met RZD-AUTO START/END managed blocks.

Bestaande documentinhoud buiten deze blocks wordt beschermd.

Protected documenten worden niet automatisch gewijzigd.

CHANGELOG.md blijft append-only.

---

# Export Engine

De Export Engine is bedoeld voor synchronisatie van het Canon Model naar:

- Airtable
- WordPress
- JSON
- API
- AI

De volledige werking van alle exportdoelen is niet opnieuw gevalideerd tijdens deze documentatie-update.

---

# Prioriteiten

## P1 — Architectuur

Actuele openstaande taken staan in `BACKLOG.md`.

- A004 — CampingAggregate presentatie-/publicatielaag afronden
- A005 — WordPress-publicatieflow afronden
- A006 — mobiele offline-/approval-flow; uitvoering wacht op endpoint- en autorisatiebesluiten
- A007 — vertrouwde productiecontext en caller-scope bepalen; adapter-preflight is aangepast, productiecontext blijft open

A003 is afgerond in de huidige werkboom; commitstatus is niet bevestigd.

## P2 — Builder 3.0

Focus:

- Content Engine
- RZD 5.1 mapping
- Documentation Engine
- Export Engine
- CampingAggregate

Status: ACTIEF

---

# Ontwikkelafspraken

- Werk altijd aan één bestand tegelijk.
- Analyseer vóór iedere wijziging.
- Test direct na iedere wijziging.
- Gebruik Windows CMD voor testcommando's.
- Wacht op volledige testuitvoer voordat conclusies worden getrokken.
- Grote architectuurwijzigingen worden vooraf ontworpen.
- Het Canon Model is leidend.
- Bestaande RZD 5.1-tabellen en data worden niet onnodig vervangen.
- Maak geen nieuwe Airtable-base.
- Maak geen parallelle tabellen wanneer de bestaande RZD 5.1-tabel dezelfde functie heeft.
- Voer geen productie-write uit voordat een volledige dry-run succesvol en gecontroleerd is.
- Historische testresultaten worden niet als actuele testresultaten gepresenteerd.
- Live-validatie wordt alleen als actueel bevestigd wanneer deze opnieuw is gecontroleerd.

---

# Volgende ontwikkelsessie

De actuele openstaande werkzaamheden en hun prioriteit staan in `BACKLOG.md`.

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

De volgende technische taak wordt bepaald aan de hand van de actuele backlog.

---

# Gerelateerde documentatie

- README.md
- ARCHITECTURE.md
- WORDPRESS_ARCHITECTURE.md
- DOCUMENTATION_ARCHITECTURE.md
- CHANGELOG.md
- BACKLOG.md
- CHECKPOINT.md
- AI_RULES.md

---

# Opmerking

Builder 2.0 wordt beschouwd als de stabiele basis van het project.

Nieuwe ontwikkeling vindt plaats binnen Builder 3.0.

De Builder wordt ontworpen rondom het Canon Model en niet uitsluitend rondom Airtable.

Airtable is één van de synchronisatiedoelen, naast WordPress, exports en toekomstige API-koppelingen.

De bestaande RZD 5.1 Airtable-base blijft de actieve database.

Er wordt geen nieuwe Airtable-base aangemaakt.

A002 is herbevestigd en afgerond. De resterende prioriteiten staan in
`BACKLOG.md`; in deze sessie is geen A004- of A005-werk gestart.

Historische statusnotities en testresultaten blijven herkenbaar als historisch en worden niet zonder actuele verificatie als huidige werking gepresenteerd.
