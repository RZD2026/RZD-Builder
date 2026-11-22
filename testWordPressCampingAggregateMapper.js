const mapper =
    require("./services/wordpressMapper");


let failures = 0;

function assert(condition, message) {

    if (!condition) {
        failures++;
        console.log(`❌ ${message}`);
    } else {
        console.log(`✓ ${message}`);
    }

}


const campingAggregate = {

    id: "rec4HsMZa4ZSnBHZP",
    naam: "Piani di Clodia",
    type: "Camping",
    fotos: [
        {
            id: "attCamping1",
            url: "https://example.test/camping.jpg",
            filename: "camping.jpg",
            type: "image/jpeg"
        }
    ],

    locatie: {
        land: "Italië",
        plaats: "Lazise",
        adres: "Interne teststraat 42"
    },

    contact: {
        website: "https://www.pianidiclodia.it/nl"
    },

    aandachtspunten: " \t ",
    verbeterpunten: [
        { omschrijving: "INTERN: verbeterpunt uit het interne rapport." }
    ],

    reizigerservaringen: [
        {
            id: "recEmptyExperience",
            ervaring: " \t ",
            reizigerstype: "",
            positief: null,
            aandachtspunt: " "
        },
        {
            id: "recZeroExperience",
            ervaring: "Ervaring met een expliciete nulwaarde.",
            positief: 0
        },
        {
            id: "recFalseExperience",
            ervaring: "Ervaring met een expliciete nee-waarde.",
            positief: false
        }
    ],

    campingBeoordelingen: [
        {
            id: "recCampingReview",
            ownerType: "camping",
            ownerId: "rec4HsMZa4ZSnBHZP",
            beoordelingspunt: {
                id: "recPointCamping",
                naam: "Camping toegankelijk",
                module: "Toegang & Entree",
                omschrijving: "Omschrijving van het beoordelingspunt.",
                toelichting: "Toelichting bij het beoordelingspunt."
            },
            status: "Onbekend",
            waarde: false,
            fotos: ["https://example.test/camping.jpg"],
            opmerking: "Ter plaatse controleren.",
            verbeterpunten: [
                { omschrijving: "INTERN: verbeterpunt uit de review." }
            ]
        }
    ],

    voorzieningen: [
        {
            id: "recVoorziening1",
            naam: "Sanitairgebouw 1",
            type: "Sanitairgebouw",
            status: "Nee",
            fotos: ["https://example.test/sanitair.jpg"],
            beoordelingen: [
                {
                    id: "recProvisionReview",
                    ownerType: "voorziening",
                    ownerId: "recVoorziening1",
                    beoordelingspunt: {
                        id: "recPointProvision",
                        naam: "Draaicirkel bij entree",
                        module: "Toegang & Entree"
                    },
                    status: "Onbekend",
                    keuze: false,
                    fotos: ["https://example.test/review.jpg"],
                    opmerking: "Nog te beoordelen."
                }
            ]
        },
        {
            id: "recVoorziening2",
            naam: "Zwembad",
            type: "Zwembad",
            status: "Onbekend",
            beoordelingen: []
        }
    ],

    accommodatieLaag: {
        aangepasteAccommodatieAanwezig: "Onbekend",
        typeAangepasteAccommodatie: "Stacaravan",
        opmerking: "Nog te controleren."
    }

};


const mapped =
    mapper.mapCampingAggregate(campingAggregate);

assert(mapped.title === "Piani di Clodia", "campingnaam wordt title");
assert(mapped.meta.camping.id === campingAggregate.id, "camping-ID blijft behouden");
assert(mapped.meta.camping.type === "Camping", "campingtype blijft behouden");
assert(
    mapped.meta.camping.fotos[0].id === "attCamping1" &&
    mapped.meta.camping.fotos[0].url === "https://example.test/camping.jpg" &&
    mapped.meta.camping.fotos[0].filename === "camping.jpg",
    "Airtable campingfoto blijft behouden in de mappermetadata"
);
assert(
    mapped.content.includes('<img src="https://example.test/camping.jpg" alt="camping.jpg">'),
    "eerste campingfoto wordt door de bestaande mappercontent gerenderd"
);
assert(mapped.meta.camping.locatie.plaats === "Lazise", "locatie blijft behouden");
assert(
    mapped.meta.camping.locatie.adres === "Interne teststraat 42",
    "straatadres blijft behouden in interne locatiegegevens"
);
assert(
    !mapped.content.includes("Interne teststraat 42") &&
    !mapped.content.includes("<dt>Adres</dt>"),
    "straatadres wordt niet in de openbare mappercontent getoond"
);
assert(mapped.meta.camping.contact.website === campingAggregate.contact.website, "contact blijft behouden");
assert(mapped.meta.campingBeoordelingen.length === 1, "campingbeoordeling blijft behouden");
assert(mapped.meta.campingBeoordelingen[0].beoordelingspunt.module === "Toegang & Entree", "campingbeoordelingspunt blijft volledig behouden");
assert(mapped.meta.campingBeoordelingen[0].waarde === false, "expliciete false blijft behouden");
assert(
    mapped.meta.campingBeoordelingen[0].beoordelingspunt.omschrijving === "Omschrijving van het beoordelingspunt." &&
    mapped.meta.campingBeoordelingen[0].beoordelingspunt.toelichting === "Toelichting bij het beoordelingspunt.",
    "omschrijving en toelichting blijven in de beoordelingmetadata behouden"
);
assert(
    mapped.content.includes('<p class="review-description"><strong>Omschrijving:</strong> Omschrijving van het beoordelingspunt.</p>'),
    "publieke mappercontent bevat de omschrijving van het beoordelingspunt"
);
assert(
    mapped.content.includes('<p class="review-clarification"><strong>Toelichting:</strong> Toelichting bij het beoordelingspunt.</p>'),
    "publieke mappercontent bevat de toelichting van het beoordelingspunt"
);
assert(
    mapped.content.includes("Status: Onbekend"),
    "publieke mappercontent bevat de beoordelingsstatus"
);
assert(
    mapped.content.includes("Ter plaatse controleren."),
    "publieke mappercontent bevat de reviewopmerking"
);
assert(
    mapped.content.includes("https://example.test/camping.jpg"),
    "publieke mappercontent bevat het reviewbewijs"
);
assert(
    !JSON.stringify(mapped.meta).includes("INTERN: verbeterpunt") &&
    !mapped.content.includes("INTERN: verbeterpunt"),
    "verbeterpunten blijven buiten de publieke mappermetadata en content"
);
assert(mapped.meta.voorzieningen.length === 2, "twee voorzieningen blijven behouden");
assert(mapped.meta.voorzieningen[0].fotos.length === 1, "voorzieningfoto blijft behouden");
assert(mapped.meta.voorzieningen[0].beoordelingen.length === 1, "voorzieningbeoordeling blijft behouden");
assert(mapped.meta.voorzieningen[0].beoordelingen[0].keuze === false, "false in voorzieningbeoordeling blijft behouden");
assert(mapped.meta.voorzieningen[1].beoordelingen.length === 0, "voorziening zonder beoordeling blijft behouden");
assert(mapped.meta.accommodatieLaag.aangepasteAccommodatieAanwezig === "Onbekend", "expliciet Onbekend blijft behouden");
assert(
    mapped.content.includes("<dd>Onbekend</dd>"),
    "expliciete Onbekend-status blijft in de WordPress-content zichtbaar"
);
assert(
    !Object.prototype.hasOwnProperty.call(
        mapped.meta.accommodatieLaag,
        "volledigeBeoordeling"
    ),
    "de mapper voegt geen placeholder voor een toekomstige volledige beoordeling toe"
);
assert(!mapped.content.includes("Praktische aandachtspunten"), "whitespace wordt niet als praktisch aandachtspunt getoond");
assert(!mapped.content.includes("<article></article>"), "lege reizigerservaringen leveren geen leeg HTML-element op");
assert(
    mapped.content.includes("Ervaring met een expliciete nulwaarde.") &&
    mapped.content.includes("<dt>Positief</dt><dd>0</dd>"),
    "een expliciete nulwaarde blijft zichtbaar in de previewcontent"
);
assert(
    mapped.content.includes("Ervaring met een expliciete nee-waarde.") &&
    mapped.content.includes("<dt>Positief</dt><dd>false</dd>"),
    "een expliciete false-waarde blijft zichtbaar in de previewcontent"
);
assert(
    mapper.pageValue("Leeg", " \t ") === "" &&
    mapper.pagePhoto(" \t ", "Foto") === "",
    "whitespace-only velden en foto-URL's worden niet weergegeven"
);


if (failures > 0) {
    process.exit(1);
}

console.log("Alle CampingAggregate-mapper tests geslaagd.");