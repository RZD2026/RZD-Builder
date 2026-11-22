
# CHANGELOG

| Eigenschap        | Waarde                         |
| ----------------- | ------------------------------- |
| Project           | RZD Builder                    |
| Document          | CHANGELOG.md                    |
| Status            | Actief                         |
| Rol               | Historisch wijzigingsoverzicht  |
| Laatste wijziging | 10-11-2026                     |
| Eigenaar           | Pascalle Vroegop                |

---

# Doel

Dit document registreert alle **belangrijke afgeronde wijzigingen** binnen RZD Builder.

Iedere afgeronde ontwikkelingstaak wordt na voltooiing vanuit **BACKLOG.md** naar dit document verplaatst.

---

De changelog vormt daarmee de officiële historische registratie van de ontwikkeling van het project.

Kleine experimenten, tussentijdse commits en tijdelijke wijzigingen blijven onderdeel van de Git-geschiedenis.

## 2026-11-10

### A002 — BuilderKernel-review herbevestigd

**Type**

Review / Statusbeheer

**Resultaat**

- De actieve `index.js build`-route, BuilderKernel-verantwoordelijkheden en
  afhankelijkheden zijn herbevestigd.
- De wrapper in `builders/builder.js`, de aparte validatorroute en de
  Compiler/Pipeline-route zijn als afzonderlijke of niet-actieve routes
  geïdentificeerd.
- A002 is afgerond volgens de actuele criteria in `BACKLOG.md`. De historische
  afrondingsclaim blijft niet verifieerbaar en is niet achteraf bewezen.
- De beschikbare mocktest dekt alleen de lokale create/dry-run-casus; geen
  skip- of update-route.

**Validatie**

- `scripts/testBuilderKernelMocked.js` was eerder succesvol uitgevoerd; deze
  test is tijdens deze review niet opnieuw gedraaid.
- Alleen documentatie bijgewerkt. Geen tests, scripts, Git-commando’s of
  externe acties uitgevoerd.

## 2026-11-09

### A007 — Verse review-preflight in Airtable-adapter

**Type**

Beveiliging / PlanStore / Test

**Wijziging**

- `airtableAdapter` leest vóór een reviewwrite opnieuw de actuele reviewrecords.
- CREATE wordt geblokkeerd zodra er een match bestaat; UPDATE vereist precies één match met het geautoriseerde record-ID.
- Readfouten en gewijzigde of ambigue matches blokkeren de providerwrite.
- De bestaande preflight in `reviewWriteService` en PlanStore-actie-, target- en payloadbinding blijven behouden.
- `PLANSTORE.md`, `SECURITY-REVIEW.md`, `PROJECT_STATUS.md`, `BACKLOG.md` en `CHECKPOINT.md` bijgewerkt.

**Validatie**

- `node scripts/testProductionMutationPlanService.js` geslaagd.
- `node scripts/testReviewWriteService.js` geslaagd.
- `node scripts/testReviewWriteServiceEntities.js` geslaagd.
- `node scripts/testMappedReviewWritePreflight.js` geslaagd.
- Geen Airtable-, WordPress- of andere live writes uitgevoerd.

**Resterend risico**

- De actuele match-read en providerwrite zijn niet atomair; een concurrente wijziging na de read blijft mogelijk.
- Trusted productie-actor-/bevestigingscontext ontbreekt nog; dit lost A007 niet volledig op en schakelt geen live writes in.

### DOC — A007-status en historische P0-prioriteiten gesynchroniseerd

**Type**

Documentatie / Statusbeheer

**Wijziging**

- A007 is als gedeeltelijk afgerond beschreven: de adapter-preflight is geïmplementeerd; trusted productiecontext, autorisatie en caller-scope blijven open.
- `PROJECT_STATUS.md` is bijgewerkt zodat de codewijziging en vier eerdere geslaagde tests niet meer worden omschreven als uitsluitend read-only onderzoek.
- De actieve P1-samenvatting noemt nu ook A006 en A007.
- De historische P0-labels uit `MASTER-WERKDOSSIER` zijn vergeleken met de actieve backlog en als onopgeloste prioriteitsdiscrepantie vastgelegd; geen historische status is als opgelost of actueel kritisch heringedeeld.
- `PLANSTORE.md` en de A007-code/testregistratie waren al actueel en zijn gecontroleerd zonder verdere wijziging.

**Validatie**

- Alleen bestaande documentatie gelezen en bijgewerkt.
- Geen tests, Git-commando’s, externe acties of live writes uitgevoerd.

### DOC — Documentatie gesynchroniseerd met masterwerkdossier versie 4

**Type**

Documentatie / Statusbeheer

**Wijziging**

- `PROJECT_STATUS.md` bijgewerkt met de aantoonbare status van PlanStore-reviewwrites, accounts/autorisatie en het helperformulier-/moduleonderzoek.
- `BACKLOG.md` bijgewerkt met A007 (vertrouwde productiecontext) en H001 (tijdelijk helperformulier); beide wachten op besluit/goedkeuring.
- `SESSION_STATE.md` expliciet als historische momentopname van 28-10-2026 aangeduid; de historische inhoud is behouden.
- `CHECKPOINT.md` bijgewerkt met de sessiestatus, validatiegrenzen en actuele pauzestand.
- `MASTER-WERKDOSSIER` versie 4 gecontroleerd en ongewijzigd gelaten; geen concrete inconsistentie gevonden die een correctie vereiste.
- `ROADMAP.md`, `PLANSTORE.md`, `DOCUMENTATION_ARCHITECTURE.md` en `SECURITY-REVIEW.md` gecontroleerd en ongewijzigd gelaten omdat zij niet in tegenspraak zijn met de vastgestelde status.
- Geen codewijzigingen, tests, Git-commando’s, Airtable-/WordPress-acties, accounts of formulieren uitgevoerd/aangemaakt.

**Resultaat**

- De actuele projectstatus, backlog, sessieoverdracht en historische wijzigingsregistratie sluiten aan op masterwerkdossier versie 4.
- De PlanStore-productiecontext en helperformulier-/providerkeuzes blijven open; er is geen implementatiebesluit vastgelegd.
- De documentatiecontrole is geen nieuwe test-, live- of externe validatie.

---

## 2026-11-06

### DOC — Documentatiegroep 1 bijgewerkt

**Type**

Documentatie / Statusbeheer

**Wijziging**

- `PROJECT_STATUS.md` bijgewerkt met de actuele projectstatus van 06-11-2026.
- `BACKLOG.md` bijgewerkt met de actuele status van openstaande werkzaamheden.
- `CHECKPOINT.md` bijgewerkt met de actuele sessieoverdracht.
- De status van A002–A005 is afgestemd tussen de bijgewerkte documenten.
- Historische testresultaten zijn als historisch herkenbaar gehouden.
- Er zijn geen nieuwe testresultaten toegevoegd.
- Er zijn geen Airtable- of WordPress-acties uitgevoerd.
- Er zijn geen Git-mutaties uitgevoerd.

**Resultaat**

- De actuele projectstatus, openstaande werkzaamheden en sessieoverdracht zijn bijgewerkt.
- A003 blijft afgerond in de werkboom; de commitstatus is niet bevestigd.
- A004 en A005 blijven gedeeltelijk gerealiseerd.
- A002 blijft open totdat de eerdere afrondingsclaim met actuele evidence is bevestigd.
- De documentatie-update vormt geen bewijs van nieuwe codevalidatie of live-integratie.

---

## 2026-11-03

### Parkeerinformatie consolideren

**Type**

Contentmapping / Documentatie / Test

**Wijziging**

- `parking_distance`, `parking_surface` en `entrance_route` zijn verwijderd als zelfstandige content- en accommodatievelden.
- Aanvullende parkeerinformatie wordt via het tekstpunt `parking_notes` gekoppeld aan het bestaande Airtable-punt `Parkeren opmerkingen` (`recwAXGNhEwG4JTz9`).
- De bestaande ja/nee-mappings voor `parking` en `accessible_parking` zijn behouden.
- `route_slope`, `main_entrance_accessible` en `automatic_door` blijven `NO_MATCH`.
- Lokale mapping-, selectie- en resolvertests zijn bijgewerkt.

**Resultaat**

- De mobiele contentmodule bevat één gedeeld tekstpunt voor parkeerbijzonderheden; er zijn geen dubbele afstand-, ondergrond- of routepunten.
- Geen Airtable- of WordPress-acties uitgevoerd.

---

## 2026-10-28

### Lokale publication-readiness-test

**Type**

Test / Documentatie

**Wijziging**

- `scripts/testPublicationReadiness.js` toegevoegd.
- Lokale fixtures toegevoegd voor readinesssignalen, verplichte velden, optionele informatie, foto's, assessmentsets, voorzieningen en foutafhandeling.
- Uitgevoerd met `node scripts/testPublicationReadiness.js`.

**Resultaat**

- Alle assertions geslaagd.
- Exitcode: `0`.
- Uitvoer: `Alle publication-readiness tests geslaagd.`
- Deze test bevestigt uitsluitend de lokale publication-readinesslogica.
- De volledige WordPress-publicatieketen en echte Airtable-/WordPress-integratietests zijn hiermee niet bewezen.
- Geen Airtable- of WordPress-acties uitgevoerd.

---

## 2026-10-27

### WordPress CampingAggregate-paginahergebruik

**Type**

Integratie / Test

**Wijziging**

- Commit `945171a` (`Fix WordPress camping page reuse`) staat volgens de historische notitie op `origin/master`.
- De paginahergebruiklogica zoekt op exacte `meta.rzd_camping_id`, hergebruikt één match en blokkeert dubbele matches.
- Bij lookupfouten of een ontbrekende/ongeldige `X-WP-TotalPages`-header wordt geen pagina aangemaakt.
- Bij nul matches kan de bestaande logica een nieuwe WordPress-pagina als concept aanmaken.
- `testWordPressCampingPageReuseFlow.js` staat volgens de historische notitie in commit `e424ba7` en test de keten van aggregate ophalen, mapping, voorbereiden en de postservice met gemockte Airtable- en WordPress-grenzen.
- De integratietest test hergebruik, aanmaken, dubbele matches, lookupfouten en ongeldige paginatieheaders.
- Bij nul matches controleert zij expliciet de requestvolgorde `GET`, daarna `POST`.

**Resultaat**

- De integratietest slaagde volgens de historische registratie.
- Een read-only controle vond pagina 1554 als enige exacte match, met status `draft` en de verwachte `rzd_camping_id`.
- De integratietest is volgens de historische registratie gecommit in `e424ba7`.
- Geen WordPress- of Airtable-request uitgevoerd tijdens die test/documentatie-update.

---

## 2026-09-21

### Mobile RZD-reviewlaag — gecontroleerde Airtable-writecontrole

**Type**

Integratie / Veiligheidscontrole

**Wijziging**

- Bestaande reviewrecords gecontroleerd en bijgewerkt via de bestaande mobiele adapter en `reviewWriteService.upsertReview()`.
- `entrance_threshold` (`recdL6KIPXiYS9cS0`) bijgewerkt naar tekstwaarde `"10"`.
- `entrance_turning_circle` (`recn8pyCAoJBapCPH`) bijgewerkt naar tekstwaarde `"150"`.
- `parking` (`recA1UUj3TIya4X4q`) en `accessible_parking` (`recRfB4HqAXzQqkKJ`) read-only gecontroleerd op respectievelijk `"Ja"` en `"Ja"`.
- De meetwaarden zijn als tekst geschreven naar het Airtableveld `Waarde / Resultaat` (`multilineText`).
- De eerdere HTTP 422 op numerieke meetwaarden is opgelost in `services/mobileReviewAdapter.js`.
- `testMobileReviewAdapter.js`, `testMobileReviewInput.js` en `testMobileReviewFlow.js` zijn succesvol uitgevoerd.

**Resultaat**

- De gecombineerde read-only eindcontrole bevestigde alle vier gewenste waarden.
- De terminaluitvoer van de laatste writeopdracht was beschadigd, waardoor de afzonderlijke actievelden niet betrouwbaar konden worden uitgelezen; de eindcontrole bevestigde wel de actuele records en waarden.
- Geen nieuwe Airtable-punten toegevoegd.
- Dit vormt het historische checkpoint van de mobiele review → Airtable writeflow.
- Een gecombineerde echte browser-tot-Airtable-E2E-test blijft nog open.

---

### Read-only E2E-test-readiness audit

**Type**

Audit / Veiligheidsbesluit

**Resultaat**

- De actieve Airtable-base is `appImdZ7AGoXCAlto`.
- De vier bestaande beoordelingspunten zijn beschikbaar en bruikbaar:
  - `recI6rZO6eGjP4tUS`
  - `rec2bCHQvPPxwxn4O`
  - `reccLP2AChiYS9cS0`
  - `recActExxUP7FcKLy`
- De historisch/code-matig genoemde testaccommodatie-IDs `receCbuC0qSuQAZK0` en `recu7druA9BMOZhDk` bestaan niet in de actuele tabel `Accommodaties`.
- Karios (`recQzECjVOUbQjc5g`) bestaat wel, maar is geen veilige testscope omdat daar voor de relevante punten al bestaande reviewrecords aanwezig zijn.
- Er is geen aantoonbaar veilige dedicated testaccommodatie, geen veilige CREATE-scope en geen gegarandeerd veilige cleanup.
- Er zijn geen testmarker-records aangetroffen.
- De huidige delete-/cleanup-logica biedt geen voldoende harde isolatiegarantie.
- Een echte Airtable E2E-test is daarom voorlopig niet verantwoord.
- Tijdens deze audit zijn geen Airtable-writes, codewijzigingen of tests uitgevoerd.
- Er is geen nieuwe testaccommodatie of nieuw beoordelingspunt aangemaakt.

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

## 2026-09-18

### Mobile RZD-reviewlaag — lokale opslag en adapter

**Type**

Implementatie / Test

**Wijziging**

- `services/mobileReviewAdapter.js` aangemaakt en getest.
- `services/mobileReviewStorage.js` aangemaakt en getest met tijdelijke JSON-opslag.
- `configureStorage()` toegevoegd om de lokale opslaglocatie testbaar te maken.
- `scripts/testMobileReviewAdapter.js` geslaagd.
- `scripts/testMobileReviewStorage.js` geslaagd.
- `scripts/testMobileReviewFlow.js` geslaagd.

**Resultaat**

- Geen Airtable-writes uitgevoerd voor deze mobiele reviewlaag.
- Offline queue en synchronisatie zijn nog niet gebouwd.

---

## 2026-09-20

### Mobile RZD-reviewlaag — lokale keten en documentatie

**Type**

Implementatie / Test / Documentatie

**Wijziging**

- Mobiele review-opslag en adapter waren al aanwezig.
- Synchronisatie, synchronisatiequeue en pending-reviewverwerking zijn toegevoegd.
- Selectie, invoertype/normalisatie, bevestiging, status en lijstweergave zijn toegevoegd.
- De bijbehorende mobiele reviewtests zijn succesvol uitgevoerd.
- `AI_RULES.md`, `PROJECT_STATUS.md` en `CHECKPOINT.md` zijn bijgewerkt.

**Resultaat**

- De technische keten loopt van selectie via invoertype, bevestiging, lokale opslag en synchronisatiestatus naar lijstweergave.
- Er is nog geen echte mobiele UI en de volledige productie-/eindgebruikersflow is nog niet afgerond.
- `buildMobileReviewSubmission()` is verwijderd nadat een repo-brede controle geen imports, aanroepen, re-exports of directe tests aantoonde.
- Geen Airtable-writes uitgevoerd voor deze mobiele uitbreiding.

### Mobile RZD-reviewlaag — browserflow en handmatige synchronisatie

**Type**

Implementatie / Test / Documentatie

**Wijziging**

- Eerste eenvoudige mobiele browser-UI toegevoegd voor `accommodatie → module → beoordelingspunt → invoermodel → waarde`.
- Bestaande HTTP-routes uitgebreid met `POST /mobile-review/reviews`, `GET /mobile-review/reviews` en `POST /mobile-review/sync`.
- Lokale reviewlijst uitgebreid met status, `statusLabel`, menselijke accommodatie-/puntnamen wanneer bekend en ID-fallbacks.
- Browserbeveiliging toegevoegd tegen verouderde async responses en dubbele review- of synchronisatieacties.
- Succesvolle opslag reset de huidige invoer en laadt de lokale reviewlijst opnieuw.
- Handmatige synchronisatie gebruikt uitsluitend de bestaande `syncPendingReviews()`-flow.
- Relevante browser-, opslag-, flow-, sync- en queue-tests succesvol uitgevoerd.

**Resultaat**

- De mobiele reviewflow is lokaal aantoonbaar afgedekt van browserinvoer tot pending-opslag, handmatige synchronisatie en `synced`-status.
- Pending/error reviews worden via de bestaande queue sequentieel verwerkt; conflict- en errorstatussen blijven lokaal zichtbaar.
- De bestaande adapter bereikt `reviewWriteService.upsertReview()` in mocks/dry-run.
- Geen productie-/Airtable-write uitgevoerd.
- Automatische synchronisatie bij het browser-`online`-event is lokaal toegevoegd en read-only/testmatig afgedekt; er is geen productie-/Airtable-write uitgevoerd.
- Eén gecombineerde echte end-to-end test tegen Airtable en een veilige gecontroleerde write blijven nog open.

### Mobile RZD-reviewlaag — definitieve puntmapping en write-safetycontrole

**Type**

Read-only analyse / Mapping / Veiligheidscontrole

**Wijziging**

- Vier bestaande RZD-punten zijn read-only aan actuele Airtable-punten gekoppeld:
  - `parking` → `recI6rZO6eGjP4tUS`
  - `accessible_parking` → `rec2bCHQvPPxwxn4O`
  - `entrance_threshold` → `reccLP2AChiYS9cS0`
  - `entrance_turning_circle` → `recActExxUP7FcKLy`
- De actuele Airtable-namen en canonieke types zijn gecontroleerd.
- Zes overige punten blijven bewust `NO_MATCH`.
- De mobiele writeflow is read-only gevolgd tot en met de geplande `reviewWriteService.upsertReview()`-actie.
- De actieplanning is bevestigd: 0 matches → CREATE, 1 match → UPDATE, meer dan 1 match → BLOCKED_MULTIPLE_MATCHES.

**Resultaat**

- `pointId`, `typeBeoordeling`, `accommodationId` en de Airtable-velden zijn consistent voor de vier gekoppelde punten.
- Geen Airtable-write uitgevoerd.
- Geen nieuwe Airtable-punten toegevoegd.
- Volgende stap: veilige, expliciet gecontroleerde integratietest vóór een echte write.

---

## 2026-09-17

### A003/A004 — Legacy Cleanup en CampingAggregate-presentatieanalyse

**Type**

Onderhoud / Analyse / Test

**Waarom**

Legacy Cleanup en de aansluiting van `CampingAggregate` op de bestaande accommodatiepresentatie moesten worden gecontroleerd.

**Wijziging**

- Legacy `fieldDefinition.js` verwijderd omdat het niet meer actief werd gebruikt.
- De bestaande CampingAggregate- en WordPress-keten onderzocht en getest.
- WordPress-mapping en geïntegreerde veilige mocktest succesvol uitgevoerd.
- Voor accommodatiepagina's is gekozen voor WordPress Pages.
- De bestaande accommodatiepagina-layout blijft leidend.

**Resultaat**

- Validatie na verwijdering succesvol: 3/3 modules valid, 0 errors.
- Test-build met `node index.js build test --dry-run` succesvol uitgevoerd.
- Geen productie-write uitgevoerd.
- `Accommodaties` bevat aanvullende toegankelijkheidsvelden die `buildCamping()` momenteel nog niet allemaal leest.
- Het veld `Foto's` komt niet voor in de actuele metadata/schema van `Accommodaties`.
- A004 is niet afgerond; de technische implementatie moet nog worden bepaald.

---

### A003/A004 — Legacy Cleanup en presentatieanalyse

**Type**

Onderhoud / Analyse / Test

**Waarom**

De afronding van A003 en de status van de A004-presentatieanalyse moesten worden vastgelegd.

**Wijziging**

- `fieldDefinition.js` is verwijderd omdat het niet meer actief werd gebruikt.
- De bestaande CampingAggregate- en WordPress-keten is onderzocht en getest.
- De WordPress-mapping en geïntegreerde veilige mocktest zijn succesvol.
- Voor accommodatiepagina's is gekozen voor WordPress `Pages`.
- `Posts` blijven bedoeld voor nieuws/artikelen.
- De bestaande, eerder vastgestelde accommodatiepagina-layout is vastgelegd in `WORDPRESS_ARCHITECTURE.md` en blijft leidend voor de toekomstige implementatie.

**Resultaat**

- Validatie na verwijdering is succesvol: 3/3 modules valid, 0 errors.
- `node index.js build test --dry-run` is succesvol uitgevoerd.
- Er is geen productie-write uitgevoerd.
- `Accommodaties` bevat aanvullende toegankelijkheidsvelden die `buildCamping()` momenteel nog niet allemaal leest.
- Het veld `Foto's` komt niet voor in de actuele metadata/schema van `Accommodaties`.
- A004 is nog niet afgerond; de technische implementatie van de aanvullende presentatiegegevens moet nog worden bepaald.

---

## 2026-08-15

### B001 — services/updateService.js

**Type**

Refactor / Test

**Waarom**

De hardcoded payloadkwestie moest worden opgelost.

**Wijziging**

- `updateService.js` gebruikt de meegegeven payload.
- `testUpdateService.js` is aangepast naar een lokale `axios.patch` mocktest.

**Resultaat**

- Test succesvol uitgevoerd met `node .\testUpdateService.js`.
- Geen echte Airtable-write uitgevoerd.

---

### SYNC-004 — Voorzieningen als eigen entity binnen de beoordelingsflow

**Type**

Synchronisatie / Datamodel

**Waarom**

RZD richt zich primair op campings/parken. Voorzieningen (sanitair, zwembad, supermarkt, restaurant, strand, EHBO, arts, wasserette, e.d.) horen bij het camping/park en niet bij een individuele accommodatie. De bestaande beoordelingsflow ondersteunde uitsluitend Accommodatie-beoordelingen.

**Wijziging**

- `services/reviewWriteService.js`: `accommodationId` optioneel gemaakt, `voorzieningId` toegevoegd; precies één van beide is verplicht. `findMatchingRecords()` dedupliceert nu op het juiste gelinkte veld (`Accommodatie` of `Voorziening`) in plaats van uitsluitend `Accommodatie`.
- `content/mapping/airtableMapping.js`: `REVIEW_FIELDS`/`review.links` uitgebreid met `voorziening: "Voorziening"`.
- Nieuw `scripts/writeVoorzieningReview.js`: schrijft voorziening-beoordelingen via de bestaande `pointMappings`/`airtableMapping`/`airtablePointResolver`-flow, met optionele `--point=CANON_ID`-filter om één specifiek beoordelingspunt te verwerken; ondersteunt dry-run/`--execute` volgens bestaand patroon.
- Geen wijziging aan `airtablePointResolver.js` of `pointMappings.js` (beide entity-agnostisch, bevestigd via analyse).
- Bestaande accommodatie-write-scripts (`writeMappedRecords.js`, `bulkRecordWrite*.js`, `testSingleRecordWrite.js`) ongewijzigd gelaten en na de wijziging opnieuw getest.

**Resultaat**

- Eerste echte end-to-end testrecord aangemaakt: Sanitairgebouw 1 (Piani di Clodia) → beoordelingspunt "Draaicirkel bij entree", status "Nog niet beoordeeld".
- Nieuwe tests: `scripts/testReviewWriteServiceEntities.js`, `scripts/testWriteVoorzieningReview.js`. Bestaande tests (`testReviewWriteService.js` en de bestaande accommodatie-flow) blijven ongewijzigd slagen.

---

### CORE-002 — CampingAggregate read-architectuur

**Type**

Nieuwe functionaliteit

**Waarom**

Er bestond geen enkele read-/aggregatielaag om een camping/park met zijn voorzieningen en beoordelingen samen te lezen en te presenteren; alle bestaande code was gericht op schema-sync/write. Voordat een presentatie-/publicatielaag gebouwd wordt, moest eerst het interne datamodel en de leesstrategie worden vastgelegd.

**Wijziging**

- Nieuw `services/campingReadService.js`: `getCampingAggregate(campingId)` levert een `CampingAggregate` (camping-basisgegevens, `voorzieningen` met eigen gegevens/beoordelingen, `campingBeoordelingen`, `accommodatieLaag`).
- Harde ontwerpregel: maximaal 3 camping-specifieke Airtable-readcalls per aggregatie (camping-record, alle voorzieningen via `filterByFormula` op `Camping / park`, alle relevante beoordelingen in één gecombineerde `OR`-query). Nooit één call per voorziening.
- Presentatieregels geïmplementeerd: geen automatische placeholder-beoordelingen; alleen bestaande Airtable-records (incl. status "Nog niet beoordeeld"); lege/niet-ingevulde velden worden weggelaten; expliciete "Nee"/`false`/"Onbekend" blijft behouden.
- Nieuw `services/pointLookupCache.js`: procesbrede, lazy in-memory cache die `airtablePointResolver.getModules()`/`getPoints()` hergebruikt (ongewijzigd) om beoordelingspunten te verrijken met naam en module. Eenmalig 2 extra calls bij koude start, daarna 0 extra calls per camping binnen hetzelfde proces.
- `campingReadService.js` staat bewust los van `BuilderKernel`/`BuilderWorkflow`/`SynchronizationCoordinator` — de bestaande Builder-kern blijft een schema-sync-engine.
- Nieuwe tests: `scripts/testCampingReadService.js`, `scripts/testPointLookupCache.js` (o.a. nesting, tri-state presentatie, exact-3-calls-verificatie, cold/warm cache-gedrag).

**Resultaat**

- `CampingAggregate` technisch bewezen met gemockte tests; alle nieuwe en bestaande tests slagen.
- Analyse uitgevoerd van de bestaande Builder-entrypoint/presentatielaag: bevestigd dat er nog geen presentatie-/UI-component bestaat en dat de WordPress-laag een ongebruikte stub is.
- Geen Airtable-writes, geen nieuwe Airtable-tabellen, geen wijziging aan de bestaande schema-sync Builder.

---

## 2026-08-14

### SYNC-003 — Review write service & controlled execute on Karios

**Type**

Synchronisatie / Operational

**Waarom**

Centraliseer en beveilig alle schrijfacties naar tabel `Accommodatie beoordelingen` en voer een gecontroleerde execute uit om migraties en write-behaviour in productie te verifiëren.

**Wijziging**

- `services/reviewWriteService.js` toegevoegd als centrale domain service voor upsert-logica van beoordelingen.
- Meerdere scripts gemigreerd naar `reviewWriteService.upsertReview()` (waaronder `scripts/writeMappedRecords.js`, `scripts/bulkRecordWrite.js`, `scripts/bulkRecordWriteFinal.js`, `scripts/bulkRecordWriteSafe2.js`).
- Introduceert duplicate-safety: 0 matches → CREATE, 1 match → UPDATE, >1 matches → BLOCKED_MULTIPLE_MATCHES (geen automatische keuze of verwijdering).
- Gecontroleerde execute-write uitgevoerd voor de Karios-accommodatie (accommodatie id: `recQzECjVOUbQjc5g`) na dry-runs.

**Resultaat**

- Voor Karios werden eerst vijf vooraf geverifieerde lege duplicaten verwijderd.
- Na opschoning: 7 beoordelingen aanwezig, 0 duplicaten.
- `writeMappedRecords.js --execute` uitgevoerd (gecontroleerde productie-write): 6 bestaande records geüpdatet; 0 records aangemaakt; 0 records verwijderd tijdens execute-run.

**Opmerking**

- Dit corrigeert eerdere documentatie die aangaf dat er geen productie-writes zijn uitgevoerd — er heeft bewust een gecontroleerde execute-write op Karios plaatsgevonden.

---

# Werkcodes

| Code | Onderdeel        |
| ---- | ---------------- |
| CORE | BuilderKernel    |
| COMP | Compiler         |
| PIPE | Pipeline         |
| SYNC | Synchronisatie   |
| API  | Metadata         |
| DR   | Doctor Framework |
| VAL  | Validators       |
| DOC  | Documentatie     |
| TEST | Testen          |
| CFG  | Configuratie     |
| REL  | Releases         |

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
