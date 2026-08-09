# CHECKPOINT

| Eigenschap        | Waarde           |
| ----------------- | ---------------- |
| Project           | RZD Builder      |
| Document          | CHECKPOINT.md    |
| Status            | Actief           |
| Rol               | Sessieoverdracht |
| Laatste wijziging | 09-08-2026       |
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

09-08-2026

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

| Builder / Canon              | Bestaande RZD 5.1       |
| ---------------------------- | ------------------------ |
| Content Modules              | Modules                  |
| Beoordelingspunten           | Beoordelingspunten       |
| Accommodatie Beoordelingen   | Accommodatie beoordelingen |
| Accommodaties                | Accommodaties            |

Deze mapping moet technisch verder worden uitgewerkt voordat een productie-write plaatsvindt.

---

# Actief bestand

**Momenteel**

    Geen actief bestand.

---

# Volgende taak

De volgende sessie gaat verder met de bestaande RZD 5.1-structuur.

1. Tabel **Modules** analyseren.
2. Tabel **Beoordelingspunten** analyseren.
3. Tabel **Accommodatie beoordelingen** analyseren.
4. Exacte Canon-naar-Airtable veldmapping bepalen.
5. Naam-/tabelmapping in de Builder definiëren.
6. Builder aanpassen zodat bestaande RZD 5.1-tabellen worden herkend.
7. Volledige dry run uitvoeren.
8. Resultaat controleren.
9. Pas daarna eventueel productie-synchronisatie uitvoeren.
10. Daarna verder met de Documentation Engine.

---

# Openstaande aandachtspunten

- Canon-velden moeten nog exact worden gemapt op de bestaande Airtable-velden.
- De Builder mag niet opnieuw proberen bestaande RZD 5.1-tabellen aan te maken.
- De naamverschillen tussen Canon en Airtable moeten centraal worden afgehandeld.
- Productie-write is nog niet uitgevoerd.
- De automatische Documentation Engine staat nog op de agenda.
- PROJECT_STATUS en CHECKPOINT worden voorlopig nog handmatig bijgewerkt; automatisering hiervan is onderdeel van Builder 3.0.

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

De volgende stap is:

**bestaande RZD 5.1-tabellen analyseren → Canon-mapping bepalen → Builder aanpassen → dry run → controleren → pas daarna schrijven.**