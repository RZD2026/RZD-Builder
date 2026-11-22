
# CHECKPOINT

| Eigenschap        | Waarde              |
| ----------------- | -------------------- |
| Project           | RZD Builder         |
| Document          | CHECKPOINT.md       |
| Status            | Actief              |
| Rol               | Sessieoverdracht    |
| Laatste wijziging  | 10-11-2026         |
| Eigenaar           | Pascalle Vroegop    |

---

# Doel

Dit document vormt de overdracht tussen ontwikkelsessies.

Na het lezen moet direct duidelijk zijn:

- waar de vorige sessie is geëindigd;
- welke taak als laatste is afgerond;
- welke taak als volgende wordt opgepakt;
- welke aandachtspunten nog openstaan;
- welke documenten eerst geraadpleegd moeten worden.

Historische wijzigingen worden vastgelegd in **CHANGELOG.md**.

De actuele projectstatus wordt bijgehouden in **PROJECT_STATUS.md**.

Openstaande werkzaamheden staan in **BACKLOG.md**.

---

# Actuele sessie — 10-11-2026 (A004)

**Status**

A004 — CampingAggregate-gegevensdekking en preview: GEPAUZEERD, GEDEELTELIJK
UITGEVOERD. A002 blijft AFGEROND.

## Opdracht en scope

- Alleen bevestigde CampingAggregate-velden, mapping en preview controleren.
- Geen Airtable- of WordPress-writes, publicatie, schema-sync, A005-werk of
  A002-heropening.

## Uitgevoerd en gecontroleerd

- `campingReadService.buildCamping()` leest het volgens bestaande
  schema-notities niet-bestaande `Foto's`-veld niet langer.
- Mapper en preview laten whitespace-only waarden en lege reizigerservaringen
  weg. Expliciete `false`, `0` en `Onbekend` blijven zichtbaar.
- De vier geselecteerde lokale fixturetests zijn uitgevoerd en geslaagd:
  `scripts/testCampingReadService.js`,
  `tests/test-campingReadService-recordLinks.js`,
  `scripts/testPreviewCamping.js` en
  `testWordPressCampingAggregateMapper.js`.
- De tests gebruikten mocks/fixtures. Geen actuele Airtable-data gelezen,
  providerwrites uitgevoerd of previewrapporten geschreven.

## Openstaand en laatst uitgevoerde stap

- De beschikbare bronnen noemen de aanvullende toegankelijkheidsvelden niet
  bij naam; er zijn geen nieuwe velden toegevoegd.
- De lokale preview voegt `locatie.adres` aan de content toe; de directe
  WordPress-mapper doet dat niet. De gewenste adresweergave is onbevestigd.
- Laatste stap: alle vier geselecteerde tests opnieuw uitgevoerd; alle vier
  geslaagd.

## Eerstvolgende concrete stap en beperkingen

- Wacht op beoordeling en een actuele goedgekeurde veldlijst/snapshot of
  expliciete toestemming voor een read-only schema-controle. Bevestig ook de
  gewenste adresweergave voordat de resterende A004-dekking wordt aangepast.
- Geen externe reads/writes, WordPress-publicatie, schema-sync, A005- of
  A002-werk, tests buiten de genoemde selectie, Git-commando's of commits.

## Gewijzigde bestanden

- `services/campingReadService.js`
- `services/wordpressMapper.js`
- `scripts/previewCamping.js`
- `scripts/testCampingReadService.js`
- `scripts/testPreviewCamping.js`
- `testWordPressCampingAggregateMapper.js`
- `docs/PROJECT_STATUS.md`
- `docs/BACKLOG.md`
- `docs/CHECKPOINT.md`
- `docs/MASTER-WERKDOSSIER`

---

# Vorige sessie — 10-11-2026 (werkstatusprotocol)

**Status**

Het werkstatusprotocol uit §12.9 van het masterwerkdossier is verwerkt in de
bestaande projectdocumentatie. Op dat moment bleef A002 AFGEROND en was er
geen actieve technische opdracht.

## Resultaat

- `docs/AI_RULES.md` verwijst nu naar de verplichte werkstatus- en hervatstappen.
- `docs/WERKWIJZE` beschrijft de dagelijkse hervatprocedure; de eerdere
  overdrachtsregels zijn als historisch herkenbaar behouden.
- `docs/WERKPLAN` is gemarkeerd als een historische momentopname. De oude
  A002-status en vervolgstappen zijn niet herschreven.
- Geen nieuwe technische opdracht aangemaakt en A002 niet heropend.

## Validatie en grenzen

- De vijf gevraagde documenten zijn gelezen: Master Werkdossier, Werkwijze,
  Werkplan, AI-regels en Checkpoint.
- Alleen documentatie gewijzigd. Geen code gewijzigd, tests uitgevoerd,
  Git-commando’s uitgevoerd of externe acties verricht.

## Pauzepunt en volgende stap

Wacht op expliciete toestemming van Pascalle voordat een volgende opdracht
wordt gestart. Geen technische taak was op dat moment geselecteerd.

---

# Vorige sessie — 10-11-2026 (A002-review)

## Resultaat

- De huidige `index.js build`-route is bevestigd: `BuilderKernel.buildModule()`
  coördineert bootstrap, workflow, synchronisatie, rapportage en logging.
- `builders/builder.js` is een dunne wrapper zonder gevonden huidige callsites.
  De aparte validatorroute en de niet-actieve Compiler/Pipeline-route zijn
  geïdentificeerd en beoordeeld.
- De eerder succesvol uitgevoerde `scripts/testBuilderKernelMocked.js` dekt
  alleen de lokale create/dry-run-casus. De oorspronkelijke afrondingsclaim is
  historisch niet verifieerbaar; de huidige afronding berust op de actuele
  review en de beschikbare testregistratie.
- `PROJECT_STATUS.md`, `BACKLOG.md`, `CHECKPOINT.md` en `CHANGELOG.md` zijn
  bijgewerkt voor A002. Geen broncode gewijzigd.
- Oudere, gedateerde A002-open-notities in het Master Werkdossier en het
  werkplan zijn als historische context behouden; zij behoren niet tot de
  actieve documentatiesuite.

## Validatie en grenzen

- Deze sessie zijn geen tests of scripts uitgevoerd. De mocktest is eerder
  succesvol uitgevoerd en niet opnieuw gedraaid.
- Geen Git-commando’s, Airtable-, WordPress- of andere externe acties uitgevoerd.
- Geen code gewijzigd.

## Pauzepunt en volgende stap

Wacht op expliciete toestemming voordat een volgende Builder 3.0-taak start.
Er is geen werk aan A004 of A005 begonnen.

---

# Vorige sessie — 09-11-2026

**Status**

Na de documentatiesynchronisatie is de A007-adapter-preflight aangepast en met lokale tests gevalideerd. Er is geen productiecontext of autorisatie-architectuur toegevoegd.

## Resultaat

- `PROJECT_STATUS.md` bijgewerkt met PlanStore-/reviewwrite-status en de read-only bevindingen over accounts, helpers, modules en mappings.
- `BACKLOG.md` bijgewerkt met A007 voor de nog ontbrekende vertrouwde productiecontext en H001 voor het tijdelijke helperformulier; beide wachten op besluit/goedkeuring.
- `SESSION_STATE.md` expliciet als historische momentopname van 28-10-2026 gemarkeerd; de oorspronkelijke snapshotinhoud is behouden.
- `CHECKPOINT.md` bijgewerkt met deze sessie; de overdracht van 08-11-2026 blijft hieronder als vorige sessie staan.
- De reviewtable-adapter herhaalt nu vóór providerwrites de actuele matchcontrole; stale CREATE- en ambigue UPDATE-matches worden fail-closed geblokkeerd.
- `PLANSTORE.md`, `SECURITY-REVIEW.md`, `PROJECT_STATUS.md`, `BACKLOG.md` en `CHANGELOG.md` bijgewerkt met de A007-aanvulling en de resterende race/contextbeperkingen.
- De historische P0-prioriteiten zijn vergeleken: de master markeert nog oudere P0/P0-P3-items en MOBILE-01.2 t/m MOBILE-01.5 als open, terwijl de actieve backlog geen bevestigde P0's meldt en A006 P1 noemt. Dit verschil is vastgelegd maar niet inhoudelijk hergeprioriteerd.
- `MASTER-WERKDOSSIER` versie 4 is ongewijzigd behouden binnen de opgegeven documentatiescope; de historische P0-prioriteitsdiscrepantie is in de actieve documenten vastgelegd en blijft onbeslist.
- `ROADMAP.md` en `DOCUMENTATION_ARCHITECTURE.md` zijn gecontroleerd en bewust niet aangepast.

## Kernstatus

- De centrale reviewwriter en reviewtable-adapter vereisen PlanStore-autorisatie voor live reviewwrites, maar een vertrouwde productie-actor-/bevestigingscontext ontbreekt; live writes zonder permit blijven fail-closed geblokkeerd.
- De adapter herhaalt de verse matchcontrole voor reviewwrites: CREATE vereist nul matches; UPDATE vereist precies één match met het geautoriseerde record-ID. Een concurrente wijziging na die read blijft een race.
- Directe Axios-calls en niet-reviewmutaties vallen niet allemaal onder dezelfde beveiligingsgrens.
- Er is geen productieaccount-, uitnodigings- of RZD-rechtenbeheer geïmplementeerd. Managed authenticatie met afzonderlijke RZD-rechtenopslag is alleen onderzocht; geen provider is gekozen.
- De tijdelijke formulierdienst is niet gekozen of aangemaakt. H001 is uitgesteld totdat bestaand werk is afgehandeld.
- De lokale contentcatalogus bevat alleen `Toegang & Entree`; drie punten blijven `NO_MATCH`. De overige mobiele modulecatalogi en actuele Airtable-records zijn niet extern geraadpleegd.
- A002, A004, A005 en A006 blijven open/gedeeltelijk. A007 blijft open voor trusted production context, autorisatie en caller-scope; de adapter-preflight zelf is aangepast.

## Validatie en grenzen

- In de vorige A007-codewijziging geslaagd: `node scripts/testProductionMutationPlanService.js`, `node scripts/testReviewWriteService.js`, `node scripts/testReviewWriteServiceEntities.js` en `node scripts/testMappedReviewWritePreflight.js`. Deze documentatiesynchronisatie heeft geen tests uitgevoerd.
- Geen Git-commando’s uitgevoerd.
- Geen Airtable-, WordPress- of andere externe acties uitgevoerd.
- Alleen de adapter, een bestaande PlanStore-test en direct gerelateerde documentatie gewijzigd; geen productieconfiguratie, account of formulier gewijzigd/aangemaakt.
- Testwrites gebruikten lokale mocks/fixtures; geen live providerwrite uitgevoerd.

## Pauzepunt en volgende veilige stap

Laat Pascalle de A007-wijziging en resterende race beoordelen. Bepaal daarna, vóór productiepermit of live write, de vertrouwde actor-, autorisatie- en bevestigingsbron en de exacte caller-scope. Reconcileer ook de historische P0-labels met de actieve backlog zonder ze als opgelost of actueel kritisch aan te nemen. H001 blijft uitgesteld totdat bestaand werk is afgehandeld. Voor MOBILE-01 blijft eerst bevestiging nodig welke bestaande beveiligde HTTPS-endpoint zonder aankoop beschikbaar is.

---

# Vorige sessie — 08-11-2026

**Status**

MOBILE-01 is statisch onderzocht en toegevoegd aan het bestaande Master Werkdossier als versie 3. De mobiele toepassing is nog niet offline-first en de goedkeuringsflow ontbreekt.

## Resultaat

- Master Werkdossier: `MASTER-WERKDOSSIER`, nieuw hoofdstuk `MOBILE-01`; versie 2 is ongewijzigd bewaard in `docs/archive/MASTER-WERKDOSSIER-v2`.
- `PROJECT_STATUS.md`: mobiele opslag/synchronisatie-status gecorrigeerd op basis van actuele code.
- `BACKLOG.md`: A006 toegevoegd als analyse vastgelegd, uitvoering wacht op akkoord.
- Geen applicatiecode gewijzigd; geen tests, Git, Airtable-/WordPress-calls, sync, import/export, Cloud86-controle of serverwijzigingen uitgevoerd.

## Kernbevindingen

- Reviews worden server-side in `data/mobile-reviews.json` opgeslagen; de telefoonbrowser heeft geen IndexedDB of service worker.
- De browser probeert bij `online` de serverqueue te synchroniseren, maar dit is geen offline opslag op de telefoon.
- De sync schrijft rechtstreeks via `upsertReview()` naar `Accommodatie beoordelingen`; aparte submissionopslag en Pascalle-approval ontbreken.
- De queue herstelt stale `syncing` niet; Airtable-batches ontbreken.
- Node luistert standaard alleen op `127.0.0.1:3000`; Cloud86/telefoonbereikbaarheid is onbekend.

## Volgende stap

Laat MOBILE-01 beoordelen en bevestig eerst welke bestaande beveiligde HTTPS-endpoint zonder aankoop beschikbaar is. Daarna kan een beperkte IndexedDB/offline-herstelimplementatie worden gepland; geen Airtable-sync of definitieve verwerking voordat de approval-architectuur is goedgekeurd.

---

# Vorige sessie — 06-11-2026

**Datum**

06-11-2026

**Status**

Documentatiegroep 1 is bijgewerkt:

- PROJECT_STATUS.md
- BACKLOG.md

De documentatie wordt stapsgewijs bijgewerkt. De volgende documenten worden pas aangepast wanneer daarvoor toestemming is gegeven.

## Scope en veiligheidsgrenzen

- Alleen de documentatie is aangepast.
- De bestaande gebruikerswijzigingen buiten de geselecteerde documenten blijven ongemoeid.
- Er zijn tijdens deze documentatie-update geen tests uitgevoerd.
- Er zijn geen Airtable- of WordPress-aanroepen uitgevoerd.
- Er zijn geen Git-mutaties uitgevoerd.
- De actuele Git-status en commitstatus zijn niet opnieuw gecontroleerd.

## Actuele status A002–A005

- **A002 — BuilderKernel:** blijft open totdat de eerdere afrondingsclaim met actuele evidence is bevestigd.
- **A003 — Legacy Cleanup:** afgerond in de huidige werkboom. De commitstatus is niet bevestigd.
- **A004 — CampingAggregate presentatie/publicatie:** gedeeltelijk gerealiseerd. De aggregate-read en lokale HTML-/JSON-previewrunner bestaan. Gegevensdekking en preview-inhoud zijn niet opnieuw gevalideerd.
- **A005 — WordPress-publicatie:** gedeeltelijk gerealiseerd. De draft-flow is aanwezig. Hergebruik van een bestaande Page werkt niet automatisch bij; bijwerken heeft een afzonderlijke dry-run-/apply-flow.

## Test- en live-validatiestatus

- Preview-, mapper-, payloadvalidatie- en WordPress-mocktestbestanden zijn aanwezig.
- Deze tests zijn tijdens de documentatie-update niet uitgevoerd.
- De CLI-test mockt de aggregate-read en postservice.
- De Page-reuse-test gebruikt een voorbereid payload en een gemockte fetch.
- Mapper- en previewtests staan afzonderlijk.
- Dit vormt geen gecombineerde live Airtable-naar-WordPress-eindtest.
- Eerdere projectnotities melden dat Piani di Clodia als draft (Page-ID 1554) is aangemaakt en gecontroleerd.
- Deze live-read-back is historisch gedocumenteerd en tijdens deze update niet opnieuw geverifieerd.

## Volgende stap

Wacht op toestemming voordat de volgende documentatiegroep wordt aangepast.

---

# Historische overdracht — 27-10-2026, met aanvullingen tot 28-10-2026

De onderstaande sessienotities en vervolgstappen zijn historisch.

Ten tijde van die overdracht stonden de toen actuele status en eerstvolgende stap in de overdracht van 06-11-2026 hierboven.

## A003 — Legacy Cleanup

- A003 Legacy Cleanup is afgerond.
- `fieldDefinition.js` is verwijderd omdat het niet meer actief werd gebruikt.
- `node index.js validate` is historisch succesvol uitgevoerd: 3/3 modules valid, 0 errors.
- `node index.js build test --dry-run` is historisch succesvol uitgevoerd met RZD Builder v2.0.
- De commitstatus is tijdens de huidige documentatie-update niet gecontroleerd.

## A004 — CampingAggregate presentatie/publicatie

- De WordPress-mapping en de WordPress-postservice zijn in afzonderlijke lokale tests onderzocht.
- Tijdens het eerdere A004-onderzoek is geen nieuwe productie-WordPress-publicatielogica toegevoegd.
- De paginahergebruiklogica uit commit `945171a` is daarna toegevoegd.
- Voor accommodatiepagina's is gekozen voor WordPress Pages; Posts blijven bedoeld voor nieuws/artikelen.
- Commit `945171a` (`Fix WordPress camping page reuse`) staat volgens de historische notitie op `origin/master`.
- De paginahergebruiklogica zoekt op exacte `meta.rzd_camping_id`, hergebruikt één match, blokkeert dubbele matches en voorkomt aanmaken wanneer de lookup mislukt of de paginatieheader ongeldig is.
- Bij nul matches mag de bestaande logica een nieuwe WordPress-pagina als concept aanmaken.
- `testWordPressCampingPageReuseFlow.js` gebruikt een voorbereid payload en een gemockte `fetch` voor de publisher-/postserviceflow.
- Deze test roept de aggregate-read en `mapCampingAggregate()` niet aan.
- `scripts/testPublishCamping.js` test de CLI-flow met een gemockte aggregate-read en postservice.
- De mappertest staat afzonderlijk.
- Deze tests vormen geen gecombineerde aggregate-naar-WordPress-integratietest.
- De Page-reuse-mocktest dekt hergebruik, draft-aanmaak, dubbele matches, lookupfouten en ongeldige paginatieheaders.
- Bij nul matches controleert zij de requestvolgorde `GET`, daarna `POST`.
- De eerdere read-only controle vond pagina 1554 als enige exacte match, met status `draft` en de verwachte `rzd_camping_id`.
- Een eerdere notitie vermeldt commit `e424ba7`; de commitstatus is tijdens deze documentatie-update niet gecontroleerd.
- A004 is onderzocht op de presentatie van `CampingAggregate`.
- De bestaande `CampingAggregate` bevat basisgegevens, voorzieningen en beoordelingen.
- De huidige Airtable-tabel `Accommodaties` bevat meer toegankelijkheidsvelden dan `buildCamping()` momenteel leest.
- Het veld `Foto's` bestaat niet in de actuele metadata/schema van `Accommodaties`. Dit is historisch expliciet gecontroleerd.
- De bestaande accommodatiepagina-layout blijft leidend; er wordt geen nieuwe layout ontworpen.
- Er is tijdens het eerdere A004-onderzoek geen productiecode gewijzigd.

## Lokale publication-readiness-test — 28-10-2026

- `scripts/testPublicationReadiness.js` is aangemaakt met uitsluitend lokale fixtures.
- De test controleert `parseCampingIds()`, `publicProvision()` en `assessAggregate()`.
- Ontbrekende verplichte velden, optionele informatie, foto's, assessmentsets, niet-beoordeelde items, voorzieningen en fouttypen worden gecontroleerd.
- Uitgevoerd met:
  `node scripts/testPublicationReadiness.js`
- Historisch resultaat: alle assertions geslaagd.
- Exitcode: `0`.
- Uitvoer: `Alle publication-readiness tests geslaagd.`
- Deze test bevestigt uitsluitend de lokale readinesslogica.
- De volledige WordPress-publicatieketen en echte Airtable-/WordPress-integratietests zijn hiermee niet opnieuw getest.
- Tijdens deze test zijn geen Airtable- of WordPress-acties uitgevoerd.

## Mobiele RZD-reviewlaag

De browserflow loopt van:

`accommodatie → module → beoordelingspunt → invoermodel → waarde → lokale opslag → status → opgeslagen lijst → handmatige synchronisatie`

- `mobile-review.html` en `mobile-review.js` vormen de eerste eenvoudige vanilla mobiele UI.
- `services/mobileReviewStorage.js` bewaart reviews in de bestaande JSON-opslag met unieke `localId` en `syncStatus: "pending"` als standaard.
- De browser gebruikt de bestaande selectie-, input-, submit-, lijst- en synchronisatiediensten via `services/mobileReviewHttpServer.js`.
- De inputmodellen `Ja/Nee`, `Meting` en `Tekst` zijn beschikbaar.
- De browser beschermt tegen verouderde async responses, dubbele review-POSTs en dubbele handmatige synchronisatie.
- Na succesvolle opslag en synchronisatie wordt de lokale reviewlijst opnieuw geladen.
- De lijst toont status en `statusLabel`, plus menselijke accommodatie-/puntnamen wanneer die al bekend zijn; IDs blijven fallback.
- `POST /mobile-review/sync` gebruikt de bestaande `syncPendingReviews()`-flow.
- Pending/error reviews worden sequentieel verwerkt.
- `syncing`, `synced`, `error` en `conflict` worden lokaal opgeslagen.
- De bestaande adapter gebruikt `reviewWriteService.upsertReview()` aan de write-grens.

De actuele exacte koppelingen zijn:

- `parking` → `recI6rZO6eGjP4tUS` → `Parkeerplaats bij accommodatie aanwezig`
- `accessible_parking` → `rec2bCHQvPPxwxn4O` → `GPK-plaats aanwezig`
- `parking_notes` → `recwAXGNhEwG4JTz9` → `Parkeren opmerkingen`
- `entrance_threshold` → `reccLP2AChiYS9cS0` → `Drempelhoogte entree`
- `entrance_turning_circle` → `recActExxUP7FcKLy` → `Draaicirkel bij entree`

Voor parkeren zijn `parking` en `accessible_parking` de twee vaste ja/nee-punten.

Afstand, ligging, ondergrond, helling, reservering, hoogtebeperkingen en de route vanaf de parkeerplaats worden als vrije tekst bij `Parkeren opmerkingen` vastgelegd.

`parking_distance`, `parking_surface` en `entrance_route` zijn geen zelfstandige contentpunten.

`route_slope`, `main_entrance_accessible` en `automatic_door` blijven zelfstandige `NO_MATCH`-punten.

De writeflow is read-only gecontroleerd voor de gekoppelde punten:

- pointId;
- typeBeoordeling;
- accommodationId;
- veldmapping.

De koppelingen zijn consistent. 0/1/>1 bestaande reviews plannen respectievelijk CREATE/UPDATE/BLOCKED_MULTIPLE_MATCHES.

Relevante tests zijn historisch succesvol uitgevoerd:

- `scripts/testMobileReviewPage.js`
- `scripts/testMobileReviewStorage.js`
- `scripts/testMobileReviewFlow.js`
- `scripts/testSyncPendingReviews.js`
- `scripts/testMobileReviewSync.js`
- `scripts/testMobileReviewSyncQueue.js`

De volledige keten is over meerdere testlagen afgedekt met tijdelijke opslag, mocks en dry-run.

Op 21-09-2026 zijn twee gecontroleerde Airtable-updates uitgevoerd op bestaande reviewrecords. Er zijn geen nieuwe Airtable-punten toegevoegd.

## Gewijzigd in de eerdere afrondingsronde

- `PROJECT_STATUS.md`, `CHECKPOINT.md` en `CHANGELOG.md` zijn bijgewerkt met de actuele mobiele reviewmijlpaal.

## Waar gestopt

A003 is afgerond en A004 is onderzocht.

De mobiele reviewketen, minimale browser-UI, lokale opslag, lijstweergave en handmatige synchronisatie zijn lokaal gebouwd en getest.

De bestaande write-grens is alleen met mocks/dry-run getest.

Er zijn geen nieuwe Airtable-punten toegevoegd.

Een veilige, expliciet gecontroleerde integratietest blijft nodig voordat een echte write wordt toegestaan.

De actuele write-eindcontrole bevestigde historisch:

- `parking` → `recA1UUj3TIya4X4q` → waarde `"Ja"`
- `accessible_parking` → `recRfB4HqAXzQqkKJ` → waarde `"Ja"`
- `entrance_threshold` → `recdL6KIPXiYS9cS0` → waarde `"10"`
- `entrance_turning_circle` → `recn8pyCAoJBapCPH` → waarde `"150"`

De meetwaarden zijn als tekst geschreven naar `Waarde / Resultaat` (`multilineText`) nadat de eerdere HTTP 422 was opgelost in `mobileReviewAdapter.js`.

`testMobileReviewAdapter.js`, `testMobileReviewInput.js` en `testMobileReviewFlow.js` zijn daarna historisch geslaagd.

De laatste write-terminaluitvoer was beschadigd. De afzonderlijke actievelden konden daardoor niet betrouwbaar worden uitgelezen, maar de gecombineerde read-only controle bevestigde de actuele waarden.

## Read-only E2E-test-readiness audit — 21-09-2026

- Actieve Airtable-base: `appImdZ7AGoXCAlto`.
- De vier bestaande beoordelingspunten zijn beschikbaar en bruikbaar:
  - `recI6rZO6eGjP4tUS` — Parkeerplaats bij accommodatie aanwezig
  - `rec2bCHQvPPxwxn4O` — GPK-plaats aanwezig
  - `reccLP2AChiYS9cS0` — Drempelhoogte entree
  - `recActExxUP7FcKLy` — Draaicirkel bij entree
- De historisch/code-matig genoemde testaccommodatie-IDs `receCbuC0qSuQAZK0` en `recu7druA9BMOZhDk` bestaan niet in de actuele tabel `Accommodaties`.
- Karios (`recQzECjVOUbQjc5g`) bestaat wel, maar is geen veilige testscope omdat voor de relevante punten al bestaande reviewrecords aanwezig zijn.
- Er is geen aantoonbaar veilige dedicated testaccommodatie, geen veilige CREATE-scope en geen gegarandeerd veilige cleanup.
- Er zijn geen testmarker-records aangetroffen.
- De huidige delete-/cleanup-logica biedt geen voldoende harde isolatiegarantie.
- Een echte Airtable E2E-test is daarom voorlopig **NIET verantwoord**.
- Tijdens deze audit zijn geen Airtable-writes, codewijzigingen of tests uitgevoerd.
- Er is geen nieuwe testaccommodatie of nieuw beoordelingspunt aangemaakt.

## Volgende technische taak

- Eerst een aantoonbaar geïsoleerde testaccommodatie en cleanup-scope regelen voordat een echte gecombineerde Airtable E2E-test wordt overwogen.
- De bestaande mobiele flow voorlopig uitsluitend lokaal, met mocks en dry-run blijven valideren.
- Daarna bepalen hoe automatische synchronisatie, indien gewenst, naast de bestaande handmatige syncflow wordt toegevoegd.
- Bepalen welke bestaande Airtable-gegevens aan `CampingAggregate` moeten worden toegevoegd voor de bestaande presentatie.

---

# Laatste sessie

**Datum**

16-09-2026

**Status**

Correct afgesloten.

## B001 — `services/updateService.js`

- Status: AFGEROND / COMPLETED.
- Hardcoded payload opgelost.
- `testUpdateService.js` aangepast naar een veilige lokale `axios.patch` mocktest.
- Test succesvol uitgevoerd met: `node .\testUpdateService.js`.
- Geen echte Airtable-write uitgevoerd.
- Alleen `testUpdateService.js`, `PROJECT_STATUS.md`, `BACKLOG.md` en `CHANGELOG.md` zijn in die afrondingsronde gewijzigd.

## Volgende technische taak

- `builders/builder.js`
- Doel: oude v1.4 workflow analyseren en beoordelen voor migratie naar de nieuwe pipeline.

---

# Laatste afgeronde werkzaamheden

Deze sessie was gericht op het uitbreiden van het datamodel van accommodatie-gericht naar camping/park als hoofdobject, met voorzieningen en een eenvoudige aangepaste-accommodatielaag, volledig bovenop de bestaande RZD 5.1-structuur.

## Voorzieningen als eigen entity

- De tabel **Voorzieningen** bestaat inmiddels en is gekoppeld aan het camping/park via het veld `Camping / park`.
- Testrecords zijn aanwezig voor Piani di Clodia (o.a. Sanitairgebouw 1/2/3, Zwembad, Supermarkt, Restaurant, Strand, EHBO, Arts, Wasserette).
- De tabel **Accommodatie beoordelingen** is uitgebreid met de velden `Voorziening` en `Keuze`, zodat één tabel zowel Accommodatie- als Voorziening-beoordelingen kan bevatten.
- De tabel **Accommodaties** is uitgebreid met de beschikbaarheidslaag:
  - `Aangepaste accommodatie aanwezig` (Ja/Nee/Onbekend)
  - `Type aangepaste accommodatie`
  - `Opmerking aangepaste accommodatie`

## Write-flow uitgebreid

- `services/reviewWriteService.js`: `accommodationId` optioneel, `voorzieningId` toegevoegd; precies één van beide verplicht; dedup-logica generiek per gelinkt veld gemaakt.
- `content/mapping/airtableMapping.js`: `Voorziening`-veldnaam toegevoegd aan `REVIEW_FIELDS`/`review.links`.
- Nieuw `scripts/writeVoorzieningReview.js`: schrijft voorziening-beoordelingen via de bestaande mapping-/resolver-flow, met optionele `--point=CANON_ID`-filter.
- Geen wijziging aan `airtablePointResolver.js` of `pointMappings.js` (beide bevestigd entity-agnostisch).
- Eerste echte end-to-end testrecord aangemaakt: Sanitairgebouw 1 → beoordelingspunt "Draaicirkel bij entree", status "Nog niet beoordeeld".
- Bestaande accommodatie-write-flow (bulk-scripts, `writeMappedRecords.js`, bestaande tests) is ongewijzigd en opnieuw getest.

## CampingAggregate read-architectuur

- Nieuw `services/campingReadService.js`: `getCampingAggregate(campingId)` levert een `CampingAggregate` (camping-basisgegevens, `voorzieningen` met eigen gegevens/beoordelingen, `campingBeoordelingen`, `accommodatieLaag`).
- Harde regel: maximaal 3 camping-specifieke Airtable-readcalls (camping-record, alle voorzieningen, alle beoordelingen gecombineerd). Nooit één call per voorziening.
- Nieuw `services/pointLookupCache.js`: procesbrede lazy cache voor Modules/Beoordelingspunten (hergebruikt `airtablePointResolver.getModules()`/`getPoints()` ongewijzigd).
- Koude start: eenmalig 2 extra calls; daarna 0 extra calls per camping binnen hetzelfde proces.
- Paginatiebeperking van de onderliggende resolver-methoden is bekend en bewust nog niet opgelost.
- `campingReadService.js` staat los van BuilderKernel/BuilderWorkflow/SynchronizationCoordinator — de bestaande Builder-kern is en blijft een schema-sync-engine, geen record-/presentatie-engine.
- De WordPress-laag is nog een ongebruikte stub en is niet aangesloten op deze read-flow.

## Tests

Nieuwe tests:

- `scripts/testReviewWriteServiceEntities.js`
- `scripts/testWriteVoorzieningReview.js`
- `scripts/testCampingReadService.js`
- `scripts/testPointLookupCache.js`

Alle nieuwe én bestaande tests (o.a. `testReviewWriteService.js`) zijn historisch geslaagd.

Er zijn geen Airtable-writes uitgevoerd tijdens deze documentatie-update, en er is geen commit gemaakt.

---

# Belangrijk besluit

De bestaande **RZD 5.1 Airtable-structuur blijft leidend**.

Er wordt:

- geen nieuwe Airtable-base aangemaakt;
- geen nieuwe `Content Modules`-tabel aangemaakt;
- geen nieuwe `Accommodatie Beoordelingen`-tabel aangemaakt;
- geen aparte `Campings`-tabel aangemaakt (camping/park blijft een record in `Accommodaties`);
- geen aparte `Voorzieningen beoordelingen`-tabel aangemaakt (beoordelingen blijven in `Accommodatie beoordelingen`, nu met `Accommodatie`- én `Voorziening`-koppeling);
- geen bestaande RZD-data verwijderd;
- geen bestaande tabellen onnodig vervangen.

De Builder moet de Canon-structuur koppelen aan de bestaande RZD 5.1-tabellen.

Camping/park is voor de huidige RZD-focus het primaire object.

Voorzieningen (sanitair, zwembad, supermarkt, restaurant, strand, EHBO, arts, wasserette, e.d.) horen bij het camping/park en niet bij een individuele accommodatie.

Verschillende voorzieningen van hetzelfde type (bijv. Sanitairgebouw 1 en 2) blijven afzonderlijke records.

Aangepaste accommodatie is voorlopig alleen een beschikbaarheidslaag (Ja/Nee/Onbekend); een volledige beoordeling van een specifieke aangepaste accommodatie is een latere uitbreiding.

---

# Huidige mapping

| Builder / Canon        | Bestaande RZD 5.1       |
| ---------------------- | ------------------------ |
| Content Modules       | Modules                  |
| Beoordelingspunten    | Beoordelingspunten       |
| Accommodatie Beoordelingen | Accommodatie beoordelingen |
| Accommodaties        | Accommodaties            |
| Voorzieningen        | Voorzieningen            |

Deze tabelmapping is technisch vastgelegd.

De exacte inhoudelijke veldmapping wordt nog verder gecontroleerd.

---

# Actief bestand

**Momenteel**

Geen actief bestand.

---

# Volgende taak

De read-/aggregatielaag (`campingReadService.js` + `pointLookupCache.js`) is gebouwd en getest.

De volgende fase is bepalen hoe `CampingAggregate` wordt gepresenteerd/gebruikt, zonder de bestaande schema-sync Builder onnodig te verbouwen.

1. Beslissen op welke manier `CampingAggregate` ontsloten wordt (nieuw script, nieuwe CLI-subcommand, of iets anders) — additief, zonder BuilderKernel/BuilderWorkflow/SynchronizationCoordinator te wijzigen.
2. Bepalen of/hoe de WordPress-laag hier later op aansluit.
3. Beslissen of/wanneer voorzieningstype-specifieke beoordelingspunten nodig zijn.
4. Beslissen of/wanneer bron/verificatie-administratie (AI-informatie, externe reviews) wordt ingevuld — het model bereidt dit al voor.
5. Beslissen wanneer de volledige beoordeling van individuele aangepaste accommodaties wordt opgepakt.

---

# Nieuwe inhoudelijke besluiten

De redactionele stijl is vastgelegd: feiten blijven objectief; overige teksten mogen warm, menselijk en vanuit de reiziger geschreven zijn.

RZD beschrijft wat is waargenomen en wat bekend of onbekend is en bepaalt niet vooraf wat geschikt of ongeschikt is.

De homepage legt het RZD-concept breder uit.

Een bestemmingspagina mag een korte one-liner gebruiken die eerst de bestemming benoemt en daarna subtiel de RZD-bril introduceert.

Voor Piani di Clodia zijn de definitieve intro en one-liner opgenomen in **PROJECT_STATUS.md**.

De bovenkant van de campingpagina bestaat uit naam, type/plaats/regio/land, warme intro, bestemming-specifieke one-liner, de kop **Wat heeft dit vakantiepark te bieden?** en daarna de categorie-buttons/iconen.

Campingbeoordelingen blijven gescheiden van voorzieningen.

RZD ontwikkelt een eigen iconentaal.

De vaste categorieën en functionele regels staan in **PROJECT_STATUS.md**.

De set is nog niet definitief: de volgende sessie werkt afzonderlijke iconen uit en test ze eerst op circa 32, 48 en 80 px voordat een volledige set wordt doorgetrokken.

Het ontwerpprincipe voor humor is:

**De humor zit in de details — subtiel en vriendelijk.**

---

# Openstaande aandachtspunten

- Automatische synchronisatie is nog niet gebouwd.
- Er is nog geen gecombineerde echte end-to-end-test tegen Airtable; de keten is over meerdere testlagen met mocks, dry-run en tijdelijke opslag afgedekt.
- Een volledige productie-/eindgebruikersflow voor mobiele reviews is nog niet afgerond.
- CampingAggregate is nog niet aangesloten op een presentatie-/UI-laag.
- WordPress-publicatie op basis van `CampingAggregate` ondersteunt nu paginahergebruik; verdere productievalidatie blijft open.
- Voorzieningstype-specifieke beoordelingspunten zijn nog niet geïmplementeerd (voorzieningen gebruiken voorlopig de bestaande Canon-punten/modules).
- Bron/verificatie-administratie voor AI-informatie en externe reviews is voorbereid in het model, maar nog niet geïmplementeerd.
- Volledige beoordeling van individuele aangepaste accommodaties (stacaravans/bungalows) is nog niet geïmplementeerd.
- De paginatiebeperking van `airtablePointResolver.getModules()`/`getPoints()` (geen `offset`-verwerking bij >100 records) is bekend en nog niet opgelost.
- Canon-velden moeten nog exact worden gemapt op de bestaande Airtable-velden (openstaand sinds vorige sessie).
- De naamverschillen tussen Canon en Airtable moeten centraal worden afgehandeld (openstaand sinds vorige sessie).

---

# Veiligheidsregel

Voordat een productie-write wordt uitgevoerd:

1. schema analyseren;
2. mapping controleren;
3. volledige dry run uitvoeren;
4. output controleren;
5. pas daarna `execute: true` gebruiken.

Bij twijfel **niet schrijven**.

---

# Documenten eerst raadplegen

Bij de start van een nieuwe sessie:

1. **PROJECT_STATUS.md**
2. **CHECKPOINT.md**
3. **BACKLOG.md**
4. **CHANGELOG.md**
5. **ARCHITECTURE.md**
6. **AI_RULES.md**

Daarna pas code aanpassen.

---

# Sessieoverdracht

De Airtable-verbinding is gereed.

De juiste RZD 5.1-base is bevestigd.

De volgende stap is **niet opnieuw Airtable configureren**.

De Documentation Engine 3A t/m 3G is afgerond.

De managed-block beveiliging is gevalideerd.

De gecontroleerde document-write is uitgevoerd en geverifieerd.

De wijzigingen zijn volgens de historische notitie naar GitHub gepusht.

De volgende stap is:

**resterende documentatieconsistentie controleren → documentationMapping.js synchroniseren → CHANGELOG.md aanvullen → volledige audit → daarna verder met de RZD 5.1 mapping.**

<!-- RZD-AUTO:START CHECKPOINT -->
### Documentation Engine status

De managed-block beveiliging is actief.

De engine mag uitsluitend inhoud tussen RZD-AUTO START/END-markers wijzigen.

Alle bestaande documentinhoud buiten deze markers blijft onaangetast.

Documentation Engine 3G is historisch uitgevoerd en succesvol geverifieerd.

Na een write moet de Git-diff worden gecontroleerd voordat wordt gecommit.
<!-- RZD-AUTO:END CHECKPOINT -->
