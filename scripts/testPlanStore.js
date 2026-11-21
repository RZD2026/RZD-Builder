const assert =
    require("assert");

const fs =
    require("fs");

const os =
    require("os");

const path =
    require("path");

const { spawn } =
    require("child_process");

const Database =
    require("better-sqlite3");

const {
    PlanStoreError,
    createSqlitePlanStore,
    resolvePlanStorePath
} =
    require("../services/sqlitePlanStore");


function hash(number) {

    return number.toString(16).padStart(64, "0");

}


function operation(operationId, sequence) {

    return {
        operationId,
        system: "airtable",
        action: "update",
        target: {
            tableId: "tblExample",
            recordId: `rec${sequence}`
        },
        payloadHash: hash(sequence + 100)
    };

}


function planInput(number, operations = [operation(`op-${number}`, 0)]) {

    const createdAt =
        new Date().toISOString();

    return {
        planIdHash: hash(number),
        fingerprint: hash(number + 1000),
        createdAt,
        expiresAt: new Date(
            Date.parse(createdAt) + 10 * 60 * 1000
        ).toISOString(),
        metadata: {
            source: "unit-test"
        },
        operations
    };

}


function storeOptions(databasePath, localAppData) {

    return {
        pathOptions: {
            env: {
                LOCALAPPDATA: localAppData,
                RZD_PLANSTORE_PATH: databasePath
            },
            platform: "win32"
        }
    };

}


function runClaimWorker(databasePath, planIdHash, fingerprint, now, workerId) {

    return new Promise((resolve, reject) => {

        const child =
            spawn(
                process.execPath,
                [
                    __filename,
                    "--claim-worker",
                    databasePath,
                    planIdHash,
                    fingerprint,
                    now,
                    workerId
                ],
                {
                    windowsHide: true,
                    stdio: ["ignore", "pipe", "pipe"]
                }
            );

        let stdout = "";
        let stderr = "";

        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");
        child.stdout.on("data", chunk => stdout += chunk);
        child.stderr.on("data", chunk => stderr += chunk);
        child.once("error", reject);
        child.once("close", exitCode => {

            if (exitCode !== 0) {
                reject(new Error(stderr || `claim worker exitcode ${exitCode}`));
                return;
            }

            resolve(stdout.trim());

        });

    });

}


function runClaimWorkerMode() {

    const [
        ,
        ,
        ,
        databasePath,
        planIdHash,
        fingerprint,
        now,
        workerId
    ] = process.argv;

    let store;

    try {

        store =
            createSqlitePlanStore(
                storeOptions(
                    databasePath,
                    path.dirname(path.dirname(databasePath))
                )
            );

        store.claimPlan({
            planIdHash,
            fingerprint,
            now,
            confirmedBy: `test-user-${workerId}`,
            claimedBy: `test-process-${workerId}`
        });

        process.stdout.write("CLAIMED");

    } catch (error) {

        if (
            error instanceof PlanStoreError &&
            error.code === "PLAN_NOT_CLAIMABLE"
        ) {
            process.stdout.write("REJECTED:PLAN_NOT_CLAIMABLE");
        } else {
            process.stderr.write(error.stack || String(error));
            process.exitCode = 1;
        }

    } finally {

        if (store) {
            store.close();
        }

    }

}


async function runTests() {

    const temporaryDirectory =
        fs.mkdtempSync(
            path.join(os.tmpdir(), `rzd-planstore-${process.pid}-`)
        );

    const databasePath =
        path.join(
            temporaryDirectory,
            "RZD Builder",
            "planstore.sqlite"
        );

    let store;

    try {

        store =
            createSqlitePlanStore(
                storeOptions(databasePath, temporaryDirectory)
            );

        const database =
            new Database(databasePath, {
                readonly: true,
                fileMustExist: true
            });

        assert.strictEqual(
            database.pragma("user_version", { simple: true }),
            1,
            "schema-migratie initialiseert versie 1"
        );

        assert.strictEqual(
            database.prepare(
                "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'plan_operations'"
            ).get().name,
            "plan_operations",
            "schema-migratie maakt de operatietabel aan"
        );

        database.close();
        store.close();
        store = createSqlitePlanStore(
            storeOptions(databasePath, temporaryDirectory)
        );

        const idempotentDatabase =
            new Database(databasePath, {
                readonly: true,
                fileMustExist: true
            });

        assert.strictEqual(
            idempotentDatabase.pragma("user_version", { simple: true }),
            1,
            "schema-migratie is idempotent bij heropenen"
        );

        idempotentDatabase.close();

        const rollbackPlan =
            planInput(
                1,
                [
                    operation("duplicate-operation", 0),
                    operation("duplicate-operation", 1)
                ]
            );

        assert.throws(
            () => store.createPlan(rollbackPlan),
            /UNIQUE constraint/
        );

        assert.strictEqual(
            store.getPlan(rollbackPlan.planIdHash),
            null,
            "transactie rolt planinsert terug als een operatie ongeldig is"
        );

        const tooLongPlan =
            planInput(2);

        tooLongPlan.expiresAt =
            new Date(
                Date.parse(tooLongPlan.createdAt) + 16 * 60 * 1000
            ).toISOString();

        assert.throws(
            () => store.createPlan(tooLongPlan),
            error => error.code === "INVALID_EXPIRY"
        );

        const partialPlan =
            planInput(
                3,
                [
                    operation("op-3-a", 0),
                    operation("op-3-b", 1)
                ]
            );

        store.createPlan(partialPlan);

        assert.throws(
            () => store.claimPlan({
                planIdHash: partialPlan.planIdHash,
                fingerprint: hash(9999),
                now: partialPlan.createdAt,
                confirmedBy: "test-user",
                claimedBy: "test-process"
            }),
            error => error.code === "PLAN_MISMATCH",
            "afwijkende fingerprint wordt voor de claim geweigerd"
        );

        assert.throws(
            () => store.claimPlan({
                planIdHash: partialPlan.planIdHash,
                fingerprint: partialPlan.fingerprint,
                now: partialPlan.createdAt,
                claimedBy: "test-process"
            }),
            error => error.code === "INVALID_INPUT",
            "ontbrekende expliciete bevestiger wordt geweigerd"
        );

        const claimedPlan =
            store.claimPlan({
                planIdHash: partialPlan.planIdHash,
                fingerprint: partialPlan.fingerprint,
                now: partialPlan.createdAt,
                confirmedBy: "test-user",
                claimedBy: "test-process"
            });

        assert.strictEqual(claimedPlan.status, "executing");
        assert.strictEqual(claimedPlan.confirmedBy, "test-user");
        assert.strictEqual(claimedPlan.claimedBy, "test-process");

        assert.throws(
            () => store.claimPlan({
                planIdHash: partialPlan.planIdHash,
                fingerprint: partialPlan.fingerprint,
                now: partialPlan.createdAt,
                confirmedBy: "test-user",
                claimedBy: "second-process"
            }),
            error => error.code === "PLAN_NOT_CLAIMABLE"
        );

        store.startOperation({
            planIdHash: partialPlan.planIdHash,
            sequence: 0,
            operationId: "op-3-a",
            startedAt: partialPlan.createdAt
        });

        store.finishOperation({
            planIdHash: partialPlan.planIdHash,
            sequence: 0,
            operationId: "op-3-a",
            status: "succeeded",
            finishedAt: partialPlan.createdAt,
            externalReference: "record-reference"
        });

        store.startOperation({
            planIdHash: partialPlan.planIdHash,
            sequence: 1,
            operationId: "op-3-b",
            startedAt: partialPlan.createdAt
        });

        store.finishOperation({
            planIdHash: partialPlan.planIdHash,
            sequence: 1,
            operationId: "op-3-b",
            status: "unknown",
            finishedAt: partialPlan.createdAt,
            errorCode: "RESULT_UNCERTAIN"
        });

        const partialResult =
            store.finishPlan({
                planIdHash: partialPlan.planIdHash,
                status: "partial",
                finishedAt: partialPlan.createdAt,
                errorCode: "PARTIAL_EXECUTION"
            });

        assert.strictEqual(partialResult.status, "partial");
        assert.deepStrictEqual(
            partialResult.operations.map(item => item.status),
            ["succeeded", "unknown"],
            "operatiestatussen registreren succes en onzekere uitkomst"
        );

        const expiredPlan =
            planInput(4);

        store.createPlan(expiredPlan);

        assert.throws(
            () => store.claimPlan({
                planIdHash: expiredPlan.planIdHash,
                fingerprint: expiredPlan.fingerprint,
                now: new Date(
                    Date.parse(expiredPlan.expiresAt) + 1
                ).toISOString(),
                confirmedBy: "test-user",
                claimedBy: "test-process"
            }),
            error => error.code === "PLAN_EXPIRED"
        );

        assert.strictEqual(
            store.getPlan(expiredPlan.planIdHash).status,
            "expired",
            "een verlopen plan wordt duurzaam als expired geregistreerd"
        );

        const firstActivePlan =
            planInput(5);

        const secondActivePlan =
            planInput(6);

        store.createPlan(firstActivePlan);
        store.createPlan(secondActivePlan);

        store.claimPlan({
            planIdHash: firstActivePlan.planIdHash,
            fingerprint: firstActivePlan.fingerprint,
            now: firstActivePlan.createdAt,
            confirmedBy: "test-user",
            claimedBy: "test-process"
        });

        assert.throws(
            () => store.claimPlan({
                planIdHash: secondActivePlan.planIdHash,
                fingerprint: secondActivePlan.fingerprint,
                now: secondActivePlan.createdAt,
                confirmedBy: "test-user",
                claimedBy: "second-process"
            }),
            error => error.code === "ACTIVE_PLAN_EXISTS"
        );

        store.finishPlan({
            planIdHash: firstActivePlan.planIdHash,
            status: "interrupted",
            finishedAt: firstActivePlan.createdAt
        });

        assert.strictEqual(
            store.getPlan(firstActivePlan.planIdHash).operations[0].status,
            "skipped",
            "onuitgevoerde operaties worden bij onderbreking niet opnieuw gestart"
        );

        const concurrentPlan =
            planInput(7);

        store.createPlan(concurrentPlan);
        store.close();
        store = null;

        const workerNow =
            new Date().toISOString();

        const workerResults =
            await Promise.all([
                runClaimWorker(
                    databasePath,
                    concurrentPlan.planIdHash,
                    concurrentPlan.fingerprint,
                    workerNow,
                    "a"
                ),
                runClaimWorker(
                    databasePath,
                    concurrentPlan.planIdHash,
                    concurrentPlan.fingerprint,
                    workerNow,
                    "b"
                )
            ]);

        assert.strictEqual(
            workerResults.filter(result => result === "CLAIMED").length,
            1,
            "atomische claim laat precies één Node-proces winnen"
        );

        assert.strictEqual(
            workerResults.filter(
                result => result === "REJECTED:PLAN_NOT_CLAIMABLE"
            ).length,
            1,
            "tweede Node-proces kan hetzelfde plan niet claimen"
        );

        store =
            createSqlitePlanStore(
                storeOptions(databasePath, temporaryDirectory)
            );

        assert.strictEqual(
            store.getPlan(concurrentPlan.planIdHash).status,
            "executing",
            "claimstatus blijft duurzaam na procesafsluiting"
        );

        store.finishPlan({
            planIdHash: concurrentPlan.planIdHash,
            status: "interrupted",
            finishedAt: new Date().toISOString()
        });

        const windowsDefault =
            resolvePlanStorePath({
                env: {
                    LOCALAPPDATA: "C:\\Users\\test\\AppData\\Local"
                },
                platform: "win32"
            });

        assert.strictEqual(
            windowsDefault,
            "C:\\Users\\test\\AppData\\Local\\RZD Builder\\planstore.sqlite",
            "Windows-standaardpad staat onder LOCALAPPDATA"
        );

        assert.throws(
            () => resolvePlanStorePath({
                env: {
                    LOCALAPPDATA: "C:\\Users\\test\\AppData\\Local",
                    RZD_PLANSTORE_PATH: String.raw`\\server\share\planstore.sqlite`
                },
                platform: "win32"
            }),
            error => error.code === "INVALID_DATABASE_PATH",
            "UNC-shares worden als PlanStore-pad geweigerd"
        );

        assert.throws(
            () => createSqlitePlanStore({
                ...storeOptions(
                    path.join(temporaryDirectory, "RZD Builder"),
                    temporaryDirectory
                )
            }),
            error => error.code === "INVALID_DATABASE_PATH",
            "directory als databasebestand wordt fail-closed geweigerd"
        );

        const corruptDatabasePath =
            path.join(
                temporaryDirectory,
                "RZD Builder",
                "corrupt.sqlite"
            );

        fs.writeFileSync(corruptDatabasePath, "not a SQLite database");

        assert.throws(
            () => createSqlitePlanStore(
                storeOptions(corruptDatabasePath, temporaryDirectory)
            ),
            error => Boolean(error),
            "ongeldige SQLite-database wordt fail-closed geweigerd"
        );

        store.close();
        store = null;

        console.log("Alle PlanStore-tests geslaagd.");

    } finally {

        if (store) {
            store.close();
        }

        fs.rmSync(temporaryDirectory, {
            recursive: true,
            force: true
        });

    }

}


if (process.argv[2] === "--claim-worker") {
    runClaimWorkerMode();
} else {
    runTests().catch(error => {
        console.error(error);
        process.exit(1);
    });
}
