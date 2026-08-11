# FIELD_SPECIFICATION

| Eigenschap | Waarde |
|------------|---------|
| Project | RZD Builder |
| Document | FIELD_SPECIFICATION.md |
| Status | Actief |
| Laatste wijziging | 07-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document beschrijft de definitieve veldstructuur die binnen RZD Builder wordt gebruikt.

Alle modules, de Builder, Airtable-synchronisatie, de app en de website gebruiken dezelfde velddefinitie.

---

# Veldstructuur

```javascript
{
    id: "",

    order: 0,

    labels: {
        airtable: "",
        app: "",
        website: ""
    },

    description: "",

    helpText: "",

    type: "",

    required: false,

    readonly: false,

    hidden: false,

    defaultValue: null,

    unit: null,

    options: {},

    validation: {}
}
```

---

# Opmerking

Deze specificatie is leidend voor de volledige Builder-architectuur.

Nieuwe eigenschappen worden uitsluitend toegevoegd wanneer zij generiek toepasbaar zijn op alle veldtypen.

<!-- RZD-AUTO:START FIELD_SPECIFICATION -->
### RZD 5.1 actuele mapping

- Content Modules → Modules
- Beoordelingspunten → Beoordelingspunten
- Accommodatie Beoordelingen → Accommodatie beoordelingen
- Accommodaties → Accommodaties

**Antwoordveld:** Waarde / Resultaat

**Verbeterpunten:** afzonderlijke rapportage- en actielaag

**Bronnen:** relationele laag; meerdere bronnen per accommodatie en beoordeling toegestaan.

**Veiligheid:** bestaande RZD 5.1-data blijft leidend.
<!-- RZD-AUTO:END FIELD_SPECIFICATION -->
