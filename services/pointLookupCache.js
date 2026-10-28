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
let canonicalTypeByPointId = null;


function firstLinkedId(fieldValue) {

    if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
        return undefined;
    }

    const first = fieldValue[0];

    return typeof first === "string" ? first : first?.id;

}


async function loadCanonicalTypes() {

    const contentModule =
        await contentModuleLoader.load("toegang");

    const mappings =
        await airtableMapping.createMany(
            contentModule.points,
            pointMappings
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
                mapping.point.type
            ])
    );

}


async function loadCache() {

    const [modules, points, canonicalTypes] = await Promise.all([
        airtablePointResolver.getModules(),
        airtablePointResolver.getPoints(),
        loadCanonicalTypes()
    ]);

    // Beperking: getModules()/getPoints() pagineren niet (zie airtablePointResolver.js).
    // Bij >100 records in één van beide tabellen worden records gemist. Nu bewust niet opgelost.

    moduleNameById = new Map(
        modules.map(record => [record.id, record.fields["Module naam"]])
    );

    pointById = new Map(
        points.map(record => [record.id, record])
    );

    canonicalTypeByPointId = canonicalTypes;

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

    return {
        naam: point.fields["Beoordelingspunt"],
        module: moduleId ? moduleNameById.get(moduleId) : undefined,
        type:
            canonicalTypeByPointId.get(recordId) ??
            point.fields["Type"]
    };

}


function reset() {

    loadPromise = null;
    moduleNameById = null;
    pointById = null;
    canonicalTypeByPointId = null;

}


module.exports = {
    getPointInfo,
    reset
};
