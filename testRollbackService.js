const dotenv = require("dotenv");
dotenv.config = () => ({ parsed: {} });

process.env.AIRTABLE_BASE_ID = "appTestBase";
process.env.AIRTABLE_TOKEN = "test-placeholder";

const assert = require("assert");
const axios = require("axios");
const rollbackService = require("./services/rollbackService");

(async () => {
    const originalPatch = axios.patch;
    const originalLog = console.log;
    let patchCallCount = 0;

    axios.patch = async () => {
        patchCallCount++;
    };
    console.log = () => {};

    try {
        rollbackService.clear();
        rollbackService.register(
            "tblTestTable",
            "fldTestField",
            {
                name: "Test field",
                type: "singleLineText",
                description: "After",
                options: {}
            },
            {
                name: "Test field",
                type: "singleLineText",
                description: "Before",
                options: {}
            }
        );

        await assert.rejects(
            () => rollbackService.rollback(),
            error =>
                error.code === "METADATA_WRITE_AUTHORIZATION_REQUIRED"
        );

        assert.strictEqual(
            patchCallCount,
            0,
            "Geblokkeerde rollback mag axios.patch niet aanroepen."
        );

        originalLog("Rollback fail-closed test passed.");
    } finally {
        rollbackService.clear();
        axios.patch = originalPatch;
        console.log = originalLog;
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
