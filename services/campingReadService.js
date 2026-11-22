const airtableAdapter =
    require("./airtableAdapter");

const pointLookupCache =
    require("./pointLookupCache");

const airtablePointResolver =
    require("../content/mapping/airtablePointResolver");


const CAMPING_TABLE = "Accommodaties";
const VOORZIENINGEN_TABLE = "Voorzieningen";
const REVIEW_TABLE = "Accommodatie beoordelingen";
const CHOICE_OPTIONS_TABLE = "Keuzeopties";
const EXPERIENCES_TABLE = "Reizigerservaringen";
const NOTES_TABLE = "Opmerkingen";

const ASSESSMENTSETS = [
    { naam: "Toegang & Entree", module: "Toegang & Entree" },
    { naam: "Parkeren", module: "Parkeren" },
    { naam: "Verblijfsruimte", module: "Verblijfsruimte" },
    { naam: "Sanitair", module: "Sanitair" },
    { naam: "Slaapgedeelte", module: "Slaapgedeelte" },
    { naam: "Balkon/Terras", module: "Balkon/terras" },
    { naam: "Badkamer", module: "Badkamer" }
];


function isPresent(value) {

    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value === "string" && value.trim() === "") {
        return false;
    }

    if (Array.isArray(value) && value.length === 0) {
        return false;
    }

    return true;

}


function set(target, key, value) {

    if (isPresent(value)) {
        target[key] = value;
    }

}


function escapeFormulaValue(value) {

    return String(value).replace(/'/g, "\\'");

}


function firstLinkedId(fieldValue) {

    if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
        return undefined;
    }

    const first = fieldValue[0];

    return typeof first === "string" ? first : first?.id;

}

function linkedIds(fieldValue) {

    if (!Array.isArray(fieldValue)) {
        return [];
    }

    return [...new Set(
        fieldValue
            .map(value => typeof value === "string" ? value : value?.id)
            .filter(value => typeof value === "string" && value.length > 0)
    )];

}


function choiceIds(fieldValue) {

    if (!Array.isArray(fieldValue)) {
        return [];
    }

    return fieldValue
        .map(value => typeof value === "string" ? value : value?.id)
        .filter(value => typeof value === "string" && value.length > 0);

}


function hasLinkedId(fieldValue, recordId) {

    return linkedIds(fieldValue).includes(recordId);

}


function buildCamping(record) {

    const fields = record.fields || {};

    const camping = {
        id: record.id,
        naam: fields["Naam"],
        type: fields["Type accommodatie"],
        aandachtspunten: fields["Aandachtspunten"] || "",
        fotos: fields["Foto's"] || []

            };

    const locatie = {};

    set(locatie, "land", fields["Land"]);
    set(locatie, "regio", fields["Regio"]);
    set(locatie, "plaats", fields["Plaats"]);
    set(locatie, "adres", fields["Adres"]);
    set(locatie, "gps", fields["GPS"]);

    if (Object.keys(locatie).length > 0) {
        camping.locatie = locatie;
    }

    const contact = {};

    set(contact, "website", fields["Website"]);
    set(contact, "telefoon", fields["Telefoon"]);
    set(contact, "email", fields["E-mail"]);

    if (Object.keys(contact).length > 0) {
        camping.contact = contact;
    }

    camping.campingBeoordelingen = [];
    camping.voorzieningen = [];
    camping.reizigerservaringen = [];
    camping.opmerkingen = [];

    const accommodatieLaag = {};

    set(
        accommodatieLaag,
        "aangepasteAccommodatieAanwezig",
        fields["Aangepaste accommodatie aanwezig"]
    );

    set(
        accommodatieLaag,
        "typeAangepasteAccommodatie",
        fields["Type aangepaste accommodatie"]
    );

    set(
        accommodatieLaag,
        "opmerking",
        fields["Opmerking aangepaste accommodatie"]
    );

    if (Object.keys(accommodatieLaag).length > 0) {
        camping.accommodatieLaag = accommodatieLaag;
    }

    return camping;

}


function buildReizigerservaring(record) {

    const fields = record.fields || {};

    const ervaring = {
        id: record.id,
        fotos: fields["Foto / Bewijs"] || []
    };

    set(ervaring, "ervaring", fields["Ervaring"]);
    set(ervaring, "reizigerstype", fields["Reizigerstype"]);
    set(ervaring, "positief", fields["Positief"]);
    set(ervaring, "aandachtspunt", fields["Aandachtspunt"]);
    set(ervaring, "datumErvaring", fields["Datum ervaring"]);

    return ervaring;

}


function buildOpmerking(record, moduleNameById) {

    const fields = record.fields || {};
    const moduleId = firstLinkedId(fields["Module"]);

    const opmerking = {
        id: record.id,
        fotos: fields["Foto / Bewijs"] || []
    };

    set(opmerking, "onderwerp", fields["Onderwerp"]);
    set(opmerking, "omschrijving", fields["Omschrijving"]);
    set(opmerking, "module", moduleId ? moduleNameById.get(moduleId) : undefined);

    return opmerking;

}


function buildVoorziening(record) {

    const fields = record.fields || {};

    const voorziening = {
        id: record.id,
        naam: fields["Naam"],
        type: fields["Type voorziening"],
        fotos: fields["Foto / Bewijs"] || [],
        beoordelingen: []
    };

    set(voorziening, "status", fields["Status"]);
    set(voorziening, "opmerking", fields["Opmerking"]);

    return voorziening;

}


async function buildBeoordeling(record, ownerType, ownerId, choiceTextById) {

    const fields = record.fields || {};

    const pointRecordId = firstLinkedId(fields["Beoordelingspunt"]);

    // Naam/module komen uit de procesbrede pointLookupCache (max. 2 extra calls, eenmalig per proces).
    const pointInfo =
        pointRecordId
            ? await pointLookupCache.getPointInfo(pointRecordId)
            : null;

    const beoordelingspunt = {
        id: pointRecordId
    };

    set(beoordelingspunt, "naam", pointInfo?.naam);
    set(beoordelingspunt, "module", pointInfo?.module);
    set(beoordelingspunt, "type", pointInfo?.type);
    set(beoordelingspunt, "omschrijving", pointInfo?.omschrijving);
    set(beoordelingspunt, "toelichting", pointInfo?.toelichting);

    const beoordeling = {

        id: record.id,
        ownerType,
        ownerId,

        beoordelingspunt,

        status: fields["Status"],

        fotos: fields["Foto / Bewijs"] || []

    };

    set(beoordeling, "waarde", fields["Waarde / Resultaat"]);
    if (Object.prototype.hasOwnProperty.call(fields, "Keuze")) {
        beoordeling.keuze = fields["Keuze"];
    }

    const linkedChoiceIds = choiceIds(fields["Keuze"]);

    if (linkedChoiceIds.length > 0) {
        beoordeling.keuzeOpties = linkedChoiceIds.map(id => {
            const text = choiceTextById.get(id);

            return {
                id,
                tekst: typeof text === "string" && text.trim() !== ""
                    ? text
                    : null
            };
        });
    }

    set(beoordeling, "opmerking", fields["Opmerking"]);

    return beoordeling;

}


async function loadChoiceTextById(reviewRecords) {

    const choiceRecordIds = [
        ...new Set(
            reviewRecords.flatMap(record =>
                choiceIds(record.fields?.["Keuze"])
            )
        )
    ];

    if (choiceRecordIds.length === 0) {
        return new Map();
    }

    const choiceRecords =
        await airtableAdapter.listRecords(CHOICE_OPTIONS_TABLE, {
            fields: ["Keuze"]
        });

    return new Map(
        choiceRecords.map(record => [
            record.id,
            record.fields?.["Keuze"]
        ])
    );

}


function buildVoorzieningenFilter(campingName) {

    return (
        `SEARCH('${escapeFormulaValue(campingName)}', ARRAYJOIN({Camping / park}))`
    );

}


function buildAssessmentsets(beoordelingen) {

    return ASSESSMENTSETS.map(assessmentset => ({
        naam: assessmentset.naam,
        beoordelingen: beoordelingen.filter(beoordeling =>
            beoordeling.beoordelingspunt?.module === assessmentset.module
        )
    }));

}


function buildReviewsFilter(campingName, voorzieningen) {

    const conditions = [

        `AND(SEARCH('${escapeFormulaValue(campingName)}', ARRAYJOIN({Accommodatie})), {Voorziening} = BLANK())`

    ];

    voorzieningen.forEach(voorziening => {

        conditions.push(
            `SEARCH('${escapeFormulaValue(voorziening.naam)}', ARRAYJOIN({Voorziening}))`
        );

    });

    return conditions.length === 1
        ? conditions[0]
        : `OR(${conditions.join(", ")})`;

}


async function getCampingAggregate(campingId) {

    if (!campingId) {
        throw new Error(
            "getCampingAggregate: campingId is verplicht."
        );
    }

    // Call 1/3: het camping/park-record zelf.
    const campingRecord =
        await airtableAdapter.getRecord(CAMPING_TABLE, campingId);

    const camping = buildCamping(campingRecord);

    // Call 2/3: alle gekoppelde voorzieningen, in één keer.
    const voorzieningRecords =
        await airtableAdapter.listRecords(VOORZIENINGEN_TABLE, {
            filterByFormula: buildVoorzieningenFilter(camping.naam)
        });

    const voorzieningen = voorzieningRecords
        .filter(record =>
            hasLinkedId(record.fields?.["Camping / park"], campingId)
        )
        .map(buildVoorziening);

    const voorzieningById =
        new Map(voorzieningen.map(v => [v.id, v]));

    // Call 3/3: alle relevante beoordelingen (camping + alle voorzieningen) in één gecombineerde query.
    const reviewRecords =
        await airtableAdapter.listRecords(REVIEW_TABLE, {
            filterByFormula: buildReviewsFilter(
                camping.naam,
                voorzieningen
            )
        });

    const reviewsToBuild = [];

    for (const record of reviewRecords) {

        const fields = record.fields || {};

        const voorzieningLinks = fields["Voorziening"];
        const voorzieningIds = linkedIds(voorzieningLinks);

        if (voorzieningIds.length > 0) {

            for (const voorzieningId of voorzieningIds) {

                const voorziening = voorzieningById.get(voorzieningId);

                if (voorziening) {
                    reviewsToBuild.push({
                        record,
                        ownerType: "voorziening",
                        ownerId: voorzieningId
                    });
                }

            }

            continue;

        }

        if (
            Array.isArray(voorzieningLinks) &&
            voorzieningLinks.length > 0
        ) {
            continue;
        }

        if (hasLinkedId(fields["Accommodatie"], campingId)) {
            reviewsToBuild.push({
                record,
                ownerType: "camping",
                ownerId: campingId
            });

        }

    }

    const choiceTextById =
        await loadChoiceTextById(
            reviewsToBuild.map(review => review.record)
        );

    for (const review of reviewsToBuild) {

        const beoordeling = await buildBeoordeling(
            review.record,
            review.ownerType,
            review.ownerId,
            choiceTextById
        );

        if (review.ownerType === "camping") {
            camping.campingBeoordelingen.push(beoordeling);
        } else {
            voorzieningById.get(review.ownerId).beoordelingen.push(beoordeling);
        }

    }

    const assessmentsets = buildAssessmentsets(
        camping.campingBeoordelingen
    );

    const experienceRecords =
        await airtableAdapter.listRecords(EXPERIENCES_TABLE);

    camping.reizigerservaringen = experienceRecords
        .filter(record => hasLinkedId(record.fields?.["Accommodatie"], campingId))
        .map(buildReizigerservaring);

    const noteIds = campingRecord.fields?.["Opmerkingen"];

    if (Array.isArray(noteIds) && noteIds.length > 0) {

        const noteRecords =
            await airtableAdapter.listRecords(NOTES_TABLE);

        const modules =
            await airtablePointResolver.getModules();

        const moduleNameById = new Map(
            modules.map(record => [record.id, record.fields["Module naam"]])
        );

        camping.opmerkingen = noteRecords
            .filter(record => hasLinkedId(record.fields?.["Accommodatie"], campingId))
            .map(record => buildOpmerking(record, moduleNameById));

    }

    camping.assessmentsets = assessmentsets;
    camping.voorzieningen = voorzieningen;

    return camping;

}


module.exports = {
    getCampingAggregate,
    buildCamping,
    buildVoorziening,
    buildBeoordeling,
    buildVoorzieningenFilter,
    buildReviewsFilter
};
