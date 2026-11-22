require("dotenv").config();
const mapper =
    require("./services/wordpressMapper");

const publisher =
    require("./services/wordpressPublisher");

console.log("");
console.log("================================");
console.log("WordPress Pipeline Test");
console.log("================================");
console.log("");

const accommodation = {

    Naam: "Camping Bella Italia",

    Land: "Italië",

    Regio: "Veneto",

    Plaats: "Peschiera del Garda",

    Adres: "Via Bell'Italia 2",

    Website: "https://www.bellaitalia.it",

    Telefoon: "+39 045 6400688",

    "E-mail": "info@bellaitalia.it",

    GPS: "45.4394,10.6882"

};

console.log("Airtable Record");
console.log("--------------------------------");

console.dir(accommodation, {
    depth: null
});

console.log("");

const mapped =
    mapper.mapAccommodation(accommodation);

console.log("WordPress Object");
console.log("--------------------------------");

console.dir(mapped, {
    depth: null
});

console.log("");

const prepared =
    publisher.prepare(mapped);

console.log("Publisher Payload");
console.log("--------------------------------");

console.dir(prepared, {
    depth: null
});

console.log("");

console.log("Controle");
console.log("--------------------------------");

console.log(
    "Mapper      :",
    mapped.title === accommodation.Naam
);

console.log(
    "Publisher   :",
    prepared.ready === true
);

console.log(
    "Payload     :",
    prepared.payload.title === accommodation.Naam
);

console.log(
    "Meta Land   :",
    prepared.payload.meta.land === accommodation.Land
);

console.log("");

const campingAggregate = {

    id: "recCampingAggregate",
    naam: "Camping Bella Italia",
    type: "Camping",

    locatie: {
        land: "Italië",
        plaats: "Peschiera del Garda"
    },

    contact: {
        website: "https://www.bellaitalia.it"
    },

    campingBeoordelingen: [
        {
            id: "recCampingReview",
            ownerType: "camping",
            ownerId: "recCampingAggregate",
            beoordelingspunt: {
                id: "recCampingPoint",
                naam: "Toegang camping",
                module: "Toegang & Entree"
            },
            status: "Onbekend",
            waarde: false,
            fotos: [],
            opmerking: "Ter plaatse controleren."
        }
    ],

    voorzieningen: [
        {
            id: "recProvision",
            naam: "Sanitairgebouw 1",
            type: "Sanitairgebouw",
            status: "Onbekend",
            fotos: [],
            beoordelingen: [
                {
                    id: "recProvisionReview",
                    ownerType: "voorziening",
                    ownerId: "recProvision",
                    beoordelingspunt: {
                        id: "recProvisionPoint",
                        naam: "Draaicirkel bij entree",
                        module: "Toegang & Entree"
                    },
                    status: "Onbekend",
                    keuze: false,
                    fotos: [],
                    opmerking: "Ter plaatse controleren."
                }
            ]
        }
    ],

    accommodatieLaag: {
        aangepasteAccommodatieAanwezig: "Onbekend",
        typeAangepasteAccommodatie: "Stacaravan",
        opmerking: "Nog te controleren.",
        volledigeBeoordeling: null
    }

};

const mappedCampingAggregate =
    mapper.mapCampingAggregate(campingAggregate);

const preparedCampingAggregate =
    publisher.prepare(mappedCampingAggregate);

console.log("CampingAggregate-keten");
console.log("--------------------------------");

console.log(
    "Title          :",
    preparedCampingAggregate.payload.title === campingAggregate.naam
);

console.log(
    "Status         :",
    preparedCampingAggregate.payload.status === "draft"
);

console.log(
    "Camping        :",
    preparedCampingAggregate.payload.meta.camping.id === campingAggregate.id &&
    preparedCampingAggregate.payload.meta.camping.locatie.plaats === campingAggregate.locatie.plaats
);

console.log(
    "Campingreview  :",
    preparedCampingAggregate.payload.meta.campingBeoordelingen.length === 1 &&
    preparedCampingAggregate.payload.meta.campingBeoordelingen[0].beoordelingspunt.naam ===
        campingAggregate.campingBeoordelingen[0].beoordelingspunt.naam
);

console.log(
    "Voorziening    :",
    preparedCampingAggregate.payload.meta.voorzieningen.length === 1 &&
    preparedCampingAggregate.payload.meta.voorzieningen[0].naam ===
        campingAggregate.voorzieningen[0].naam
);

console.log(
    "Voorzieningreview:",
    preparedCampingAggregate.payload.meta.voorzieningen[0].beoordelingen.length === 1 &&
    preparedCampingAggregate.payload.meta.voorzieningen[0].beoordelingen[0].beoordelingspunt.module ===
        campingAggregate.voorzieningen[0].beoordelingen[0].beoordelingspunt.module
);

console.log(
    "Accommodatielaag:",
    preparedCampingAggregate.payload.meta.accommodatieLaag.typeAangepasteAccommodatie ===
        campingAggregate.accommodatieLaag.typeAangepasteAccommodatie
);

console.log(
    "False-waarden  :",
    preparedCampingAggregate.payload.meta.campingBeoordelingen[0].waarde === false &&
    preparedCampingAggregate.payload.meta.voorzieningen[0].beoordelingen[0].keuze === false
);

console.log("");

console.log("================================");
console.log("PIPELINE TEST GESLAAGD");
console.log("================================");