const airtablePointResolver =
    require("../content/mapping/airtablePointResolver");

const contentModuleLoader =
    require("./contentModuleLoader");

const airtableMapping =
    require("../content/mapping/airtableMapping");

const pointMappings =
    require("../content/mapping/pointMappings");


let loadPromise = null;
let moduleNameById = null;
let pointById = null;
let canonicalPointInfoById = null;


function firstLinkedId(fieldValue) {

    if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
        return undefined;
    }

    const first = fieldValue[0];

    return typeof first === "string" ? first : first?.id;

}


function hasValue(value) {

    return value !== undefined && value !== null && value !== "";

}


// Prioriteit: canoniek type, dan Airtable-veld "Type beoordeling", anders undefined.
function resolveAssessmentType(canonicalType, fields) {

    if (hasValue(canonicalType)) {
        return canonicalType;
    }

    const airtableType = fields?.["Type beoordeling"];

    return hasValue(airtableType) ? airtableType : undefined;

}


async function loadCanonicalPointInfo(modules, points) {

    const contentModule =
        await contentModuleLoader.load("toegang");

    const mappings =
        await airtableMapping.createMany(
            contentModule.points,
            pointMappings,
            { modules, points }
        );

    return new Map(
        mappings
            .filter(mapping =>
                mapping.status !== "NO_MATCH" &&
                mapping.point?.recordId &&
                mapping.point?.type !== undefined
            )
            .map(mapping => [
                mapping.point.recordId,
                {
                    naam: mapping.point.name,
                    type: mapping.point.type
                }
            ])
    );

}


async function loadCache() {

    const [modules, points] = await Promise.all([
        airtablePointResolver.getModules(),
        airtablePointResolver.getPoints()
    ]);

    const canonicalPointInfo =
        await loadCanonicalPointInfo(modules, points);

    // Beperking: getModules()/getPoints() pagineren niet (zie airtablePointResolver.js).
    // Bij >100 records in één van beide tabellen worden records gemist. Nu bewust niet opgelost.

    moduleNameById = new Map(
        modules.map(record => [record.id, record.fields["Module naam"]])
    );

    pointById = new Map(
        points.map(record => [record.id, record])
    );

    canonicalPointInfoById = canonicalPointInfo;

}


function ensureLoaded() {

    if (!loadPromise) {
        loadPromise = loadCache();
    }

    return loadPromise;

}


async function getPointInfo(recordId) {

    if (!recordId) {
        throw new Error(
            "pointLookupCache.getPointInfo: recordId is verplicht."
        );
    }

    await ensureLoaded();

    const point = pointById.get(recordId);

    // Onbekend recordId: gecontroleerde null, geen Error — zelfde conventie als
    // airtablePointResolver's NO_MATCH (data niet gevonden, geen ongeldige aanroep).
    if (!point) {
        return null;
    }

    const moduleId = firstLinkedId(point.fields["Module"]);
    const canonicalPointInfo =
        canonicalPointInfoById.get(recordId);

    return {
        naam: point.fields["Beoordelingspunt"] || canonicalPointInfo?.naam,
        module: moduleId ? moduleNameById.get(moduleId) : undefined,
        type: resolveAssessmentType(
            canonicalPointInfo?.type,
            point.fields
        ),
        omschrijving: point.fields["Omschrijving"],
        toelichting: point.fields["Toelichting bij beoordelingspunt"]
    };

}


function reset() {

    loadPromise = null;
    moduleNameById = null;
    pointById = null;
    canonicalPointInfoById = null;

}


module.exports = {
    getPointInfo,
    resolveAssessmentType,
    reset
};
