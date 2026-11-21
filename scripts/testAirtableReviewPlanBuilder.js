const assert =
    require("assert").strict;

const {
    DEFAULT_REVIEW_STATUS,
    planReviewUpsertFromRecords,
    validateMappedReviewInput
} =
    require("../services/reviewPlanBuilderSupport");

const {
    TABLE_NAMES,
    createAirtableReviewPlanBuilder
} =
    require("../services/productionMutationPlanBuilders/airtableReviewPlanBuilder");


const ENTITY_ID =
    "recProvision1";

const ACCOMMODATION_ID =
    "recAccommodation1";

const POINT_ID =
    "recPoint1";

const LOCAL_POINT_ID =
    "local-point-1";


function reviewRecord(id, entityId = ENTITY_ID) {

    return {
        id,
        fields: {
            "Voorziening": [entityId],
            "Beoordelingspunt": [POINT_ID],
            "Status": "Beoordeeld"
        }
    };

}


function makeSources({
    reviewRecords = [],
    mobileReview = {
        localId: "mobile-review-1",
        accommodationId: ACCOMMODATION_ID,
        pointId: POINT_ID,
        typeBeoordeling: "Meting",
        value: 42.5,
        syncStatus: "pending"
    },
    mapping = null
} = {}) {

    const tables = [
        {
            id: "tblReviews",
            name: TABLE_NAMES.reviews,
            fields: [
                { id: "fldEntity", name: "Voorziening" },
                { id: "fldAccommodation", name: "Accommodatie" },
                { id: "fldPoint", name: "Beoordelingspunt" },
                { id: "fldName", name: "Beoordeling naam" },
                { id: "fldStatus", name: "Status" },
                { id: "fldValue", name: "Waarde / Resultaat" }
            ]
        },
        {
            id: "tblPoints",
            name: TABLE_NAMES.points,
            fields: [{ id: "fldPointName", name: "Beoordelingspunt" }]
        },
        {
            id: "tblModules",
            name: TABLE_NAMES.modules,
            fields: [{ id: "fldModuleName", name: "Module naam" }]
        },
        {
            id: "tblAccommodations",
            name: TABLE_NAMES.accommodations,
            fields: [{ id: "fldAccommodationName", name: "Naam" }]
        },
        {
            id: "tblProvisions",
            name: TABLE_NAMES.provisions,
            fields: [{ id: "fldProvisionName", name: "Naam" }]
        }
    ];

    const pointRecord = {
        id: POINT_ID,
        fields: {
            "Beoordelingspunt": "Doorhoogte",
            Module: ["recModule1"]
        }
    };

    const moduleRecord = {
        id: "recModule1",
        fields: { "Module naam": "toegang" }
    };

    const recordsByTable = {
        [TABLE_NAMES.reviews]: reviewRecords,
        [TABLE_NAMES.modules]: [moduleRecord],
        [TABLE_NAMES.points]: [pointRecord]
    };

    const entityRecords = {
        [`${TABLE_NAMES.provisions}:${ENTITY_ID}`]: {
            id: ENTITY_ID,
            fields: { Naam: "Voorziening" }
        },
        [`${TABLE_NAMES.accommodations}:${ACCOMMODATION_ID}`]: {
            id: ACCOMMODATION_ID,
            fields: { Naam: "Accommodatie" }
        },
        [`${TABLE_NAMES.points}:${POINT_ID}`]: pointRecord
    };

    const exactMapping = mapping || {
        status: "EXACT",
        point: {
            table: TABLE_NAMES.points,
            recordId: POINT_ID,
            name: "Doorhoogte"
        },
        review: {
            table: TABLE_NAMES.reviews,
            links: {
                voorziening: "Voorziening",
                point: "Beoordelingspunt"
            }
        }
    };

    return {
        getBaseId: () => "appReviewPlanTest",
        getTables: () => tables,
        listRecords: tableName => {
            if (!Object.prototype.hasOwnProperty.call(recordsByTable, tableName)) {
                throw new Error(`Unexpected table read: ${tableName}`);
            }
            return recordsByTable[tableName];
        },
        getRecord: (tableName, recordId) =>
            entityRecords[`${tableName}:${recordId}`] || null,
        loadContentModule: () => ({
            points: [{ id: LOCAL_POINT_ID, name: "Doorhoogte" }]
        }),
        getPointMappings: () => ({
            [LOCAL_POINT_ID]: { airtable: { module: "toegang" } }
        }),
        createMapping: () => exactMapping,
        getMobileReview: localId =>
            localId === mobileReview.localId ? mobileReview : null
    };

}


function createBuilder(options = {}) {

    return createAirtableReviewPlanBuilder({
        sources: makeSources(options)
    });

}


function testMappedInputValidation() {

    const mapping = {
        point: { recordId: POINT_ID, name: "Doorhoogte" },
        review: {
            table: TABLE_NAMES.reviews,
            links: {
                voorziening: "Voorziening",
                point: "Beoordelingspunt"
            }
        }
    };

    const fields = {
        "Beoordeling naam": "Doorhoogte",
        "Voorziening": [ENTITY_ID],
        "Beoordelingspunt": [POINT_ID],
        "Status": DEFAULT_REVIEW_STATUS
    };

    assert.deepEqual(
        validateMappedReviewInput({
            mapping,
            voorzieningId: ENTITY_ID,
            pointId: POINT_ID,
            fields
        }),
        []
    );

    const errors =
        validateMappedReviewInput({
            mapping,
            voorzieningId: ENTITY_ID,
            pointId: "recOtherPoint",
            fields
        });

    assert.ok(errors.some(error =>
        error.includes("pointId moet gelijk zijn")
    ));

}


function testUpsertPlanning() {

    const fields = {
        "Beoordeling naam": "Doorhoogte",
        "Status": DEFAULT_REVIEW_STATUS
    };

    const create =
        planReviewUpsertFromRecords({
            records: [],
            voorzieningId: ENTITY_ID,
            pointId: POINT_ID,
            fields
        });

    assert.equal(create.action, "CREATE");
    assert.equal(create.matches, 0);
    assert.deepEqual(create.plannedFields, fields);

    const existing =
        reviewRecord("recReview1");

    const update =
        planReviewUpsertFromRecords({
            records: [existing],
            voorzieningId: ENTITY_ID,
            pointId: POINT_ID,
            fields,
            fieldsOnUpdate: {
                ...fields,
                "Status": undefined,
                "Opmerking": ""
            }
        });

    assert.equal(update.action, "UPDATE");
    assert.equal(update.recordId, "recReview1");
    assert.deepEqual(update.plannedFields, {
        "Beoordeling naam": "Doorhoogte"
    });

    const multiple =
        planReviewUpsertFromRecords({
            records: [
                existing,
                reviewRecord("recReview2")
            ],
            voorzieningId: ENTITY_ID,
            pointId: POINT_ID,
            fields
        });

    assert.equal(multiple.action, "BLOCKED_MULTIPLE_MATCHES");

    const diverged =
        planReviewUpsertFromRecords({
            records: [existing],
            voorzieningId: ENTITY_ID,
            pointId: POINT_ID,
            fields,
            expectedAction: "CREATE",
            expectedMatchIds: []
        });

    assert.equal(diverged.action, "BLOCKED_PLAN_DIVERGENCE");
    assert.equal(diverged.observedAction, "UPDATE");
    assert.deepEqual(diverged.observedMatchIds, ["recReview1"]);

}


async function testReviewBuilder() {

    const createBuilderResult =
        await createBuilder().build({
            type: "airtable-review",
            voorzieningId: ENTITY_ID,
            pointIds: [LOCAL_POINT_ID]
        });

    assert.equal(createBuilderResult.operations.length, 1);
    assert.equal(createBuilderResult.operations[0].action, "create");
    assert.equal(
        createBuilderResult.operations[0].payload.Status,
        DEFAULT_REVIEW_STATUS
    );

    const updateBuilderResult =
        await createBuilder({
            reviewRecords: [reviewRecord("recReview1")]
        }).build({
            type: "airtable-review",
            voorzieningId: ENTITY_ID,
            pointIds: [LOCAL_POINT_ID]
        });

    assert.equal(updateBuilderResult.operations.length, 1);
    assert.equal(updateBuilderResult.operations[0].action, "update");
    assert.equal(
        updateBuilderResult.operations[0].target.recordId,
        "recReview1"
    );
    assert.equal(
        Object.prototype.hasOwnProperty.call(
            updateBuilderResult.operations[0].payload,
            "Status"
        ),
        false
    );

    const multipleBuilderResult =
        await createBuilder({
            reviewRecords: [
                reviewRecord("recReview1"),
                reviewRecord("recReview2")
            ]
        }).build({
            type: "airtable-review",
            voorzieningId: ENTITY_ID,
            pointIds: [LOCAL_POINT_ID]
        });

    assert.equal(multipleBuilderResult.operations.length, 0);
    assert.ok(multipleBuilderResult.blocked.some(item =>
        item.reason === "MULTIPLE_REVIEW_TARGETS"
    ));

}


async function testMobileBuilder() {

    const pendingResult =
        await createBuilder().build({
            type: "mobile-review",
            localReviewIds: ["mobile-review-1"]
        });

    assert.equal(pendingResult.operations.length, 1);
    assert.equal(pendingResult.operations[0].action, "create");
    assert.equal(
        pendingResult.operations[0].payload["Waarde / Resultaat"],
        "42.5"
    );

    const nonPendingBuilder =
        createBuilder({
            mobileReview: {
                localId: "mobile-review-1",
                accommodationId: ACCOMMODATION_ID,
                pointId: POINT_ID,
                typeBeoordeling: "Meting",
                value: 42.5,
                syncStatus: "error"
            }
        });

    await assert.rejects(
        nonPendingBuilder.build({
            type: "mobile-review",
            localReviewIds: ["mobile-review-1"]
        }),
        /niet pending/
    );

}


async function runTests() {

    testMappedInputValidation();
    testUpsertPlanning();
    await testReviewBuilder();
    await testMobileBuilder();

    console.log("Alle Airtable Review-planbuilder-tests geslaagd.");

}


runTests().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
