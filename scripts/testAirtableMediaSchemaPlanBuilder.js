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
    EXPECTED_SCHEMA,
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

    const byName =
        new Map();

    const tables =
        EXPECTED_SCHEMA.map(table => {

            const result = {
                id: tableIds[table.name],
                name: table.name,
                fields: []
            };

            byName.set(table.name, result);
            return result;

        });

    for (const tableSchema of EXPECTED_SCHEMA) {

        const table =
            byName.get(tableSchema.name);

        table.fields =
            tableSchema.fields.map(expected => {

                const current = {
                    id: fieldId(tableSchema.name, expected.name),
                    name: expected.name,
                    type: expected.type
                };

                if (expected.linkedTable) {

                    current.options = {
                        linkedTableId: tableIds[expected.linkedTable],
                        isReversed: false,
                        prefersSingleRecordLink: false,
                        inverseLinkFieldId: fieldId(
                            expected.linkedTable,
                            expected.inverseField
                        )
                    };

                } else if (
                    expected.name === "Trefwoorden" ||
                    expected.name === "RZD-categorie"
                ) {

                    current.options = { choices: [] };

                } else if (expected.type === "number") {

                    current.options = { precision: 0 };

                } else if (expected.type === "date") {

                    current.options = {
                        dateFormat: {
                            name: "european",
                            format: "D/M/YYYY"
                        }
                    };

                } else if (expected.type === "createdTime") {

                    current.options = {
                        result: {
                            type: "dateTime",
                            options: {
                                dateFormat: { name: "local", format: "l" },
                                timeFormat: { name: "12hour", format: "h:mma" },
                                timeZone: "client"
                            }
                        }
                    };

                } else if (expected.type === "dateTime") {

                    current.options = {
                        dateFormat: {
                            name: "european",
                            format: "D/M/YYYY"
                        },
                        timeFormat: {
                            name: "24hour",
                            format: "HH:mm"
                        },
                        timeZone: "Europe/Amsterdam"
                    };

                } else if (expected.type === "singleSelect") {

                    current.options = { choices: [] };

                }

                return current;

            });

    }

    byName.get("Media").fields.push({
        id: fieldId("Media", "Accommodaties"),
        name: "Accommodaties",
        type: "multipleRecordLinks",
        options: {
            linkedTableId: "tblAccommodations",
            isReversed: false,
            prefersSingleRecordLink: false,
            inverseLinkFieldId: "fldAccommodationMedia"
        }
    });

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

    assert.deepEqual(initial.summary.targetTables, TARGET_TABLE_NAMES);
    assert.deepEqual(
        initial.summary.currentSchema.map(table => table.name),
        TARGET_TABLE_NAMES,
        "de analyse beperkt de schema-output tot de drie opgegeven tabellen"
    );
    assert.equal(initial.operations.length, 2);
    assert.deepEqual(
        initial.operations.map(operation => operation.target.fieldName),
        ["Originele versie", "Actieve versie"],
        "alleen de twee aangetroffen enkelvoudige-versielinks wijken af"
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
    assert.equal(initial.summary.operationalOrder.length, 2);
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
            difference.field === "Media-versies" &&
            difference.differences.some(item =>
                item.property === "options.linkedTableId"
            )
        ),
        "afwijkende doel- en inverse-relatieconfiguraties worden vergeleken"
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
