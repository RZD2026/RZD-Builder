const dotenv = require("dotenv");
dotenv.config = () => ({ parsed: {} });

process.env.AIRTABLE_BASE_ID = "appTestBase";
process.env.AIRTABLE_TOKEN = "test-placeholder";

const assert = require("assert");
const axios = require("axios");
const updateService = require("./services/updateService");

(async () => {
    const originalPatch = axios.patch;
    let patchCallCount = 0;

    axios.patch = async () => {
        patchCallCount++;
    };

    try {
        await assert.rejects(
            () => updateService.updateField(
                "tblTestTable",
                "fldTestField",
                { description: "Test description" }
            ),
            error =>
                error.code === "METADATA_WRITE_AUTHORIZATION_REQUIRED"
        );

        assert.strictEqual(
            patchCallCount,
            0,
            "Geblokkeerde metadata-write mag axios.patch niet aanroepen."
        );

        console.log("UpdateService fail-closed test passed.");
    } finally {
        axios.patch = originalPatch;
    }
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});