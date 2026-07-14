
# RZD Builder v1.0.0

RZD Builder is het ontwikkelproject voor Reizen Zonder Drempels (RZD).

Met deze Builder worden automatisch tabellen, velden en modules opgebouwd in een Airtable-base.

---

## Functies

- Verbinding maken met Airtable
- Schema van de database uitlezen
- Tabellen controleren
- Velden controleren
- Modules automatisch toevoegen
- Logging
- Back-ups
- Validatie

---

## Installatie

Installeer de benodigde pakketten:

```bash
npm install
```

Maak vervolgens een `.env`-bestand aan op basis van `.env.example`.

Voorbeeld:

```
AIRTABLE_TOKEN=xxxxxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxx
```

---

## Beschikbare opdrachten

Test de verbinding:

```bash
node index.js test
```

Lees het schema van de database uit:

```bash
node index.js schema
```

Maak een back-up:

```bash
node index.js backup
```

Controleer de configuratie:

```bash
node index.js validate
```

---

## Projectstructuur

```
RZD Builder
│
├── builders/
├── config/
├── modules/
├── services/
├── backup/
├── logs/
│
├── index.js
├── package.json
├── README.md
├── .env
└── .env.example
```

---

## Versie

RZD Builder v1.0.0

Ontwikkeld voor het project:

**Reizen Zonder Drempels (RZD)**

Doel:
een volledig geautomatiseerde Builder waarmee nieuwe modules veilig aan de Airtable-database kunnen worden toegevoegd.
