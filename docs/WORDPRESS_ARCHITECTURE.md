# WORDPRESS_ARCHITECTURE

| Eigenschap | Waarde |
|------------|--------|
| Project | RZD Builder |
| Document | WORDPRESS_ARCHITECTURE.md |
| Status | Actief |
| Rol | WordPress-publicatiearchitectuur |
| Laatste wijziging | 07-08-2026 |
| Eigenaar | Pascalle Vroegop |

---

# Doel

Dit document beschrijft de architectuur van de automatische publicatie vanuit **RZD Builder** naar **WordPress**.

De architectuur beschrijft uitsluitend:

- de publicatiepipeline;
- de verantwoordelijkheden van de componenten;
- de gegevensstroom;
- de mapping tussen Builder en WordPress;
- de architectuurprincipes;
- de toekomstige ontwikkeling van de publicatielaag.

Implementatiedetails en broncode vallen buiten de scope van dit document.

---

# Scope

Dit document beschrijft uitsluitend de architectuur van de WordPress-publicatielaag.

Het behandelt:

- de architectuur;
- de gegevensstroom;
- de verantwoordelijkheden;
- de publicatiepipeline;
- de veldmapping;
- de ontwerpprincipes.

De implementatie wordt beschreven in de broncode en de bijbehorende technische documentatie.

---

# Architectuuroverzicht

De publicatie verloopt volledig geautomatiseerd via RZD Builder.

```text
Airtable
    │
    ▼
BuilderKernel
    │
    ▼
WordPressMapper
    │
    ▼
WordPressPublisher
    │
    ▼
WordPress REST API
    │
    ▼
WordPress Website