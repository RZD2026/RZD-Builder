# RZD Builder → WordPress Architectuur

## Doel

Automatisch accommodaties vanuit Airtable publiceren naar WordPress.

---

# Pipeline

Airtable
↓
Builder
↓
WordPressMapper
↓
WordPressPublisher
↓
WordPress REST API
↓
WordPress Website

---

# Publicatiemodel

- Type: Custom Post Type
- Status: draft (standaard)
- Publicatie: handmatig of automatisch

---

# Basisvelden

| Airtable | WordPress |
|----------|-----------|
| Naam | title |
| Land | meta.land |
| Regio | meta.regio |
| Plaats | meta.plaats |
| Adres | meta.adres |
| Website | meta.website |
| Telefoon | meta.telefoon |
| E-mail | meta.email |
| GPS | meta.gps |

---

# Toekomst

- Foto's synchroniseren
- Reviews synchroniseren
- AI-samenvattingen
- SEO
- Meertaligheid
- Categorieën
- Tags

---

Status

Document versie 1.0