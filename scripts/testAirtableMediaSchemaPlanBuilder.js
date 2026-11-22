const dotenv =
    require("dotenv");

dotenv.config = () => ({ parsed: {} });

process.env.AIRTABLE_BASE_ID = "appMediaSchemaTest";
process.env.AIRTABLE_TOKEN = "test-placeholder";

const assert =
    require("assert").strict;

const fs =
    require("fs");

const os =
    require("os");

const path =
    require("path");

const {
    buildCanonicalPlan
} =
    require("../services/productionMutationPlanCanonicalizer");

const {
    INTENT_TYPE,
    TARGET_TABLE_NAMES,
    createAirtableMediaSchemaPlanBuilder
} =
    require("../services/productionMutationPlanBuilders/airtableMediaSchemaPlanBuilder");

const {
    createProductionMutationPlanService,
    hashPlanToken
} =
    require("../services/productionMutationPlanService");

const {
    createSqlitePlanStore,
    createTemporaryTestPlanStore,
    createTemporaryTestPlanStorePathOptions,
    isTemporaryTestPlanStore,
    resolvePlanStorePath
} =
    require("../services/sqlitePlanStore");


const temporaryRoot =
    fs.mkdtempSync(path.join(os.tmpdir(), "rzd-media-schema-test-"));

const tableIds = {
    "Media": "tblMedia",
    "Media-versies": "tblMediaVersions",
    "WordPress-koppelingen": "tblWordPressLinks"
};

const EXPECTED_RIGHTS_FIELDS = [
    { name: "Rechtenstatus", type: "singleSelect" },
    { name: "Rechtenhouder", type: "singleLineText" },
    { name: "Rechtenvervaldatum", type: "date" }
];

const EXPECTED_RIGHTS_STATUS_CHOICES = [
    { name: "Onbekend", color: "grayLight2" },
    { name: "Controleren", color: "grayLight2" },
    { name: "Toegestaan", color: "grayLight2" },
    { name: "Beperkt", color: "grayLight2" },
    { name: "Verlopen", color: "grayLight2" }
];

const EXPECTED_LINK_FIELDS = [
    {
        table: "Media",
        field: "Media-versies",
        linkedTable: "Media-versies",
        inverseField: "Media",
        prefersSingleRecordLink: false
    },
    {
        table: "Media",
        field: "WordPress-koppelingen",
        linkedTable: "WordPress-koppelingen",
        inverseField: "Media",
        prefersSingleRecordLink: false
    },
    {
        table: "Media",
        field: "Originele versie",
        linkedTable: "Media-versies",
        inverseField: "Media als originele versie",
        prefersSingleRecordLink: true
    },
    {
        table: "Media",
        field: "Actieve versie",
        linkedTable: "Media-versies",
        inverseField: "Media als actieve versie",
        prefersSingleRecordLink: true
    },
    {
        table: "Media-versies",
        field: "Media",
        linkedTable: "Media",
        inverseField: "Media-versies",
        prefersSingleRecordLink: true
    },
    {
        table: "Media-versies",
        field: "WordPress-koppelingen",
        linkedTable: "WordPress-koppelingen",
        inverseField: "Media-versie",
        prefersSingleRecordLink: false
    },
    {
        table: "Media-versies",
        field: "Media als originele versie",
        linkedTable: "Media",
        inverseField: "Originele versie",
        prefersSingleRecordLink: true
    },
    {
        table: "Media-versies",
        field: "Media als actieve versie",
        linkedTable: "Media",
        inverseField: "Actieve versie",
        prefersSingleRecordLink: true
    },
    {
        table: "WordPress-koppelingen",
        field: "Media",
        linkedTable: "Media",
        inverseField: "WordPress-koppelingen",
        prefersSingleRecordLink: true
    },
    {
        table: "WordPress-koppelingen",
        field: "Media-versie",
        linkedTable: "Media-versies",
        inverseField: "WordPress-koppelingen",
        prefersSingleRecordLink: true
    }
];

const CURRENT_SCHEMA_FIXTURE = [
    {
        name: "Media",
        fields: [
            { name: "Media-ID", type: "singleLineText" },
            { name: "Bestandsnaam", type: "singleLineText" },
            { name: "Bestandstype", type: "singleLineText" },
            { name: "Titel", type: "singleLineText" },
            { name: "Omschrijving", type: "multilineText" },
            { name: "Alt-tekst", type: "multilineText" },
            { name: "Trefwoorden", type: "multipleSelects", options: { choices: [] } },
            { name: "RZD-categorie", type: "singleSelect", options: { choices: [] } },
            { name: "Fotograaf", type: "singleLineText" },
            { name: "Bron", type: "url" },
            { name: "Bronnotitie", type: "multilineText" },
            {
                name: "Rechtenstatus",
                type: "singleSelect",
                options: {
                    choices: [
                        { id: "selRightsUnknown", name: "Onbekend", color: "grayLight2" },
                        { id: "selRightsReview", name: "Controleren", color: "grayLight2" },
                        { id: "selRightsAllowed", name: "Toegestaan", color: "grayLight2" },
                        { id: "selRightsLimited", name: "Beperkt", color: "grayLight2" },
                        { id: "selRightsExpired", name: "Verlopen", color: "grayLight2" }
                    ]
                }
            },
            { name: "Gebruiksrechten", type: "multilineText" },
            { name: "Licentie", type: "singleLineText" },
            { name: "Rechtenhouder", type: "singleLineText" },
            { name: "Creditvermelding", type: "multilineText" },
            { name: "Beperkingen", type: "multilineText" },
            {
                name: "Rechtenvervaldatum",
                type: "date",
                options: {
                    dateFormat: { name: "european", format: "D/M/YYYY" }
                }
            },
            { name: "Media-status", type: "singleSelect", options: { choices: [] } },
            {
                name: "Media-versies",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "Media"
            },
            {
                name: "WordPress-koppelingen",
                type: "multipleRecordLinks",
                linkedTable: "WordPress-koppelingen",
                inverseField: "Media"
            },
            {
                name: "Originele versie",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "Media als originele versie"
            },
            {
                name: "Actieve versie",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "Media als actieve versie"
            }
        ]
    },
    {
        name: "Media-versies",
        fields: [
            { name: "Versie-ID", type: "singleLineText" },
            {
                name: "Media",
                type: "multipleRecordLinks",
                linkedTable: "Media",
                inverseField: "Media-versies"
            },
            { name: "Versietype", type: "singleSelect", options: { choices: [] } },
            { name: "Versienummer", type: "number", options: { precision: 0 } },
            { name: "Versienaam", type: "singleLineText" },
            { name: "Bestandsnaam", type: "singleLineText" },
            { name: "Bestandstype", type: "singleLineText" },
            { name: "Notitie", type: "multilineText" },
            { name: "Goedkeuringsstatus", type: "singleSelect", options: { choices: [] } },
            { name: "Goedgekeurd door", type: "singleCollaborator" },
            {
                name: "Datum goedkeuring",
                type: "date",
                options: {
                    dateFormat: { name: "european", format: "D/M/YYYY" }
                }
            },
            {
                name: "Aangemaakt op",
                type: "createdTime",
                options: {
                    result: {
                        type: "dateTime",
                        options: {
                            dateFormat: { name: "local", format: "l" },
                            timeFormat: { name: "12hour", format: "h:mma" },
                            timeZone: "client"
                        }
                    }
                }
            },
            {
                name: "WordPress-koppelingen",
                type: "multipleRecordLinks",
                linkedTable: "WordPress-koppelingen",
                inverseField: "Media-versie"
            },
            {
                name: "Media als originele versie",
                type: "multipleRecordLinks",
                linkedTable: "Media",
                inverseField: "Originele versie"
            },
            {
                name: "Media als actieve versie",
                type: "multipleRecordLinks",
                linkedTable: "Media",
                inverseField: "Actieve versie"
            }
        ]
    },
    {
        name: "WordPress-koppelingen",
        fields: [
            { name: "Koppeling-ID", type: "singleLineText" },
            {
                name: "Media",
                type: "multipleRecordLinks",
                linkedTable: "Media",
                inverseField: "WordPress-koppelingen"
            },
            {
                name: "Media-versie",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "WordPress-koppelingen"
            },
            { name: "WordPress-site-ID", type: "singleLineText" },
            { name: "WordPress-bijlage-ID", type: "number", options: { precision: 0 } },
            { name: "WordPress-URL", type: "url" },
            { name: "Synchronisatiestatus", type: "singleSelect", options: { choices: [] } },
            {
                name: "Laatste synchronisatie",
                type: "dateTime",
                options: {
                    dateFormat: { name: "european", format: "D/M/YYYY" },
                    timeFormat: { name: "24hour", format: "HH:mm" },
                    timeZone: "Europe/Amsterdam"
                }
            },
            { name: "Foutmelding", type: "multilineText" }
        ]
    }
];

const fieldIds = new Map();


function fieldId(tableName, fieldName) {

    const key =
        `${tableName}.${fieldName}`;

    if (!fieldIds.has(key)) {
        fieldIds.set(key, `fld${fieldIds.size + 1}`);
    }

    return fieldIds.get(key);

}


function makeTables() {

    const tables =
        CURRENT_SCHEMA_FIXTURE.map(table => ({
            id: tableIds[table.name],
            name: table.name,
            fields: table.fields.map(field => {

                const current = {
                    id: fieldId(table.name, field.name),
                    name: field.name,
                    type: field.type
                };

                if (field.linkedTable) {
                    current.options = {
                        linkedTableId: tableIds[field.linkedTable],
                        isReversed: false,
                        prefersSingleRecordLink: false,
                        inverseLinkFieldId: fieldId(
                            field.linkedTable,
                            field.inverseField
                        )
                    };
                } else if (field.options) {
                    current.options =
                        JSON.parse(JSON.stringify(field.options));
                }

                return current;

            })
        }));

    const preservedRelationships = [
        ["Accommodaties", "Accommodaties", "tblAccommodations", "fldAccommodationMedia"],
        ["Voorzieningen", "Voorzieningen", "tblFacilities", "fldFacilitiesMedia"],
        ["Beoordelingspunten", "Beoordelingspunten", "tblAssessmentPoints", "fldAssessmentMedia"],
        ["Accommodatie beoordelingen", "Accommodatie beoordelingen", "tblAccommodationReviews", "fldReviewsMedia"],
        ["Opmerkingen", "Opmerkingen", "tblComments", "fldCommentsMedia"],
        ["Reizigerservaringen", "Reizigerservaringen", "tblExperiences", "fldExperiencesMedia"]
    ];

    for (const [fieldName, tableName, linkedTableId, inverseFieldId] of preservedRelationships) {
        tables.find(table => table.name === "Media").fields.push({
            id: fieldId("Media", fieldName),
            name: fieldName,
            type: "multipleRecordLinks",
            options: {
                linkedTableId,
                isReversed: false,
                prefersSingleRecordLink: false,
                inverseLinkFieldId: inverseFieldId
            }
        });

        tables.push({
            id: linkedTableId,
            name: tableName,
            fields: [{
                id: inverseFieldId,
                name: "Media",
                type: "multipleRecordLinks",
                options: {
                    linkedTableId: tableIds.Media,
                    isReversed: true,
                    prefersSingleRecordLink: false,
                    inverseLinkFieldId: fieldId("Media", fieldName)
                }
            }]
        });
    }

    tables.push({
        id: "tblNotInScope",
        name: "Not in scope",
        fields: [{ id: "fldOther", name: "Not in scope", type: "singleLineText" }]
    });

    return tables;

}


function canonicalizeBuilt(built) {

    return buildCanonicalPlan({
        intent: built.intent,
        operations: built.operations,
        blocked: built.blocked,
        summary: built.summary
    });

}


function createTestStore() {

    return createTemporaryTestPlanStore();

}


function trackPlanStoreCalls(store) {

    const calls = {
        createPlan: 0,
        getPlan: 0,
        claimPlan: 0,
        startOperation: 0
    };

    for (const method of Object.keys(calls)) {

        const original =
            store[method].bind(store);

        store[method] = (...args) => {
            calls[method]++;
            return original(...args);
        };

    }

    return calls;

}


function createTestStoreWithTemporaryDirectory() {

    const originalMkdtempSync =
        fs.mkdtempSync;

    let temporaryDirectory;
    let store;

    fs.mkdtempSync = function captureTemporaryDirectory(...args) {
        temporaryDirectory =
            originalMkdtempSync.apply(fs, args);

        return temporaryDirectory;
    };

    try {
        store = createTemporaryTestPlanStore();
    } finally {
        fs.mkdtempSync = originalMkdtempSync;
    }

    return {
        store,
        temporaryDirectory
    };

}


function createTrustedContext({ confirmAllowed = true } = {}) {

    let verifyCalls = 0;

    return {
        get verifyCalls() {
            return verifyCalls;
        },
        async resolveActor(requestContext) {
            return requestContext?.sessionId === "test-preview"
                ? { id: "test-only-actor" }
                : null;
        },
        async authorize(actor, action) {
            return (
                actor?.id === "test-only-actor" &&
                (action !== "confirm" || confirmAllowed)
            );
        },
        async verifyConfirmation() {
            verifyCalls++;
            return true;
        }
    };

}


function expectCode(errorCode) {

    return error => error?.code === errorCode;

}


function testTemporaryStorePathResolution() {

    const cases = [
        {
            platform: "win32",
            temporaryDirectory: "C:\\temp\\rzd-preview-win"
        },
        {
            platform: "darwin",
            temporaryDirectory: "/tmp/rzd-preview-mac"
        },
        {
            platform: "linux",
            temporaryDirectory: "/tmp/rzd-preview-linux"
        }
    ];

    for (const testCase of cases) {

        const pathApi =
            testCase.platform === "win32"
                ? path.win32
                : path.posix;

        const pathOptions =
            createTemporaryTestPlanStorePathOptions(
                testCase.temporaryDirectory,
                testCase.platform
            );

        const databasePath =
            resolvePlanStorePath(pathOptions);

        const relativePath =
            pathApi.relative(
                testCase.temporaryDirectory,
                databasePath
            );

        assert.ok(pathApi.isAbsolute(databasePath));
        assert.ok(
            relativePath &&
            relativePath !== ".." &&
            !relativePath.startsWith(`..${pathApi.sep}`) &&
            !pathApi.isAbsolute(relativePath),
            `${testCase.platform} teststore moet binnen de OS-tempdirectory blijven`
        );
        assert.equal(pathOptions.home, testCase.temporaryDirectory);

        if (testCase.platform === "darwin") {
            assert.equal(pathOptions.env.XDG_DATA_HOME, undefined);
            assert.match(
                databasePath,
                /Library[\\/]Application Support[\\/]RZD Builder[\\/]planstore\.sqlite$/
            );
        } else if (testCase.platform === "win32") {
            assert.equal(
                pathOptions.env.LOCALAPPDATA,
                testCase.temporaryDirectory
            );
        } else {
            assert.equal(
                pathOptions.env.XDG_DATA_HOME,
                testCase.temporaryDirectory
            );
        }

    }

}


function testTemporaryStoreCleanup() {

    const {
        store,
        temporaryDirectory
    } =
        createTestStoreWithTemporaryDirectory();

    const now =
        new Date();

    const databasePath =
        path.join(
            temporaryDirectory,
            "RZD Builder",
            "planstore.sqlite"
        );

    store.createPlan({
        planIdHash: "a".repeat(64),
        fingerprint: "b".repeat(64),
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + 60_000).toISOString(),
        metadata: {},
        operations: [{
            operationId: "cleanup-test",
            system: "airtable",
            action: "create",
            target: { table: "test" },
            payloadHash: "c".repeat(64)
        }]
    });

    assert.ok(fs.existsSync(databasePath));

    const originalRmSync =
        fs.rmSync;

    let failCleanupOnce = true;

    fs.rmSync = function failFirstTemporaryCleanup(target, ...args) {

        if (target === temporaryDirectory && failCleanupOnce) {
            failCleanupOnce = false;
            throw new Error("forced temporary cleanup failure");
        }

        return originalRmSync.call(fs, target, ...args);

    };

    try {
        assert.throws(
            () => store.close(),
            /forced temporary cleanup failure/
        );
    } finally {
        fs.rmSync = originalRmSync;
    }

    assert.equal(isTemporaryTestPlanStore(store), true);

    store.close();

    assert.equal(isTemporaryTestPlanStore(store), false);
    assert.equal(fs.existsSync(databasePath), false);
    assert.equal(fs.existsSync(`${databasePath}-wal`), false);
    assert.equal(fs.existsSync(`${databasePath}-shm`), false);
    assert.equal(fs.existsSync(temporaryDirectory), false);

}


async function runTests() {

    testTemporaryStorePathResolution();
    testTemporaryStoreCleanup();

    const state = {
        tables: makeTables(),
        getTablesCalls: 0,
        writeCalls: 0,
        recordReads: 0
    };

    const sources = {
        getTables() {
            state.getTablesCalls++;
            return state.tables;
        },
        createTable() {
            state.writeCalls++;
            throw new Error("Write routes must not be used by a preview.");
        },
        createField() {
            state.writeCalls++;
            throw new Error("Write routes must not be used by a preview.");
        },
        updateField() {
            state.writeCalls++;
            throw new Error("Write routes must not be used by a preview.");
        },
        listRecords() {
            state.recordReads++;
            throw new Error("Record data must not be read by a schema preview.");
        }
    };

    const builder =
        createAirtableMediaSchemaPlanBuilder({ sources });

    const builderWithoutPreviewOnly = {
        normalizeIntent: builder.normalizeIntent,
        async build(intent) {
            const built =
                await builder.build(intent);

            return {
                intent: built.intent,
                operations: built.operations,
                blocked: built.blocked,
                summary: built.summary
            };
        }
    };

    const intent = { type: INTENT_TYPE };
    let defaultStoreFactoryCalls = 0;

    assert.equal(builderWithoutPreviewOnly.previewOnly, undefined);
    assert.throws(
        () => createProductionMutationPlanService({
            createPlanStore() {
                defaultStoreFactoryCalls++;
                throw new Error("Default PlanStore must not be opened.");
            },
            planBuilder: builderWithoutPreviewOnly,
            trustedContext: createTrustedContext()
        }),
        expectCode("PREVIEW_TEST_STORE_REQUIRED"),
        "schema-intenties zonder previewOnly-vlag mogen de default store niet openen"
    );
    assert.equal(defaultStoreFactoryCalls, 0);

    const downgradeStore =
        createTestStore();
    const downgradeStoreCalls =
        trackPlanStoreCalls(downgradeStore);
    let downgradeFactoryCalls = 0;

    const downgradeBuilder = {
        normalizeIntent(candidate) {
            if (candidate?.type === INTENT_TYPE) {
                return {
                    type: "airtable-review",
                    voorzieningId: "recTestProvision"
                };
            }

            return builder.normalizeIntent(candidate);
        },
        async build(candidate) {
            return {
                intent: candidate,
                operations: [],
                blocked: [],
                summary: {}
            };
        }
    };

    const downgradeService =
        createProductionMutationPlanService({
            planStore: downgradeStore,
            createPlanStore() {
                downgradeFactoryCalls++;
                throw new Error("Production PlanStore must not be opened.");
            },
            planBuilder: downgradeBuilder,
            trustedContext: createTrustedContext()
        });

    try {
        await assert.rejects(
            downgradeService.createPlan(
                intent,
                { sessionId: "test-preview" }
            ),
            expectCode("SCHEMA_INTENT_TYPE_CHANGED"),
            "een builder mag een schema-intent niet naar een review-intent downgraden"
        );
        assert.equal(downgradeFactoryCalls, 0);
        assert.deepEqual(
            downgradeStoreCalls,
            {
                createPlan: 0,
                getPlan: 0,
                claimPlan: 0,
                startOperation: 0
            },
            "een gedowngrade schema-intent mag geen storemethode aanroepen"
        );
    } finally {
        downgradeService.close();
    }

    for (const action of ["create", "update"]) {

        const operationStore =
            createTestStore();
        const operationStoreCalls =
            trackPlanStoreCalls(operationStore);
        let operationFactoryCalls = 0;

        const operationBuilder = {
            normalizeIntent: builder.normalizeIntent,
            async build(candidate) {
                return {
                    intent: candidate,
                    operations: [{
                        system: "airtable",
                        action,
                        target: {
                            tableId: "tblReviews",
                            recordId: action === "update" ? "recReview" : null
                        },
                        payload: {
                            "Beoordeling naam": "Test"
                        }
                    }],
                    blocked: [],
                    summary: {}
                };
            }
        };

        const operationService =
            createProductionMutationPlanService({
                planStore: operationStore,
                createPlanStore() {
                    operationFactoryCalls++;
                    throw new Error("Production PlanStore must not be opened.");
                },
                planBuilder: operationBuilder,
                trustedContext: createTrustedContext()
            });

        try {
            await assert.rejects(
                operationService.createPlan(
                    intent,
                    { sessionId: "test-preview" }
                ),
                expectCode("UNSUPPORTED_OPERATION"),
                `schema-intents mogen geen ${action.toUpperCase()}-operaties teruggeven`
            );
            assert.equal(operationFactoryCalls, 0);
            assert.deepEqual(
                operationStoreCalls,
                {
                    createPlan: 0,
                    getPlan: 0,
                    claimPlan: 0,
                    startOperation: 0
                },
                "schema-recordmutaties mogen niet worden opgeslagen, geclaimd of gestart"
            );

            await assert.rejects(
                operationService.confirmAndAuthorize(
                    "A".repeat(43),
                    { receipt: "test-only" },
                    { sessionId: "test-preview" }
                ),
                expectCode("PLAN_NOT_FOUND"),
                "zonder opgeslagen schema-recordmutatie kan geen permit worden verkregen"
            );
            assert.equal(operationStoreCalls.claimPlan, 0);
            assert.equal(operationStoreCalls.startOperation, 0);
            assert.throws(
                () => operationService.recordOperationStart({}, "unissued-operation"),
                expectCode("INVALID_PERMIT"),
                "zonder permit kan geen schema-recordoperatie worden uitgevoerd"
            );
        } finally {
            operationService.close();
        }

    }

    const unmarkedStore =
        createSqlitePlanStore({
            pathOptions: createTemporaryTestPlanStorePathOptions(
                path.join(temporaryRoot, "ordinary-store"),
                process.platform
            )
        });

    assert.equal(isTemporaryTestPlanStore(unmarkedStore), false);
    assert.throws(
        () => createProductionMutationPlanService({
            planStore: unmarkedStore,
            planBuilder: builderWithoutPreviewOnly,
            trustedContext: createTrustedContext()
        }),
        expectCode("PREVIEW_TEST_STORE_REQUIRED"),
        "een gewone SQLite PlanStore wordt ook bij expliciete injectie geweigerd"
    );
    assert.equal(
        unmarkedStore.getPlan("0".repeat(64)),
        null,
        "de geweigerde store blijft onaangeroerd en open"
    );
    unmarkedStore.close();

    const initial =
        await builder.build(intent);

    const currentMedia =
        initial.summary.currentSchema.find(table => table.name === "Media");
    const desiredMedia =
        initial.summary.desiredSchema.find(table => table.name === "Media");
    const currentRightsFields =
        EXPECTED_RIGHTS_FIELDS.map(expected => {
            const field =
                currentMedia.fields.find(candidate => candidate.name === expected.name);

            return {
                name: field?.name,
                type: field?.type
            };
        });
    const desiredRightsFields =
        EXPECTED_RIGHTS_FIELDS.map(expected => {
            const field =
                desiredMedia.fields.find(candidate => candidate.name === expected.name);

            return {
                name: field?.name,
                type: field?.type
            };
        });

    assert.deepEqual(currentRightsFields, EXPECTED_RIGHTS_FIELDS);
    assert.deepEqual(desiredRightsFields, EXPECTED_RIGHTS_FIELDS);

    const currentLinkConfigurations =
        EXPECTED_LINK_FIELDS.map(expected => {
            const table =
                initial.summary.currentSchema.find(candidate =>
                    candidate.name === expected.table
                );
            const field =
                table.fields.find(candidate => candidate.name === expected.field);

            return {
                table: expected.table,
                field: expected.field,
                linkedTableId: field.options.linkedTableId,
                inverseLinkFieldId: field.options.inverseLinkFieldId,
                prefersSingleRecordLink: field.options.prefersSingleRecordLink
            };
        });
    const desiredLinkConfigurations =
        EXPECTED_LINK_FIELDS.map(expected => {
            const table =
                initial.summary.desiredSchema.find(candidate =>
                    candidate.name === expected.table
                );
            const field =
                table.fields.find(candidate => candidate.name === expected.field);

            return {
                table: expected.table,
                field: expected.field,
                linkedTable: field.options.linkedTableName,
                inverseField: field.options.inverseFieldName,
                prefersSingleRecordLink: field.options.prefersSingleRecordLink
            };
        });

    assert.deepEqual(
        currentLinkConfigurations,
        EXPECTED_LINK_FIELDS.map(expected => ({
            table: expected.table,
            field: expected.field,
            linkedTableId: tableIds[expected.linkedTable],
            inverseLinkFieldId: fieldId(
                expected.linkedTable,
                expected.inverseField
            ),
            prefersSingleRecordLink: false
        })),
        "de fixture legt alle actuele linkdoelen, inverse velden en cardinaliteit onafhankelijk vast"
    );
    assert.deepEqual(
        desiredLinkConfigurations,
        EXPECTED_LINK_FIELDS,
        "de verwachte linkdoelen, inverse velden en cardinaliteit zijn expliciet"
    );

    const currentRightsStatus =
        currentMedia.fields.find(field => field.name === "Rechtenstatus");
    const currentRightsExpiry =
        currentMedia.fields.find(field => field.name === "Rechtenvervaldatum");

    assert.deepEqual(
        currentRightsStatus.options.choices.map(({ name, color }) => ({ name, color })),
        EXPECTED_RIGHTS_STATUS_CHOICES,
        "de bestaande rechtenstatus-keuzes worden onafhankelijk vastgelegd"
    );
    assert.deepEqual(
        currentRightsExpiry.options.dateFormat,
        { name: "european", format: "D/M/YYYY" },
        "de bestaande datumweergave wordt behouden"
    );
    assert.ok(
        EXPECTED_RIGHTS_FIELDS.every(expected =>
            desiredMedia.fields.find(field => field.name === expected.name)
                .preserveUnspecifiedOptions === true
        ),
        "niet-gespecificeerde rechtenveldopties blijven behouden"
    );
    assert.ok(
        !initial.summary.differences.some(difference =>
            EXPECTED_RIGHTS_FIELDS.some(expected => difference.field === expected.name)
        ),
        "rechtenvelden die overeenkomen met de geverifieerde structuur leveren geen verschil op"
    );

    assert.deepEqual(initial.summary.targetTables, TARGET_TABLE_NAMES);
    assert.deepEqual(
        initial.summary.currentSchema.map(table => table.name),
        TARGET_TABLE_NAMES,
        "de analyse beperkt de schema-output tot de drie opgegeven tabellen"
    );
    const preservedLinkNames = [
        "Accommodaties",
        "Voorzieningen",
        "Beoordelingspunten",
        "Accommodatie beoordelingen",
        "Opmerkingen",
        "Reizigerservaringen"
    ];
    const desiredPreservedLinks = desiredMedia.fields.filter(field =>
        preservedLinkNames.includes(field.name)
    );
    assert.equal(desiredPreservedLinks.length, 6);
    assert.ok(desiredPreservedLinks.every(field =>
        field.preserveOnly === true &&
        field.options.prefersSingleRecordLink === false
    ), "de zes bestaande RZD-relaties zijn expliciet validation-only en blijven meervoudig");
    assert.ok(!initial.operations.some(operation =>
        preservedLinkNames.includes(operation.target.fieldName)
    ), "validation-only RZD-relaties genereren nooit schema-mutatieoperaties");
    assert.ok(!initial.summary.differences.some(difference =>
        preservedLinkNames.includes(difference.field)
    ), "correcte RZD-relaties leveren geen afwijkingen op");

    assert.equal(initial.operations.length, 7);
    assert.deepEqual(
        initial.operations.map(operation =>
            `${operation.target.tableName}.${operation.target.fieldName}`
        ),
        EXPECTED_LINK_FIELDS
            .filter(field => field.prefersSingleRecordLink)
            .map(field => `${field.table}.${field.field}`),
        "alle zeven verwachte single-links worden als multiple-linkafwijking gemeld"
    );
    assert.ok(
        initial.summary.differences
            .filter(difference =>
                difference.differences.some(item =>
                    item.property === "options.prefersSingleRecordLink"
                )
            )
            .every(difference =>
                difference.differences.some(item =>
                    item.property === "options.prefersSingleRecordLink" &&
                    item.current === false &&
                    item.desired === true
                )
            ),
        "een onverwachte multiple-link wordt als cardinaliteitsafwijking gemeld"
    );
    assert.ok(
        initial.operations.every(operation =>
            operation.system === "airtable-schema" &&
            operation.action === "schema-change"
        ),
        "schema-intenties hebben een eigen operatiegrens"
    );
    assert.ok(
        initial.blocked.some(item =>
            item.code === "SCHEMA_EXECUTION_UNAVAILABLE"
        ),
        "schemawijzigingen zijn expliciet geblokkeerd"
    );
    assert.ok(
        initial.summary.missingInformation.some(item =>
            item.field === "Trefwoorden" &&
            item.code === "CHOICE_TAXONOMY_UNDEFINED"
        )
    );
    assert.ok(
        initial.summary.missingInformation.some(item =>
            item.field === "RZD-categorie" &&
            item.code === "CHOICE_TAXONOMY_UNDEFINED"
        )
    );
    assert.ok(
        initial.blocked.some(item =>
            item.field === "Trefwoorden" &&
            item.code === "CHOICE_TAXONOMY_UNDEFINED"
        ),
        "keuzelijsten zonder taxonomiebron zijn als geblokkeerde actie zichtbaar"
    );
    assert.ok(
        !initial.operations.some(operation =>
            ["Trefwoorden", "RZD-categorie"].includes(operation.target.fieldName)
        ),
        "zonder bewezen taxonomie worden geen keuzelijstwaarden voorgesteld"
    );
    assert.ok(
        initial.summary.currentSchema[0].fields.some(field =>
            field.name === "Accommodaties"
        ),
        "niet-doelvelden en hun huidige configuratie blijven zichtbaar"
    );
    assert.equal(initial.summary.desiredSchema.length, 3);
    assert.equal(initial.summary.operationalOrder.length, 7);
    assert.equal(initial.summary.previewOnly, true);

    assert.throws(
        () => builder.normalizeIntent({
            type: INTENT_TYPE,
            token: "must-not-enter-plan"
        }),
        /Ongeldige media-schema-intent/
    );

    const reversedTables =
        state.tables.map(table => ({
            ...table,
            fields: [...table.fields].reverse()
        })).reverse();

    const reorderedBuilder =
        createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => reversedTables }
        });

    const reordered =
        await reorderedBuilder.build(intent);

    assert.equal(
        canonicalizeBuilt(initial).fingerprint,
        canonicalizeBuilt(reordered).fingerprint,
        "schema- en veldvolgorde veranderen de canonical fingerprint niet"
    );

    const missingFieldTables =
        makeTables();
    missingFieldTables
        .find(table => table.name === "Media")
        .fields = missingFieldTables
            .find(table => table.name === "Media")
            .fields.filter(field => field.name !== "Bestandsnaam");

    const missingFieldResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => missingFieldTables }
        }).build(intent);

    assert.ok(
        missingFieldResult.summary.differences.some(difference =>
            difference.field === "Bestandsnaam" &&
            difference.current === null
        ),
        "ontbrekende velden worden herkend met huidige en gewenste configuratie"
    );

    const missingLinkTables =
        makeTables();
    const versionsTable =
        missingLinkTables.find(table => table.name === "Media-versies");
    versionsTable.fields =
        versionsTable.fields.filter(field => field.name !== "Media");

    const missingLinkResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => missingLinkTables }
        }).build(intent);

    assert.ok(
        missingLinkResult.summary.differences.some(difference =>
            difference.table === "Media-versies" &&
            difference.field === "Media" &&
            difference.current === null
        ),
        "een ontbrekend verwacht linkveld wordt als schema-afwijking gemeld"
    );

    const wrongTypeTables =
        makeTables();
    wrongTypeTables
        .find(table => table.name === "Media")
        .fields.find(field => field.name === "Media-ID").type = "number";

    const wrongTypeResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => wrongTypeTables }
        }).build(intent);

    assert.ok(
        wrongTypeResult.summary.differences.some(difference =>
            difference.field === "Media-ID" &&
            difference.differences.some(item =>
                item.property === "type" &&
                item.current === "number" &&
                item.desired === "singleLineText"
            )
        ),
        "afwijkende veldtypen worden herkend"
    );

    const wrongLinkTables =
        makeTables();
    wrongLinkTables
        .find(table => table.name === "Media")
        .fields.find(field => field.name === "Media-versies")
        .options.linkedTableId = tableIds["WordPress-koppelingen"];

    const wrongLinkResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => wrongLinkTables }
        }).build(intent);

    assert.ok(
        wrongLinkResult.summary.differences.some(difference =>
            difference.table === "Media" &&
            difference.field === "Media-versies" &&
            difference.differences.some(item =>
                item.property === "options.linkedTableId"
            )
        ),
        "een verkeerde doeltabel wordt als schema-afwijking gemeld"
    );

    const wrongInverseTables =
        makeTables();
    wrongInverseTables
        .find(table => table.name === "Media")
        .fields.find(field => field.name === "Media-versies")
        .options.inverseLinkFieldId =
            fieldId("Media-versies", "Media als originele versie");

    const wrongInverseResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => wrongInverseTables }
        }).build(intent);

    assert.ok(
        wrongInverseResult.summary.differences.some(difference =>
            difference.table === "Media" &&
            difference.field === "Media-versies" &&
            difference.differences.some(item =>
                item.property === "options.inverseLinkFieldId"
            )
        ),
        "een verkeerde inverse relatie wordt als schema-afwijking gemeld"
    );

    const unexpectedSingleTables =
        makeTables();
    unexpectedSingleTables
        .find(table => table.name === "Media")
        .fields.find(field => field.name === "Media-versies")
        .options.prefersSingleRecordLink = true;

    const unexpectedSingleResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => unexpectedSingleTables }
        }).build(intent);

    assert.ok(
        unexpectedSingleResult.summary.differences.some(difference =>
            difference.table === "Media" &&
            difference.field === "Media-versies" &&
            difference.differences.some(item =>
                item.property === "options.prefersSingleRecordLink" &&
                item.current === true &&
                item.desired === false
            )
        ),
        "een onverwachte single-link wordt vergeleken met de multiple-linkverwachting"
    );

    const unexpectedMultipleTables =
        makeTables();
    unexpectedMultipleTables
        .find(table => table.name === "Media")
        .fields.find(field => field.name === "Originele versie")
        .options.prefersSingleRecordLink = false;

    const unexpectedMultipleResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: { getTables: () => unexpectedMultipleTables }
        }).build(intent);

    assert.ok(
        unexpectedMultipleResult.summary.differences.some(difference =>
            difference.table === "Media" &&
            difference.field === "Originele versie" &&
            difference.differences.some(item =>
                item.property === "options.prefersSingleRecordLink" &&
                item.current === false &&
                item.desired === true
            )
        ),
        "een onverwachte multiple-link wordt vergeleken met de single-linkverwachting"
    );

    const missingTableResult =
        await createAirtableMediaSchemaPlanBuilder({
            sources: {
                getTables: () => makeTables().filter(table =>
                    table.name !== "Media-versies"
                )
            }
        }).build(intent);

    assert.ok(
        missingTableResult.blocked.some(item =>
            item.code === "TARGET_TABLE_MISSING" &&
            item.table === "Media-versies"
        ),
        "een ontbrekende doeltabel wordt geblokkeerd in plaats van aangemaakt"
    );

    const store =
        createTestStore();
    const trustedContext =
        createTrustedContext();
    const service =
        createProductionMutationPlanService({
            planStore: store,
            planBuilder: builderWithoutPreviewOnly,
            trustedContext
        });

    try {

        assert.equal(
            isTemporaryTestPlanStore(store),
            true,
            "de tijdelijke storefactory levert een herkenbare teststore-identiteit"
        );

        const preview =
            await service.createPlan(intent, { sessionId: "test-preview" });

        assert.equal(preview.previewOnly, true);
        assert.equal(preview.status, "preview-only");
        assert.equal(preview.planStoreStatus, "ready");
        assert.equal(preview.canonicalizationVersion, 1);
        assert.match(preview.fingerprint, /^[a-f0-9]{64}$/);

        const storedPlan =
            store.getPlan(hashPlanToken(preview.planId));

        assert.equal(storedPlan.status, "ready");
        assert.ok(
            storedPlan.operations.every(operation =>
                operation.system === "airtable-schema" &&
                operation.action === "schema-change"
            )
        );

        await assert.rejects(
            service.confirmAndAuthorize(
                preview.planId,
                { receipt: "test-only" },
                { sessionId: "test-preview" }
            ),
            expectCode("SCHEMA_EXECUTION_UNAVAILABLE")
        );

        assert.equal(
            store.getPlan(hashPlanToken(preview.planId)).status,
            "ready",
            "schema-preview kan geen PlanStore-claim of permit krijgen"
        );
        assert.equal(trustedContext.verifyCalls, 0);

        const refreshed =
            await service.getPlanPreview(
                preview.planId,
                { sessionId: "test-preview" }
            );

        assert.equal(refreshed.status, "preview-only");
        assert.equal(refreshed.planStoreStatus, "ready");

        state.tables
            .find(table => table.name === "Media")
            .fields.find(field => field.name === "Trefwoorden")
            .options.choices.push({
                id: "test-choice",
                name: "Test-only choice"
            });

        await assert.rejects(
            service.getPlanPreview(
                preview.planId,
                { sessionId: "test-preview" }
            ),
            expectCode("PLAN_DIVERGED")
        );

        const deniedStore =
            createTestStore();
        const deniedContext =
            createTrustedContext({ confirmAllowed: false });
        const deniedService =
            createProductionMutationPlanService({
                planStore: deniedStore,
                planBuilder: builder,
                trustedContext: deniedContext
            });

        try {

            const deniedPreview =
                await deniedService.createPlan(
                    intent,
                    { sessionId: "test-preview" }
                );

            await assert.rejects(
                deniedService.confirmAndAuthorize(
                    deniedPreview.planId,
                    { receipt: "test-only" },
                    { sessionId: "test-preview" }
                ),
                expectCode("NOT_AUTHORIZED")
            );

            assert.equal(
                deniedStore.getPlan(hashPlanToken(deniedPreview.planId)).status,
                "ready"
            );

        } finally {

            deniedService.close();

        }

    } finally {

        service.close();

    }

    assert.equal(
        isTemporaryTestPlanStore(store),
        false,
        "gesloten teststores verliezen hun preview-identiteit"
    );

    assert.ok(state.getTablesCalls > 0);
    assert.equal(state.writeCalls, 0);
    assert.equal(state.recordReads, 0);

    console.log("Alle Airtable Media-schema-planbuilder-tests geslaagd.");

}


runTests().catch(error => {
    console.error(error);
    process.exitCode = 1;
}).finally(() => {
    fs.rmSync(temporaryRoot, {
        recursive: true,
        force: true
    });
});

// CI trigger: execute the media schema validation suite on the updated workflow.
