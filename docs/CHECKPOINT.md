# CHECKPOINT

| Eigenschap        | Waarde           |
| ----------------- | ---------------- |
| Project           | RZD Builder      |
| Document          | CHECKPOINT.md    |
| Status            | Actief           |
| Rol               | Sessieoverdracht |
| Laatste wijziging | 11-08-2026       |
| Eigenaar          | Pascalle Vroegop |

---

# Doel

Dit document vormt de overdracht tussen ontwikkelsessies.

Na het lezen van dit document moet direct duidelijk zijn:

- waar de vorige sessie is geëindigd;
- welke taak als laatste is afgerond;
- welke taak als volgende wordt opgepakt;
- welke aandachtspunten nog openstaan;
- welke documenten eerst geraadpleegd moeten worden.

Historische wijzigingen worden vastgelegd in **CHANGELOG.md**.

De actuele projectstatus wordt bijgehouden in **PROJECT_STATUS.md**.

Openstaande werkzaamheden staan in **BACKLOG.md**.

---

# Laatste sessie

**Datum**

11-08-2026

**Status**

✅ Correct afgesloten.

---

# Laatste afgeronde werkzaamheden

De Airtable-verbinding is opnieuw gecontroleerd en gekoppeld aan de juiste bestaande RZD 5.1-base.

**Actieve Base ID**

    appImdZ7AGoXCAlto

De Builder kan de bestaande RZD 5.1-base uitlezen.

Bevestigde tabellen:

- Accommodaties
- Modules
- Beoordelingspunten
- Accommodatie beoordelingen
- Standaard beoordelingssets
- Opmerkingen
- Verbeterpunten
- Reizigerservaringen

De Airtable-token is succesvol getest.

De benodigde schema-rechten werken.

Een create-table API-test is succesvol uitgevoerd.

De schema write plan, volledige payload dry run en execution safety dry run zijn succesvol uitgevoerd.

De Builder kan afhankelijkheden en linked-table relaties correct verwerken in de dry run.

De Canon ContentDefinition is gecontroleerd.

Ondersteunde contenttypen:

- checkbox
- number
- text
- longtext
- select
- attachment

De `Type`-keuzes voor Airtable zijn succesvol opgebouwd.

Er is nog geen productie-write uitgevoerd voor de nieuwe schema-aanpassing.

De Documentation Engine is uitgevoerd en gevalideerd van fase 3A tot en met 3G.

De drie managed documentblokken zijn succesvol geschreven en daarna geverifieerd.

De RZD 5.1 Canon point mapping/resolver dry-run is succesvol uitgevoerd.

Er zijn 10 Canon-punten verwerkt:
- 6 × EXACT
- 1 × POSSIBLE
- 3 × NO_MATCH

Er zijn 7 bestaande Airtable-records gevonden.

De write-flow is aangepast zodat uitsluitend mappings met status `EXACT` schrijfbaar zijn. Dit is aangepast in `bulkRecordWriteFinal.js` en `bulkRecordWriteSafe2.js`.

Alle 6 schrijfbare punten hebben een geldig Airtable-record-ID.

De gecombineerde mapping dry-run en de Final Bulk Write dry-run zijn succesvol uitgevoerd.

Er zijn geen Airtable-writes uitgevoerd.

Het read-only testscript `scripts/testCombinedPointMapping.js` is toegevoegd en succesvol uitgevoerd.

Er is gecontroleerd dat de inhoud buiten de managed blocks niet is gewijzigd.

De beschermde documenten zijn niet gewijzigd.

Er zijn geen Airtable-writes uitgevoerd door de Documentation Engine.

De wijzigingen zijn lokaal gecommit en naar GitHub gepusht.

---

# Belangrijk besluit

De bestaande **RZD 5.1 Airtable-structuur blijft leidend**.

Er wordt:

- geen nieuwe Airtable-base aangemaakt;
- geen nieuwe `Content Modules`-tabel aangemaakt;
- geen nieuwe `Accommodatie Beoordelingen`-tabel aangemaakt;
- geen bestaande RZD-data verwijderd;
- geen bestaande tabellen onnodig vervangen.

De Builder moet de Canon-structuur koppelen aan de bestaande RZD 5.1-tabellen.

---

# Huidige mapping

| Builder / Canon            | Bestaande RZD 5.1          |
| -------------------------- | --------------------------- |
| Content Modules            | Modules                     |
| Beoordelingspunten         | Beoordelingspunten          |
| Accommodatie Beoordelingen | Accommodatie beoordelingen  |
| Accommodaties              | Accommodaties               |

Deze tabelmapping is technisch vastgelegd.

De exacte inhoudelijke veldmapping wordt nog verder gecontroleerd.

---

# Actief bestand

**Momenteel**

    Geen actief bestand.

---

# Volgende taak

De volgende sessie begint met de resterende documentatieconsistentiecontrole.

1. `documentationMapping.js` controleren en synchroniseren met de definitieve Documentation Engine-status.
2. `CHANGELOG.md` aanvullen met de afgeronde Documentation Engine-werkzaamheden.
3. Volledige documentatie-audit uitvoeren.
4. Daarna verder met de inhoudelijke RZD 5.1 mapping.
5. Tabel **Modules** analyseren.
6. Tabel **Beoordelingspunten** analyseren.
7. Tabel **Accommodatie beoordelingen** analyseren.
8. Exacte Canon-naar-Airtable veldmapping bepalen.
9. Naam-/tabelmapping in de Builder verder controleren.
10. Builder aanpassen waar nodig.
11. Volledige dry run uitvoeren.
12. Resultaat controleren.
13. Pas daarna eventueel productie-synchronisatie uitvoeren.

---

# Openstaande aandachtspunten

- Canon-velden moeten nog exact worden gemapt op de bestaande Airtable-velden.
- De Builder mag niet opnieuw proberen bestaande RZD 5.1-tabellen aan te maken.
- De naamverschillen tussen Canon en Airtable moeten centraal worden afgehandeld.
- Productie-write is nog niet uitgevoerd.
- De resterende documentatieconsistentie moet nog worden gecontroleerd.
- `documentationMapping.js` moet nog worden gesynchroniseerd met de definitieve Documentation Engine-status.
- `CHANGELOG.md` moet nog worden aangevuld met de afgeronde Documentation Engine-werkzaamheden.

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

De wijzigingen zijn naar GitHub gepusht.

De volgende stap is:

**resterende documentatieconsistentie controleren → documentationMapping.js synchroniseren → CHANGELOG.md aanvullen → volledige audit → daarna verder met de RZD 5.1 mapping.**

<!-- RZD-AUTO:START CHECKPOINT -->
### Documentation Engine status

De managed-block beveiliging is actief.

De engine mag uitsluitend inhoud tussen RZD-AUTO START/END-markers wijzigen.

Alle bestaande documentinhoud buiten deze markers blijft onaangetast.

Documentation Engine 3G is uitgevoerd en succesvol geverifieerd.

De volgende sessie gaat verder met de resterende documentatieconsistentiecontrole.

<!-- RZD-AUTO:END CHECKPOINT -->
