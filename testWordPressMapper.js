
const mapper =
    require("./services/wordpressMapper");

console.log("");
console.log("================================");
console.log("WordPress Mapper Test");
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

const result =
    mapper.mapAccommodation(accommodation);

console.log("Input");
console.log("--------------------------------");

console.dir(accommodation, {
    depth: null
});

console.log("");

console.log("Output");
console.log("--------------------------------");

console.dir(result, {
    depth: null
});

console.log("");

console.log("Controle");
console.log("--------------------------------");

console.log("Title      :", result.title === accommodation.Naam);
console.log("Status     :", result.status === "draft");
console.log("Land       :", result.meta.land === accommodation.Land);
console.log("Regio      :", result.meta.regio === accommodation.Regio);
console.log("Plaats     :", result.meta.plaats === accommodation.Plaats);
console.log("Adres      :", result.meta.adres === accommodation.Adres);
console.log("Website    :", result.meta.website === accommodation.Website);
console.log("Telefoon   :", result.meta.telefoon === accommodation.Telefoon);
console.log("E-mail     :", result.meta.email === accommodation["E-mail"]);
console.log("GPS        :", result.meta.gps === accommodation.GPS);

console.log("");

console.log("================================");
console.log("TEST GESLAAGD");
console.log("================================");