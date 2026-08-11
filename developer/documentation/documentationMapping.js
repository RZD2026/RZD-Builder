/**
 * RZD Builder Documentation Mapping
 * Phase 3E
 *
 * De bestaande documenten zijn leidend.
 * De Documentation Engine mag uitsluitend bestaande
 * en expliciet aangewezen secties verwerken.
 */

module.exports = {

    phase: "3E",

    status: "SECTION CONTROLLED",

    write_policy: {

        documents_changed: 0,
        airtable_writes: 0,
        github_writes: 0

    },


    principles: [

        "Bestaande documentinhoud blijft behouden.",

        "Alleen expliciet aangewezen bestaande secties mogen worden bijgewerkt.",

        "Een ontbrekende sectie blokkeert automatische wijziging.",

        "CHANGELOG.md is append-only.",

        "Protected documenten worden nooit automatisch gewijzigd.",

        "De bestaande RZD 5.1 Airtable-structuur blijft leidend.",

        "De bestaande beoordelingspunten en antwoorden blijven inhoudelijk leidend.",

        "Waarde / Resultaat blijft het leidende antwoordveld.",

        "Verbeterpunten vormen een afzonderlijke rapportage- en actielaag.",

        "Meerdere bronnen per accommodatie en beoordeling zijn toegestaan.",

        "Ontbrekende inhoud wordt nooit uit de Canon verzonnen."

    ],


    documents: {


        fieldSpecification: {

            path:
                "docs/FIELD_SPECIFICATION.md",

            mode:
                "GENERATED",

            sectionMode:
                "EXPLICIT_ONLY",

            sections: [

                "# Doel",

                "# Veldstructuur",

                "# Opmerking"

            ]

        },


        projectStatus: {

            path:
                "docs/PROJECT_STATUS.md",

            mode:
                "CONTROLLED_UPDATE",

            sectionMode:
                "EXPLICIT_ONLY",

            sections: [

                "# Huidige Status",

                "# Samenvatting",

                "# Teststatus",

                "# Airtable",

                "# Builder 3.0",

                "# Prioriteiten",

                "# Volgende ontwikkelsessie"

            ]

        },


        checkpoint: {

            path:
                "docs/CHECKPOINT.md",

            mode:
                "CONTROLLED_UPDATE",

            sectionMode:
                "EXPLICIT_ONLY",

            sections: [

                "# Laatste sessie",

                "# Laatste afgeronde werkzaamheden",

                "# Huidige mapping",

                "# Volgende taak",

                "# Openstaande aandachtspunten",

                "# Sessieoverdracht"

            ]

        },


        changelog: {

            path:
                "docs/CHANGELOG.md",

            mode:
                "APPEND_ONLY",

            sectionMode:
                "APPEND_ONLY"

        },


        architecture: {

            path:
                "docs/ARCHITECTURE.md",

            mode:
                "PROTECTED",

            sectionMode:
                "PROTECTED"

        },


        aiRules: {

            path:
                "docs/AI_RULES.md",

            mode:
                "PROTECTED",

            sectionMode:
                "PROTECTED"

        },


        documentationArchitecture: {

            path:
                "docs/DOCUMENTATION_ARCHITECTURE.md",

            mode:
                "PROTECTED",

            sectionMode:
                "PROTECTED"

        }

    },


    rzdContentMapping: {

        modules: {

            canon:
                "Content Modules",

            airtable:
                "Modules"

        },


        assessmentPoints: {

            canon:
                "Beoordelingspunten",

            airtable:
                "Beoordelingspunten"

        },


        accommodationAssessments: {

            canon:
                "Accommodatie Beoordelingen",

            airtable:
                "Accommodatie beoordelingen",

            answerField:
                "Waarde / Resultaat"

        },


        accommodations: {

            canon:
                "Accommodaties",

            airtable:
                "Accommodaties"

        },


        improvementPoints: {

            airtable:
                "Verbeterpunten",

            role:
                "Rapportage- en actielaag"

        },


        sources: {

            airtable:
                "Bronnen",

            cardinality:
                "Meerdere bronnen toegestaan"

        }

    }

};