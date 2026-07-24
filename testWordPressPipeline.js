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

console.log("================================");
console.log("PIPELINE TEST GESLAAGD");
console.log("================================");