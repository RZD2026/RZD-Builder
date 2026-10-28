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

    locatie: {
        land: "Italië",
        plaats: "Lazise"
    },

    contact: {
        website: "https://www.pianidiclodia.it/nl"
    },

    campingBeoordelingen: [
        {
            id: "recCampingReview",
            ownerType: "camping",
            ownerId: "rec4HsMZa4ZSnBHZP",
            beoordelingspunt: {
                id: "recPointCamping",
                naam: "Camping toegankelijk",
                module: "Toegang & Entree"
            },
            status: "Onbekend",
            waarde: false,
            fotos: ["https://example.test/camping.jpg"],
            opmerking: "Ter plaatse controleren."
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
        opmerking: "Nog te controleren.",
        volledigeBeoordeling: null
    }

};


const mapped =
    mapper.mapCampingAggregate(campingAggregate);

assert(mapped.title === "Piani di Clodia", "campingnaam wordt title");
assert(mapped.meta.camping.id === campingAggregate.id, "camping-ID blijft behouden");
assert(mapped.meta.camping.type === "Camping", "campingtype blijft behouden");
assert(mapped.meta.camping.locatie.plaats === "Lazise", "locatie blijft behouden");
assert(mapped.meta.camping.contact.website === campingAggregate.contact.website, "contact blijft behouden");
assert(mapped.meta.campingBeoordelingen.length === 1, "campingbeoordeling blijft behouden");
assert(mapped.meta.campingBeoordelingen[0].beoordelingspunt.module === "Toegang & Entree", "campingbeoordelingspunt blijft volledig behouden");
assert(mapped.meta.campingBeoordelingen[0].waarde === false, "expliciete false blijft behouden");
assert(mapped.meta.voorzieningen.length === 2, "twee voorzieningen blijven behouden");
assert(mapped.meta.voorzieningen[0].fotos.length === 1, "voorzieningfoto blijft behouden");
assert(mapped.meta.voorzieningen[0].beoordelingen.length === 1, "voorzieningbeoordeling blijft behouden");
assert(mapped.meta.voorzieningen[0].beoordelingen[0].keuze === false, "false in voorzieningbeoordeling blijft behouden");
assert(mapped.meta.voorzieningen[1].beoordelingen.length === 0, "voorziening zonder beoordeling blijft behouden");
assert(mapped.meta.accommodatieLaag.aangepasteAccommodatieAanwezig === "Onbekend", "expliciet Onbekend blijft behouden");
assert(mapped.meta.accommodatieLaag.volledigeBeoordeling === null, "volledigeBeoordeling blijft behouden");


if (failures > 0) {
    process.exit(1);
}

console.log("Alle CampingAggregate-mapper tests geslaagd.");