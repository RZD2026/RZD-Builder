const airtableAdapter =
    require("../airtableAdapter");

const schemaComparisonEngine =
    require("../../content/schema/schemaComparisonEngine");


const INTENT_TYPE =
    "airtable-media-schema";

const TARGET_TABLE_NAMES = Object.freeze([
    "Media",
    "Media-versies",
    "WordPress-koppelingen"
]);

const EXPECTED_SCHEMA = Object.freeze([
    {
        name: "Media",
        fields: [
            { name: "Media-ID", type: "singleLineText" },
            { name: "Bestandsnaam", type: "singleLineText" },
            { name: "Bestandstype", type: "singleLineText" },
            { name: "Titel", type: "singleLineText" },
            { name: "Omschrijving", type: "multilineText" },
            { name: "Alt-tekst", type: "multilineText" },
            { name: "Trefwoorden", type: "multipleSelects", unresolved: ["options.choices"] },
            { name: "RZD-categorie", type: "singleSelect", unresolved: ["options.choices"] },
            { name: "Fotograaf", type: "singleLineText" },
            { name: "Bron", type: "url" },
            { name: "Bronnotitie", type: "multilineText" },
            { name: "Rechtenstatus", type: "singleSelect" },
            { name: "Gebruiksrechten", type: "multilineText" },
            { name: "Licentie", type: "singleLineText" },
            { name: "Rechtenhouder", type: "singleLineText" },
            { name: "Creditvermelding", type: "multilineText" },
            { name: "Beperkingen", type: "multilineText" },
            { name: "Rechtenvervaldatum", type: "date" },
            { name: "Media-status", type: "singleSelect" },
            {
                name: "Media-versies",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "Media",
                prefersSingleRecordLink: false
            },
            {
                name: "WordPress-koppelingen",
                type: "multipleRecordLinks",
                linkedTable: "WordPress-koppelingen",
                inverseField: "Media",
                prefersSingleRecordLink: false
            },
            {
                name: "Originele versie",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "Media als originele versie",
                prefersSingleRecordLink: true
            },
            {
                name: "Actieve versie",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "Media als actieve versie",
                prefersSingleRecordLink: true
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
                inverseField: "Media-versies",
                prefersSingleRecordLink: true
            },
            { name: "Versietype", type: "singleSelect" },
            { name: "Versienummer", type: "number" },
            { name: "Versienaam", type: "singleLineText" },
            { name: "Bestandsnaam", type: "singleLineText" },
            { name: "Bestandstype", type: "singleLineText" },
            { name: "Notitie", type: "multilineText" },
            { name: "Goedkeuringsstatus", type: "singleSelect" },
            { name: "Goedgekeurd door", type: "singleCollaborator" },
            { name: "Datum goedkeuring", type: "date" },
            { name: "Aangemaakt op", type: "createdTime" },
            {
                name: "WordPress-koppelingen",
                type: "multipleRecordLinks",
                linkedTable: "WordPress-koppelingen",
                inverseField: "Media-versie",
                prefersSingleRecordLink: false
            },
            {
                name: "Media als originele versie",
                type: "multipleRecordLinks",
                linkedTable: "Media",
                inverseField: "Originele versie",
                prefersSingleRecordLink: true
            },
            {
                name: "Media als actieve versie",
                type: "multipleRecordLinks",
                linkedTable: "Media",
                inverseField: "Actieve versie",
                prefersSingleRecordLink: true
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
                inverseField: "WordPress-koppelingen",
                prefersSingleRecordLink: true
            },
            {
                name: "Media-versie",
                type: "multipleRecordLinks",
                linkedTable: "Media-versies",
                inverseField: "WordPress-koppelingen",
                prefersSingleRecordLink: true
            },
            { name: "WordPress-site-ID", type: "singleLineText" },
            { name: "WordPress-bijlage-ID", type: "number" },
            { name: "WordPress-URL", type: "url" },
            { name: "Synchronisatiestatus", type: "singleSelect" },
            { name: "Laatste synchronisatie", type: "dateTime" },
            { name: "Foutmelding", type: "multilineText" }
        ]
    }
]);

const EXPECTED_TABLE_BY_NAME =
    new Map(EXPECTED_SCHEMA.map(table => [table.name, table]));

const CHOICE_FIELDS = Object.freeze([
    { table: "Media", field: "Trefwoorden" },
    { table: "Media", field: "RZD-categorie" }
]);


function isPlainObject(value) {

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    const prototype =
        Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;

}


function cloneJson(value) {

    return JSON.parse(JSON.stringify(value));

}


function normalizeIntent(intent) {

    if (
        !isPlainObject(intent) ||
        intent.type !== INTENT_TYPE ||
        Reflect.ownKeys(intent).some(key => key !== "type")
    ) {
        throw new TypeError("Ongeldige media-schema-intent.");
    }

    return { type: INTENT_TYPE };

}


function projectField(field) {

    if (
        !isPlainObject(field) ||
        typeof field.name !== "string" ||
        typeof field.type !== "string"
    ) {
        throw new TypeError("Airtable-schema bevat een ongeldig veld.");
    }

    const result = {
        id: typeof field.id === "string" ? field.id : null,
        name: field.name,
        type: field.type
    };

    if (typeof field.description === "string") {
        result.description = field.description;
    }

    if (Object.prototype.hasOwnProperty.call(field, "options")) {
        result.options =
            field.options === null
                ? null
                : cloneJson(field.options);
    }

    return result;

}


function projectTargetTables(tables) {

    if (!Array.isArray(tables)) {
        throw new TypeError("Airtable gaf geen geldige tabelmetadata terug.");
    }

    const projected = [];

    for (const name of TARGET_TABLE_NAMES) {

        const matches =
            tables.filter(table => table?.name === name);

        if (matches.length > 1) {
            throw new Error(`Airtable bevat meerdere tabellen met naam '${name}'.`);
        }

        if (matches.length === 0) {
            continue;
        }

        const table = matches[0];

        if (!Array.isArray(table.fields)) {
            throw new TypeError(`Tabel '${name}' bevat geen geldige veldenlijst.`);
        }

        const current = {
            id: typeof table.id === "string" ? table.id : null,
            name,
            fields: table.fields
                .map(projectField)
                .sort((left, right) =>
                    left.name.localeCompare(right.name)
                )
        };

        if (typeof table.primaryFieldId === "string") {
            current.primaryFieldId = table.primaryFieldId;
        }

        projected.push(current);

    }

    return projected;

}


function normalizeCurrentField(field, tablesById) {

    if (!field) {
        return null;
    }

    const result = {
        id: field.id,
        name: field.name,
        type: field.type
    };

    if (field.description !== undefined) {
        result.description = field.description;
    }

    if (field.options !== undefined) {

        result.options =
            field.options === null
                ? null
                : cloneJson(field.options);

        if (isPlainObject(result.options)) {

            const linkedTable =
                tablesById.get(result.options.linkedTableId);

            if (linkedTable) {
                result.options.linkedTableName = linkedTable.name;
            }

            const inverseField =
                linkedTable?.fields.find(candidate =>
                    candidate.id === result.options.inverseLinkFieldId
                );

            if (inverseField) {
                result.options.inverseFieldName = inverseField.name;
            }

        }

    }

    return result;

}


function desiredConfiguration(field) {

    const desired = {
        name: field.name,
        type: field.type,
        preserveUnspecifiedOptions: true
    };

    if (field.linkedTable) {
        desired.options = {
            linkedTableName: field.linkedTable,
            inverseFieldName: field.inverseField,
            preserveOtherOptions: true
        };
    }

    if (field.prefersSingleRecordLink !== undefined) {
        desired.options.prefersSingleRecordLink =
            field.prefersSingleRecordLink;
    }

    if (field.unresolved) {
        desired.unresolvedConfiguration = [...field.unresolved];
    }

    return desired;

}


function compareLinkConfiguration({
    field,
    actual,
    currentTablesByName
}) {

    if (!field.linkedTable || !actual) {
        return [];
    }

    const targetTable =
        currentTablesByName.get(field.linkedTable);

    const inverseTable =
        targetTable;

    const inverseMatches =
        inverseTable?.fields.filter(candidate =>
            candidate.name === field.inverseField
        ) || [];

    if (
        !targetTable ||
        !targetTable.id ||
        inverseMatches.length !== 1 ||
        !inverseMatches[0].id
    ) {
        return [{
            property: "options.linkedTableId",
            current: actual.options?.linkedTableId || null,
            desired: {
                linkedTableName: field.linkedTable,
                inverseFieldName: field.inverseField
            },
            blockedReason: "LINK_TARGET_UNRESOLVED"
        }];
    }

    if (actual.type !== "multipleRecordLinks" || !isPlainObject(actual.options)) {
        return [{
            property: "options",
            current: actual.options ?? null,
            desired: desiredConfiguration(field).options,
            blockedReason: "LINK_CONFIGURATION_UNRESOLVED"
        }];
    }

    const differences = [];
    const checks = [
        [
            "linkedTableId",
            actual.options.linkedTableId,
            targetTable.id,
            { linkedTableName: field.linkedTable }
        ],
        [
            "inverseLinkFieldId",
            actual.options.inverseLinkFieldId,
            inverseMatches[0].id,
            { inverseFieldName: field.inverseField }
        ],
        [
            "isReversed",
            actual.options.isReversed,
            false,
            false
        ]
    ];

    checks.push([
        "prefersSingleRecordLink",
        actual.options.prefersSingleRecordLink,
        field.prefersSingleRecordLink,
        field.prefersSingleRecordLink
    ]);

    for (const [property, current, expected, desired] of checks) {

        if (current !== expected) {
            differences.push({
                property: `options.${property}`,
                current: current ?? null,
                desired
            });
        }

    }

    return differences;

}


function createAirtableMediaSchemaPlanBuilder({
    sources = {
        getTables: () => airtableAdapter.getTables()
    }
} = {}) {

    if (typeof sources?.getTables !== "function") {
        throw new TypeError("Media-schema-planbuilder vereist een getTables read-port.");
    }

    async function build(intent) {

        const normalizedIntent =
            normalizeIntent(intent);

        const sourceTables =
            await sources.getTables();

        const currentSchema =
            projectTargetTables(sourceTables);

        const currentTablesByName =
            new Map(currentSchema.map(table => [table.name, table]));

        const currentTablesById =
            new Map(currentSchema
                .filter(table => table.id)
                .map(table => [table.id, table]));

        const comparisons =
            schemaComparisonEngine.compare(
                {
                    tables: EXPECTED_SCHEMA.filter(table =>
                        currentTablesByName.has(table.name)
                    )
                },
                currentSchema
            );

        const differences = [];
        const operations = [];
        const blockedActions = [];
        const missingInformation = [];

        for (const tableName of TARGET_TABLE_NAMES) {

            const currentTable =
                currentTablesByName.get(tableName);

            if (!currentTable) {
                blockedActions.push({
                    status: "blocked",
                    code: "TARGET_TABLE_MISSING",
                    table: tableName,
                    reason: "De tabel ontbreekt; tabelaanmaak valt buiten deze analyse."
                });
                missingInformation.push({
                    code: "TARGET_TABLE_MISSING",
                    table: tableName,
                    question: "Is dit de juiste Airtable-base en moet deze tabel bestaan?"
                });
            }

        }

        for (const tableComparison of comparisons) {

            const expectedTable =
                EXPECTED_TABLE_BY_NAME.get(tableComparison.table);

            const currentTable =
                currentTablesByName.get(tableComparison.table);

            const baseDifferences =
                new Map((tableComparison.differences || []).map(difference => [
                    difference.field.name,
                    difference
                ]));

            for (const expectedField of expectedTable.fields) {

                const baseDifference =
                    baseDifferences.get(expectedField.name);

                const currentField =
                    currentTable.fields.find(field =>
                        field.name === expectedField.name
                    ) || null;

                const linkDifferences =
                    compareLinkConfiguration({
                        field: expectedField,
                        actual: currentField,
                        currentTablesByName
                    });

                const fieldDifferences = [];

                if (!currentField) {
                    fieldDifferences.push({
                        property: "field",
                        current: null,
                        desired: desiredConfiguration(expectedField)
                    });
                } else if (baseDifference?.action === "update") {
                    fieldDifferences.push(
                        ...baseDifference.differences.map(item => ({
                            property: item.property,
                            current: item.actual ?? null,
                            desired: item.desired
                        }))
                    );
                }

                fieldDifferences.push(...linkDifferences);

                if (fieldDifferences.length === 0) {
                    continue;
                }

                const currentConfiguration =
                    normalizeCurrentField(currentField, currentTablesById);

                const wantedConfiguration =
                    desiredConfiguration(expectedField);

                const difference = {
                    table: tableComparison.table,
                    field: expectedField.name,
                    current: currentConfiguration,
                    desired: wantedConfiguration,
                    differences: fieldDifferences
                };

                differences.push(difference);

                const operation = {
                    system: "airtable-schema",
                    action: "schema-change",
                    target: {
                        tableName: tableComparison.table,
                        tableId: currentTable.id,
                        fieldName: expectedField.name,
                        fieldId: currentField?.id || null
                    },
                    payload: {
                        kind: currentField ? "reconcile-field" : "add-field",
                        current: currentConfiguration,
                        desired: wantedConfiguration,
                        differences: fieldDifferences
                    }
                };

                operations.push(operation);
                blockedActions.push({
                    status: "blocked",
                    code: "SCHEMA_EXECUTION_UNAVAILABLE",
                    table: tableComparison.table,
                    field: expectedField.name,
                    action: "schema-change",
                    reason: "Deze preview heeft geen schema-uitvoeringsroute of productieautorisatie."
                });

            }

        }

        for (const { table: tableName, field: fieldName } of CHOICE_FIELDS) {

            const table =
                currentTablesByName.get(tableName);
            const field =
                table?.fields.find(candidate =>
                    candidate.name === fieldName
                );

            if (!field) {
                missingInformation.push({
                    code: "CHOICE_FIELD_MISSING",
                    table: tableName,
                    field: fieldName,
                    question: "Welke bestaande RZD-taxonomiebron bepaalt de keuzelijst?"
                });
                continue;
            }

            const choices =
                field.options?.choices;

            if (!Array.isArray(choices) || choices.length === 0) {
                missingInformation.push({
                    code: "CHOICE_TAXONOMY_UNDEFINED",
                    table: tableName,
                    field: fieldName,
                    currentChoices: Array.isArray(choices) ? choices : null,
                    question: "Welke bestaande RZD-taxonomiebron levert de waarden?"
                });
                blockedActions.push({
                    status: "blocked",
                    code: "CHOICE_TAXONOMY_UNDEFINED",
                    table: tableName,
                    field: fieldName,
                    action: "set-choice-values",
                    reason: "Er is geen onderbouwde taxonomiebron om waarden voor te definiëren."
                });
            }

        }

        missingInformation.push(
            {
                code: "ID_VALUES_NOT_ANALYZED",
                fields: ["Media.Media-ID", "Media-versies.Versie-ID"],
                question: "Recordwaarden zijn niet gelezen; bestaand ID-formaat kan daarom niet worden gevalideerd."
            },
            {
                code: "LOCAL_UUID_STORAGE_UNDEFINED",
                question: "De opslagplaats voor interne lokale UUID's is niet als Airtable-veld gespecificeerd."
            },
            {
                code: "LINKAGE_ID_FORMAT_UNDEFINED",
                fields: ["WordPress-koppelingen.Koppeling-ID"],
                question: "Voor Koppeling-ID is geen RZD-ID-formaat opgegeven."
            }
        );

        const proposedActions =
            operations.map((operation, sequence) => ({
                sequence,
                action: operation.action,
                table: operation.target.tableName,
                field: operation.target.fieldName,
                current: operation.payload.current,
                desired: operation.payload.desired
            }));

        const operationalOrder =
            operations.map((operation, sequence) => ({
                sequence,
                table: operation.target.tableName,
                field: operation.target.fieldName,
                action: operation.action
            }));

        const summary = {
            intent: INTENT_TYPE,
            previewOnly: true,
            canonicalizationVersion: require("../productionMutationPlanCanonicalizer")
                .CANONICALIZATION_VERSION,
            targetTables: [...TARGET_TABLE_NAMES],
            currentSchema,
            desiredSchema: EXPECTED_SCHEMA.map(table => ({
                name: table.name,
                fields: table.fields.map(desiredConfiguration)
            })),
            differences,
            proposedActions,
            blockedActions,
            missingInformation,
            risks: [
                "Schemaoperaties hebben geen uitvoeringsroute en kunnen niet worden bevestigd.",
                "Veldtypewijzigingen en recordlinks kunnen bestaande gegevens beïnvloeden.",
                "Er zijn geen records, ID-waarden of bijlagen gelezen."
            ],
            operationalOrder
        };

        return {
            intent: normalizedIntent,
            operations,
            blocked: blockedActions,
            summary,
            previewOnly: true
        };

    }

    return Object.freeze({
        previewOnly: true,
        normalizeIntent,
        build
    });

}


module.exports = {
    EXPECTED_SCHEMA,
    INTENT_TYPE,
    TARGET_TABLE_NAMES,
    createAirtableMediaSchemaPlanBuilder
};
