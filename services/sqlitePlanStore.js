const fs =
    require("fs");

const os =
    require("os");

const path =
    require("path");

const Database =
    require("better-sqlite3");

const { assertPlanStore } =
    require("./planStoreContract");


const TEMPORARY_TEST_PLAN_STORES =
    new WeakSet();

const MAX_PLAN_TTL_MS =
    15 * 60 * 1000;

const HASH_PATTERN =
    /^[a-f0-9]{64}$/;

const PLAN_TERMINAL_STATUSES =
    new Set([
        "completed",
        "failed",
        "partial",
        "interrupted"
    ]);


class PlanStoreError extends Error {

    constructor(code, message, cause) {

        if (cause) {
            super(message, { cause });
        } else {
            super(message);
        }

        this.name = "PlanStoreError";
        this.code = code;

    }

}


function pathApiFor(platform) {

    return platform === "win32"
        ? path.win32
        : path.posix;

}


function isUncPath(filePath, platform) {

    return platform === "win32" &&
        /^(?:\\\\|\/\/)/.test(filePath);

}


function isWithinDirectory(filePath, directoryPath, pathApi) {

    const relativePath =
        pathApi.relative(directoryPath, filePath);

    return relativePath === "" ||
        (
            relativePath !== ".." &&
            !relativePath.startsWith(`..${pathApi.sep}`) &&
            !pathApi.isAbsolute(relativePath)
        );

}


function resolvePlanStorePath({
    env = process.env,
    platform = process.platform,
    home = os.homedir()
} = {}) {

    const pathApi =
        pathApiFor(platform);

    let dataDirectory;

    if (platform === "win32") {

        const localAppData =
            env.LOCALAPPDATA;

        if (
            !localAppData ||
            !pathApi.isAbsolute(localAppData) ||
            isUncPath(localAppData, platform)
        ) {
            throw new PlanStoreError(
                "INVALID_DATABASE_PATH",
                "LOCALAPPDATA moet een absoluut lokaal pad zijn."
            );
        }

        dataDirectory =
            pathApi.join(
                localAppData,
                "RZD Builder"
            );

    } else if (platform === "darwin") {

        dataDirectory =
            pathApi.join(
                home,
                "Library",
                "Application Support",
                "RZD Builder"
            );

    } else {

        const dataHome =
            env.XDG_DATA_HOME ||
            pathApi.join(home, ".local", "share");

        if (!pathApi.isAbsolute(dataHome)) {
            throw new PlanStoreError(
                "INVALID_DATABASE_PATH",
                "XDG_DATA_HOME moet een absoluut pad zijn."
            );
        }

        dataDirectory =
            pathApi.join(
                dataHome,
                "RZD Builder"
            );

    }

    const configuredPath =
        env.RZD_PLANSTORE_PATH ||
        pathApi.join(dataDirectory, "planstore.sqlite");

    if (
        !pathApi.isAbsolute(configuredPath) ||
        isUncPath(configuredPath, platform)
    ) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "RZD_PLANSTORE_PATH moet een absoluut lokaal pad zijn."
        );
    }

    const resolvedPath =
        pathApi.resolve(configuredPath);

    const resolvedDataDirectory =
        pathApi.resolve(dataDirectory);

    if (!isWithinDirectory(resolvedPath, resolvedDataDirectory, pathApi)) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "RZD_PLANSTORE_PATH moet binnen de lokale app-data-directory staan."
        );
    }

    const repositoryRoot =
        pathApi.resolve(__dirname, "..");

    if (isWithinDirectory(resolvedPath, repositoryRoot, pathApi)) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "De PlanStore-database mag niet in de repository staan."
        );
    }

    return resolvedPath;

}


function requiredString(value, fieldName, maxLength = 500) {

    if (
        typeof value !== "string" ||
        !value.trim() ||
        value.length > maxLength
    ) {
        throw new PlanStoreError(
            "INVALID_INPUT",
            `${fieldName} moet een niet-lege string zijn.`
        );
    }

    return value;

}


function requiredHash(value, fieldName) {

    if (
        typeof value !== "string" ||
        !HASH_PATTERN.test(value)
    ) {
        throw new PlanStoreError(
            "INVALID_INPUT",
            `${fieldName} moet een SHA-256-hexwaarde zijn.`
        );
    }

    return value;

}


function isoTimestamp(value, fieldName) {

    if (typeof value !== "string") {
        throw new PlanStoreError(
            "INVALID_INPUT",
            `${fieldName} moet een ISO-tijdstempel zijn.`
        );
    }

    const timestamp =
        Date.parse(value);

    if (
        !Number.isFinite(timestamp) ||
        new Date(timestamp).toISOString() !== value
    ) {
        throw new PlanStoreError(
            "INVALID_INPUT",
            `${fieldName} moet een canonieke ISO-tijdstempel zijn.`
        );
    }

    return timestamp;

}


function serializeJson(value, fieldName, defaultValue) {

    const valueToSerialize =
        value === undefined
            ? defaultValue
            : value;

    try {

        const serialized =
            JSON.stringify(valueToSerialize);

        if (serialized === undefined) {
            throw new TypeError("JSON-waarde ontbreekt.");
        }

        return serialized;

    } catch (error) {

        throw new PlanStoreError(
            "INVALID_INPUT",
            `${fieldName} moet JSON-serialiseerbaar zijn.`,
            error
        );

    }

}


function parseJson(value, fieldName) {

    try {
        return JSON.parse(value);
    } catch (error) {
        throw new PlanStoreError(
            "CORRUPT_DATA",
            `Ongeldige JSON opgeslagen voor ${fieldName}.`,
            error
        );
    }

}


function validateOperation(operation, index) {

    if (!operation || typeof operation !== "object") {
        throw new PlanStoreError(
            "INVALID_INPUT",
            `plan.operations[${index}] moet een object zijn.`
        );
    }

    if (operation.target === undefined) {
        throw new PlanStoreError(
            "INVALID_INPUT",
            `plan.operations[${index}].target ontbreekt.`
        );
    }

    return {
        operationId: requiredString(
            operation.operationId,
            `plan.operations[${index}].operationId`,
            200
        ),
        system: requiredString(
            operation.system,
            `plan.operations[${index}].system`,
            100
        ),
        action: requiredString(
            operation.action,
            `plan.operations[${index}].action`,
            100
        ),
        targetJson: serializeJson(
            operation.target,
            `plan.operations[${index}].target`
        ),
        payloadHash: requiredHash(
            operation.payloadHash,
            `plan.operations[${index}].payloadHash`
        )
    };

}


function ensureDatabaseDirectory(databasePath) {

    const directoryPath =
        path.dirname(databasePath);

    fs.mkdirSync(directoryPath, {
        recursive: true,
        mode: 0o700
    });

    const directoryStat =
        fs.statSync(directoryPath);

    if (!directoryStat.isDirectory()) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "De PlanStore-parentmap is geen directory."
        );
    }

    const realDirectory =
        fs.realpathSync(directoryPath);

    if (isUncPath(realDirectory, process.platform)) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "De PlanStore mag niet op een netwerkshare staan."
        );
    }

    fs.accessSync(
        directoryPath,
        fs.constants.R_OK | fs.constants.W_OK
    );

    if (process.platform !== "win32") {
        fs.chmodSync(directoryPath, 0o700);
    }

    try {

        const databaseStat =
            fs.lstatSync(databasePath);

        if (databaseStat.isSymbolicLink() || !databaseStat.isFile()) {
            throw new PlanStoreError(
                "INVALID_DATABASE_PATH",
                "De PlanStore-database moet een regulier bestand zijn."
            );
        }

    } catch (error) {

        if (error.code !== "ENOENT") {
            throw error;
        }

    }

}


function readMigrations() {

    const migrationDirectory =
        path.join(__dirname, "planStoreMigrations");

    return fs.readdirSync(migrationDirectory)
        .map(fileName => {

            const match =
                /^(\d+)_.*\.sql$/.exec(fileName);

            if (!match) {
                return null;
            }

            return {
                version: Number(match[1]),
                filePath: path.join(migrationDirectory, fileName)
            };

        })
        .filter(Boolean)
        .sort((left, right) => left.version - right.version);

}


function runMigrations(database) {

    const migrations =
        readMigrations();

    if (migrations.length === 0) {
        throw new PlanStoreError(
            "MIGRATION_MISSING",
            "Er zijn geen PlanStore-schema-migraties beschikbaar."
        );
    }

    const currentVersion =
        database.pragma("user_version", { simple: true });

    if (
        !Number.isInteger(currentVersion) ||
        currentVersion < 0 ||
        currentVersion > migrations.at(-1)?.version
    ) {
        throw new PlanStoreError(
            "UNSUPPORTED_SCHEMA_VERSION",
            "De PlanStore-schema is ongeldig of nieuwer dan deze applicatie."
        );
    }

    for (const migration of migrations) {

        database.transaction(() => {

                const appliedVersion =
                    database.pragma("user_version", { simple: true });

                if (appliedVersion >= migration.version) {
                    return;
                }

                if (appliedVersion !== migration.version - 1) {
                    throw new PlanStoreError(
                        "MIGRATION_GAP",
                        "De PlanStore-migraties zijn niet opeenvolgend."
                    );
                }

                const sql =
                    fs.readFileSync(migration.filePath, "utf8");

                database.exec(sql);
                database.pragma(`user_version = ${migration.version}`);

            }).immediate();

    }

}


function planFromRow(row, operationRows) {

    if (!row) {
        return null;
    }

    return {
        planIdHash: row.plan_id_hash,
        fingerprint: row.fingerprint,
        status: row.status,
        createdAt: row.created_at,
        expiresAt: row.expires_at,
        confirmedAt: row.confirmed_at,
        confirmedBy: row.confirmed_by,
        claimedAt: row.claimed_at,
        claimedBy: row.claimed_by,
        startedAt: row.started_at,
        finishedAt: row.finished_at,
        errorCode: row.error_code,
        metadata: parseJson(row.metadata_json, "plan.metadata"),
        operations: operationRows.map(operation => ({
            sequence: operation.sequence,
            operationId: operation.operation_id,
            system: operation.system,
            action: operation.action,
            target: parseJson(operation.target_json, "operation.target"),
            payloadHash: operation.payload_hash,
            status: operation.status,
            startedAt: operation.started_at,
            finishedAt: operation.finished_at,
            externalReference: operation.external_reference,
            errorCode: operation.error_code
        }))
    };

}


function createSqlitePlanStore(options = {}) {

    const databasePath =
        resolvePlanStorePath(options.pathOptions);

    if (
        typeof databasePath !== "string" ||
        !path.isAbsolute(databasePath) ||
        isUncPath(databasePath, process.platform)
    ) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "Het PlanStore-databasepad moet absoluut en lokaal zijn."
        );
    }

    ensureDatabaseDirectory(databasePath);

    let database;

    try {

        database =
            new Database(databasePath, { timeout: 5000 });

        database.pragma("busy_timeout = 5000");
        database.pragma("foreign_keys = ON");

        if (database.pragma("foreign_keys", { simple: true }) !== 1) {
            throw new PlanStoreError(
                "DATABASE_CONFIGURATION_FAILED",
                "SQLite foreign-key-controles konden niet worden ingeschakeld."
            );
        }

        const journalMode =
            database.pragma("journal_mode = WAL", { simple: true });

        if (String(journalMode).toLowerCase() !== "wal") {
            throw new PlanStoreError(
                "DATABASE_CONFIGURATION_FAILED",
                "SQLite WAL-modus kon niet worden ingeschakeld."
            );
        }

        database.pragma("synchronous = FULL");
        runMigrations(database);

        if (process.platform !== "win32") {
            fs.chmodSync(databasePath, 0o600);
        }

    } catch (error) {

        if (database?.open) {
            try {
                database.close();
            } catch (closeError) {
                throw new AggregateError(
                    [error, closeError],
                    "PlanStore-initialisatie en database-afsluiting zijn mislukt."
                );
            }
        }

        throw error;

    }

    let closed = false;

    function ensureOpen() {

        if (closed || !database.open) {
            throw new PlanStoreError(
                "STORE_CLOSED",
                "De PlanStore is gesloten."
            );
        }

    }


    function getPlanRow(planIdHash) {

        return database.prepare(
            "SELECT * FROM plans WHERE plan_id_hash = ?"
        ).get(planIdHash);

    }


    function getOperationRows(planIdHash) {

        return database.prepare(
            `SELECT *
             FROM plan_operations
             WHERE plan_id_hash = ?
             ORDER BY sequence`
        ).all(planIdHash);

    }


    function getPlan(planIdHash) {

        ensureOpen();
        requiredHash(planIdHash, "planIdHash");

        return planFromRow(
            getPlanRow(planIdHash),
            getOperationRows(planIdHash)
        );

    }


    function createPlan(plan) {

        ensureOpen();

        if (!plan || typeof plan !== "object") {
            throw new PlanStoreError(
                "INVALID_INPUT",
                "Plan moet een object zijn."
            );
        }

        const planIdHash =
            requiredHash(plan.planIdHash, "plan.planIdHash");

        const fingerprint =
            requiredHash(plan.fingerprint, "plan.fingerprint");

        const createdAtMs =
            isoTimestamp(plan.createdAt, "plan.createdAt");

        const expiresAtMs =
            isoTimestamp(plan.expiresAt, "plan.expiresAt");

        if (
            expiresAtMs <= createdAtMs ||
            expiresAtMs - createdAtMs > MAX_PLAN_TTL_MS
        ) {
            throw new PlanStoreError(
                "INVALID_EXPIRY",
                "Een Plan-ID moet na aanmaak binnen maximaal 15 minuten verlopen."
            );
        }

        if (
            !Array.isArray(plan.operations) ||
            plan.operations.length === 0
        ) {
            throw new PlanStoreError(
                "INVALID_INPUT",
                "Een Plan-ID moet minimaal één planoperatie bevatten."
            );
        }

        const metadataJson =
            serializeJson(plan.metadata, "plan.metadata", {});

        const operations =
            plan.operations.map(validateOperation);

        const insertPlan =
            database.prepare(
                `INSERT INTO plans (
                    plan_id_hash,
                    fingerprint,
                    status,
                    created_at,
                    expires_at,
                    metadata_json
                ) VALUES (?, ?, 'ready', ?, ?, ?)`
            );

        const insertOperation =
            database.prepare(
                `INSERT INTO plan_operations (
                    plan_id_hash,
                    sequence,
                    operation_id,
                    system,
                    action,
                    target_json,
                    payload_hash,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
            );

        database.transaction(() => {

            insertPlan.run(
                planIdHash,
                fingerprint,
                plan.createdAt,
                plan.expiresAt,
                metadataJson
            );

            operations.forEach((operation, sequence) => {
                insertOperation.run(
                    planIdHash,
                    sequence,
                    operation.operationId,
                    operation.system,
                    operation.action,
                    operation.targetJson,
                    operation.payloadHash
                );
            });

        }).immediate();

        return getPlan(planIdHash);

    }


    function claimPlan({
        planIdHash,
        fingerprint,
        now,
        confirmedBy,
        claimedBy
    }) {

        ensureOpen();

        requiredHash(planIdHash, "planIdHash");
        requiredHash(fingerprint, "fingerprint");
        isoTimestamp(now, "now");
        requiredString(confirmedBy, "confirmedBy", 200);
        requiredString(claimedBy, "claimedBy", 200);

        const outcome =
            database.transaction(() => {

                const plan =
                    getPlanRow(planIdHash);

                if (!plan) {
                    return { errorCode: "PLAN_NOT_FOUND" };
                }

                if (plan.fingerprint !== fingerprint) {
                    return { errorCode: "PLAN_MISMATCH" };
                }

                if (plan.status !== "ready") {
                    return { errorCode: "PLAN_NOT_CLAIMABLE" };
                }

                if (Date.parse(plan.expires_at) <= Date.parse(now)) {

                    database.prepare(
                        `UPDATE plans
                         SET status = 'expired',
                             finished_at = ?
                         WHERE plan_id_hash = ?
                           AND status = 'ready'`
                    ).run(now, planIdHash);

                    return { errorCode: "PLAN_EXPIRED" };

                }

                const activePlan =
                    database.prepare(
                        "SELECT 1 FROM plans WHERE status = 'executing' LIMIT 1"
                    ).get();

                if (activePlan) {
                    return { errorCode: "ACTIVE_PLAN_EXISTS" };
                }

                const result =
                    database.prepare(
                        `UPDATE plans
                         SET status = 'executing',
                             confirmed_at = ?,
                             confirmed_by = ?,
                             claimed_at = ?,
                             claimed_by = ?,
                             started_at = ?
                         WHERE plan_id_hash = ?
                           AND fingerprint = ?
                           AND status = 'ready'
                           AND expires_at > ?`
                    ).run(
                        now,
                        confirmedBy,
                        now,
                        claimedBy,
                        now,
                        planIdHash,
                        fingerprint,
                        now
                    );

                if (result.changes !== 1) {
                    return { errorCode: "PLAN_NOT_CLAIMABLE" };
                }

                return { plan: getPlanRow(planIdHash) };

            }).immediate();

        if (outcome.errorCode) {
            throw new PlanStoreError(
                outcome.errorCode,
                `Plan-ID kan niet worden geclaimd (${outcome.errorCode}).`
            );
        }

        return getPlan(outcome.plan.plan_id_hash);

    }


    function startOperation({
        planIdHash,
        sequence,
        operationId,
        startedAt
    }) {

        ensureOpen();

        requiredHash(planIdHash, "planIdHash");
        requiredString(operationId, "operationId", 200);
        isoTimestamp(startedAt, "startedAt");

        if (!Number.isInteger(sequence) || sequence < 0) {
            throw new PlanStoreError(
                "INVALID_INPUT",
                "sequence moet een niet-negatief geheel getal zijn."
            );
        }

        const result =
            database.prepare(
                `UPDATE plan_operations
                 SET status = 'in_progress',
                     started_at = ?
                 WHERE plan_id_hash = ?
                   AND sequence = ?
                   AND operation_id = ?
                   AND status = 'pending'
                   AND EXISTS (
                       SELECT 1
                       FROM plans
                       WHERE plans.plan_id_hash = plan_operations.plan_id_hash
                         AND plans.status = 'executing'
                   )`
            ).run(startedAt, planIdHash, sequence, operationId);

        if (result.changes !== 1) {
            throw new PlanStoreError(
                "OPERATION_NOT_STARTABLE",
                "Planoperatie bestaat niet, is al gestart of het plan voert niet uit."
            );
        }

        return getPlan(planIdHash).operations[sequence];

    }


    function finishOperation({
        planIdHash,
        sequence,
        operationId,
        status,
        finishedAt,
        externalReference = null,
        errorCode = null
    }) {

        ensureOpen();

        requiredHash(planIdHash, "planIdHash");
        requiredString(operationId, "operationId", 200);
        isoTimestamp(finishedAt, "finishedAt");

        if (
            !Number.isInteger(sequence) ||
            sequence < 0 ||
            !["succeeded", "failed", "unknown"].includes(status)
        ) {
            throw new PlanStoreError(
                "INVALID_INPUT",
                "Planoperatie-uitkomst of sequence is ongeldig."
            );
        }

        if (externalReference !== null) {
            requiredString(externalReference, "externalReference", 500);
        }

        if (errorCode !== null) {
            requiredString(errorCode, "errorCode", 100);
        }

        const result =
            database.prepare(
                `UPDATE plan_operations
                 SET status = ?,
                     finished_at = ?,
                     external_reference = ?,
                     error_code = ?
                 WHERE plan_id_hash = ?
                   AND sequence = ?
                   AND operation_id = ?
                   AND status = 'in_progress'
                   AND EXISTS (
                       SELECT 1
                       FROM plans
                       WHERE plans.plan_id_hash = plan_operations.plan_id_hash
                         AND plans.status = 'executing'
                   )`
            ).run(
                status,
                finishedAt,
                externalReference,
                errorCode,
                planIdHash,
                sequence,
                operationId
            );

        if (result.changes !== 1) {
            throw new PlanStoreError(
                "OPERATION_NOT_FINISHABLE",
                "Planoperatie is niet actief of het plan voert niet uit."
            );
        }

        return getPlan(planIdHash).operations[sequence];

    }


    function finishPlan({
        planIdHash,
        status,
        finishedAt,
        errorCode = null
    }) {

        ensureOpen();

        requiredHash(planIdHash, "planIdHash");
        isoTimestamp(finishedAt, "finishedAt");

        if (!PLAN_TERMINAL_STATUSES.has(status)) {
            throw new PlanStoreError(
                "INVALID_INPUT",
                "De eindstatus van het plan is ongeldig."
            );
        }

        if (errorCode !== null) {
            requiredString(errorCode, "errorCode", 100);
        }

        const outcome =
            database.transaction(() => {

                const plan =
                    getPlanRow(planIdHash);

                if (!plan || plan.status !== "executing") {
                    return { errorCode: "PLAN_NOT_EXECUTING" };
                }

                const currentOperationStatuses =
                    database.prepare(
                        `SELECT status
                         FROM plan_operations
                         WHERE plan_id_hash = ?`
                    ).all(planIdHash)
                        .map(operation => operation.status);

                if (
                    status !== "interrupted" &&
                    currentOperationStatuses.includes("in_progress")
                ) {
                    return { errorCode: "OPERATIONS_IN_PROGRESS" };
                }

                const operationStatuses =
                    currentOperationStatuses.map(operationStatus => {

                        if (operationStatus === "pending") {
                            return "skipped";
                        }

                        if (
                            status === "interrupted" &&
                            operationStatus === "in_progress"
                        ) {
                            return "unknown";
                        }

                        return operationStatus;

                    });

                const hasSucceeded =
                    operationStatuses.includes("succeeded");

                const hasNonSuccess =
                    operationStatuses.some(operationStatus =>
                        operationStatus !== "succeeded"
                    );

                const allSucceeded =
                    operationStatuses.length > 0 &&
                    operationStatuses.every(operationStatus =>
                        operationStatus === "succeeded"
                    );

                if (
                    (status === "completed" && !allSucceeded) ||
                    (status === "failed" && (
                        hasSucceeded ||
                        !operationStatuses.includes("failed") ||
                        operationStatuses.some(operationStatus =>
                            !["failed", "skipped"].includes(operationStatus)
                        )
                    )) ||
                    (status === "partial" && (!hasSucceeded || !hasNonSuccess))
                ) {
                    return { errorCode: "INVALID_PLAN_OUTCOME" };
                }

                if (status === "interrupted") {

                    database.prepare(
                        `UPDATE plan_operations
                         SET status = 'unknown',
                             finished_at = ?,
                             error_code = COALESCE(error_code, 'INTERRUPTED')
                         WHERE plan_id_hash = ?
                           AND status = 'in_progress'`
                    ).run(finishedAt, planIdHash);

                }

                database.prepare(
                    `UPDATE plan_operations
                     SET status = 'skipped',
                         finished_at = ?
                     WHERE plan_id_hash = ?
                       AND status = 'pending'`
                ).run(finishedAt, planIdHash);

                database.prepare(
                    `UPDATE plans
                     SET status = ?,
                         finished_at = ?,
                         error_code = ?
                     WHERE plan_id_hash = ?
                       AND status = 'executing'`
                ).run(status, finishedAt, errorCode, planIdHash);

                return { plan: getPlanRow(planIdHash) };

            }).immediate();

        if (outcome.errorCode) {
            throw new PlanStoreError(
                outcome.errorCode,
                `Plan kan niet worden afgerond (${outcome.errorCode}).`
            );
        }

        return getPlan(outcome.plan.plan_id_hash);

    }


    const store = {
        createPlan,
        getPlan,
        claimPlan,
        startOperation,
        finishOperation,
        finishPlan,
        close() {

            if (!closed) {
                database.close();
                closed = true;
            }

        }
    };

    return assertPlanStore(store);

}


function createTemporaryTestPlanStorePathOptions(
    temporaryDirectory,
    platform = process.platform
) {

    const pathApi =
        pathApiFor(platform);

    if (
        typeof temporaryDirectory !== "string" ||
        !pathApi.isAbsolute(temporaryDirectory) ||
        isUncPath(temporaryDirectory, platform)
    ) {
        throw new PlanStoreError(
            "INVALID_DATABASE_PATH",
            "De tijdelijke teststore vereist een absoluut lokaal temp-pad."
        );
    }

    let dataDirectory;

    if (platform === "win32") {
        dataDirectory =
            pathApi.join(temporaryDirectory, "RZD Builder");
    } else if (platform === "darwin") {
        dataDirectory =
            pathApi.join(
                temporaryDirectory,
                "Library",
                "Application Support",
                "RZD Builder"
            );
    } else {
        dataDirectory =
            pathApi.join(temporaryDirectory, "RZD Builder");
    }

    const env = {
        RZD_PLANSTORE_PATH:
            pathApi.join(dataDirectory, "planstore.sqlite")
    };

    if (platform === "win32") {
        env.LOCALAPPDATA = temporaryDirectory;
    } else if (platform !== "darwin") {
        env.XDG_DATA_HOME = temporaryDirectory;
    }

    return {
        env,
        platform,
        home: temporaryDirectory
    };

}


function createTemporaryTestPlanStore() {

    const temporaryRoot =
        fs.realpathSync(os.tmpdir());

    const temporaryDirectory =
        fs.mkdtempSync(
            path.join(temporaryRoot, "rzd-preview-planstore-")
        );

    let pathOptions;
    let store;

    try {

        pathOptions =
            createTemporaryTestPlanStorePathOptions(
                temporaryDirectory,
                process.platform
            );

        const databasePath =
            resolvePlanStorePath(pathOptions);

        if (!isWithinDirectory(
            databasePath,
            temporaryDirectory,
            pathApiFor(process.platform)
        )) {
            throw new PlanStoreError(
                "INVALID_DATABASE_PATH",
                "De tijdelijke teststore valt buiten de unieke temp-directory."
            );
        }

        store =
            createSqlitePlanStore({
                pathOptions
            });

    } catch (error) {

        try {
            fs.rmSync(temporaryDirectory, {
                recursive: true,
                force: true
            });
        } catch (cleanupError) {
            throw new AggregateError(
                [error, cleanupError],
                "Test-PlanStore kon niet worden aangemaakt of opgeruimd."
            );
        }

        throw error;

    }

    const closeStore =
        store.close.bind(store);

    let databaseClosed = false;
    let closed = false;

    store.close = function closeTemporaryTestPlanStore() {

        if (closed) {
            return;
        }

        if (!databaseClosed) {
            closeStore();
            databaseClosed = true;
        }

        fs.rmSync(temporaryDirectory, {
            recursive: true,
            force: true
        });

        closed = true;
        TEMPORARY_TEST_PLAN_STORES.delete(store);

    };

    TEMPORARY_TEST_PLAN_STORES.add(store);

    return store;

}


function isTemporaryTestPlanStore(store) {

    return Boolean(
        store &&
        typeof store === "object" &&
        TEMPORARY_TEST_PLAN_STORES.has(store)
    );

}


module.exports = {
    MAX_PLAN_TTL_MS,
    PlanStoreError,
    createTemporaryTestPlanStore,
    createTemporaryTestPlanStorePathOptions,
    createSqlitePlanStore,
    isTemporaryTestPlanStore,
    resolvePlanStorePath
};
