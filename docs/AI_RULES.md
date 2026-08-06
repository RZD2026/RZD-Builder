
# AI_RULES

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | AI_RULES.md |
| Status | Actief |
| Rol | Leidend ontwikkelprotocol |
| Laatste wijziging | 05-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document beschrijft de vaste werkwijze voor de ontwikkeling van de RZD Builder.

Deze regels gelden voor iedere ontwikkelsessie.

Wanneer een voorstel afwijkt van deze regels, hebben deze regels voorrang.

---

# Algemene werkwijze

Iedere wijziging verloopt volgens dezelfde volgorde.

1. Analyse
2. Bespreken
3. Goedkeuring
4. Wijzigen
5. Testen
6. Documentatie bijwerken
7. Checkpoint maken

Er worden geen stappen overgeslagen.

---

# Wijzigen van code

## Altijd

- Werk aan één bestand tegelijk.
- Houd wijzigingen zo klein mogelijk.
- Verbeter bestaande code voordat nieuwe code wordt toegevoegd.
- Houd de bestaande architectuur aan.
- Gebruik bestaande services als die al bestaan.
- Voorkom dubbele code.
- Voorkom dubbele logica.
- Test na iedere wijziging.

---

## Nooit

- Grote refactors zonder overleg.
- Meerdere bestanden tegelijk aanpassen.
- Nieuwe architectuur introduceren tijdens een lopende refactor.
- Functionaliteit verwijderen zonder overleg.
- Logica verplaatsen zonder duidelijke reden.
- Ongevraagde optimalisaties uitvoeren.

---

# Reviewregels

Tijdens een review:

- Geen code wijzigen.
- Alleen analyseren.
- Problemen categoriseren.

Categorieën:

🟢 GOED

🟡 AANPASSEN

🟠 ONDERZOEK

🔴 BUG

---

# Documentatie

Document-specifieke rollen, officiële inhoud, bijwerkmomenten en verwijzingsregels zijn vastgelegd in DOCUMENTATION_ARCHITECTURE.md.

---

# Testregels

Na iedere wijziging:

1. Opslaan.
2. Test uitvoeren.
3. Resultaat controleren.
4. Pas daarna verder.

---

# Communicatie

Voorstellen moeten:

- concreet zijn;
- technisch onderbouwd zijn;
- zo klein mogelijk blijven.

Geen grote koerswijzigingen tijdens een lopende taak.

---

# Besluitvorming

Wanneer meerdere oplossingen mogelijk zijn:

1. Kies de oplossing met het minste risico.
2. Kies de oplossing die het beste aansluit op de bestaande architectuur.
3. Kies de oplossing met de minste impact op andere bestanden.

---

# Belangrijkste uitgangspunt

**Stabiliteit gaat altijd vóór snelheid.**

Een kleine, veilige wijziging heeft altijd de voorkeur boven een grote refactor.

---

# Ontwikkelomgeving

Standaard werkwijze:

- Windows CMD
- VS Code
- Geen Canvas
- Bestanden één voor één behandelen
- Testen na iedere wijziging
- Documentatie onderdeel van het project houden

---

# Werkplanning en sessiebeheer

## 1. Tijdsinschatting vooraf

Voordat aan een nieuwe taak wordt begonnen geeft de AI een inschatting van:

- analyse;
- eventuele wijzigingen;
- testen;
- documentatie;
- totale verwachte duur (minimum en maximum).

Hiermee kan worden besloten of de taak nog in de huidige sessie wordt uitgevoerd of beter wordt doorgeschoven.

---

## 2. Stopadvies

De AI geeft vooraf een stopadvies.

Bijvoorbeeld:

- ✔ Goed moment om nog te beginnen.
- ✔ Nog circa 20 minuten werk.
- ✋ Beter bewaren voor de volgende sessie.
- ✋ Geen logisch stopmoment binnen afzienbare tijd.

---

## 3. Logische stopmomenten bewaken

De AI bewaakt logische stopmomenten.

Bij voorkeur wordt een sessie beëindigd nadat een volledige taak is afgerond:

Analyse
→ Wijziging
→ Test
→ Documentatie

Er wordt bij voorkeur niet gestopt:

- midden in een analyse;
- midden in een wijziging;
- voordat getest is;
- terwijl documentatie nog achterloopt.

---

## 4. Sessie-afsluiting

Aan het einde van iedere sessie maakt de AI een korte samenvatting.

Deze bevat minimaal:

- afgeronde werkzaamheden;
- uitgevoerde tests;
- bijgewerkte documentatie;
- resterende open punten;
- eerstvolgende bestand;
- geschatte duur van de volgende taak.

---

## 5. Nieuwe taak starten

Voordat een nieuwe taak start vermeldt de AI altijd:

Bestand:

...

Doel:

...

Geschatte duur:

...

Verwacht stopmoment:

...

Benodigde test:

...

Documentatie bijwerken:

Ja / Nee

Pas daarna wordt met de analyse begonnen.

---

## 6. Afronden vóór starten

Wanneer een lopende taak binnen korte tijd volledig kan worden afgerond, adviseert de AI deze eerst af te ronden voordat aan een nieuwe taak wordt begonnen.

Voorkeur gaat uit naar volledig afgeronde taken boven meerdere half afgeronde taken.

## 7. Geen aannames

De AI trekt geen conclusies voordat alle gevraagde testresultaten, zoekresultaten of command-uitvoer beschikbaar zijn.

Bij meerdere opdrachten wordt altijd gewacht op de volledige uitvoer voordat een conclusie of vervolgstap wordt gegeven.
