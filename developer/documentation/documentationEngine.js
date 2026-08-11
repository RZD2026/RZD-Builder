#!/usr/bin/env node

/**
 * RZD Builder Documentation Engine
 * Phase 3G
 *
 * CONTROLLED MANAGED-BLOCK WRITE
 *
 * Veiligheidsregels:
 *
 * 1. Alleen RZD-AUTO managed blocks mogen worden gewijzigd.
 * 2. Alles buiten START/END markers blijft onaangeraakt.
 * 3. Elke START-marker moet exact één keer voorkomen.
 * 4. Elke END-marker moet exact één keer voorkomen.
 * 5. START moet vóór END staan.
 * 6. Protected documenten worden nooit gewijzigd.
 * 7. CHANGELOG is append-only en wordt hier niet gewijzigd.
 * 8. Zonder --execute wordt niets geschreven.
 * 9. Voor iedere write wordt opnieuw een volledige safety check uitgevoerd.
 * 10. Na de write wordt het resultaat opnieuw gecontroleerd.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");

const mapping =
    require("./documentationMapping");

const EXECUTE =
    process.argv.includes("--execute");


/* =========================================================
   FILE HELPERS
   ========================================================= */

function absolutePath(file) {

    return path.join(
        ROOT,
        file
    );

}


function read(file) {

    const fullPath =
        absolutePath(file);

    if (!fs.existsSync(fullPath)) {

        return null;

    }

    return fs.readFileSync(
        fullPath,
        "utf8"
    );

}


function write(file, content) {

    const fullPath =
        absolutePath(file);

    fs.writeFileSync(
        fullPath,
        content,
        "utf8"
    );

}


/* =========================================================
   MANAGED BLOCK MARKERS
   ========================================================= */

function getMarkers(name) {

    return {

        start:
            `<!-- RZD-AUTO:START ${name} -->`,

        end:
            `<!-- RZD-AUTO:END ${name} -->`

    };

}


/* =========================================================
   MANAGED BLOCK INSPECTION
   ========================================================= */

function inspectManagedBlock(
    content,
    name
) {

    if (content === null) {

        return {

            valid: false,

            reason:
                "Document bestaat niet."

        };

    }


    const markers =
        getMarkers(name);


    const startCount =
        content.split(
            markers.start
        ).length - 1;


    const endCount =
        content.split(
            markers.end
        ).length - 1;


    if (startCount !== 1) {

        return {

            valid: false,

            reason:
                `START-marker komt ${startCount} keer voor; exact 1 vereist.`

        };

    }


    if (endCount !== 1) {

        return {

            valid: false,

            reason:
                `END-marker komt ${endCount} keer voor; exact 1 vereist.`

        };

    }


    const start =
        content.indexOf(
            markers.start
        );


    const end =
        content.indexOf(
            markers.end
        );


    if (start >= end) {

        return {

            valid: false,

            reason:
                "START-marker staat niet vóór END-marker."

        };

    }


    const contentStart =
        start +
        markers.start.length;


    const managedContent =
        content.substring(
            contentStart,
            end
        );


    return {

        valid: true,

        start,

        end,

        contentStart,

        managedContent,

        markers

    };

}


/* =========================================================
   CONTENT GENERATORS
   ========================================================= */

function generateFieldSpecification() {

    return [
        "### RZD 5.1 actuele mapping",
        "",
        "- Content Modules → Modules",
        "- Beoordelingspunten → Beoordelingspunten",
        "- Accommodatie Beoordelingen → Accommodatie beoordelingen",
        "- Accommodaties → Accommodaties",
        "",
        "**Antwoordveld:** Waarde / Resultaat",
        "",
        "**Verbeterpunten:** afzonderlijke rapportage- en actielaag",
        "",
        "**Bronnen:** relationele laag; meerdere bronnen per accommodatie en beoordeling toegestaan.",
        "",
        "**Veiligheid:** bestaande RZD 5.1-data blijft leidend."
    ].join("\n");

}


function generateProjectStatus() {

    return [
        "### Documentation Engine actuele status",
        "",
        "- 3A — documentatiestructuur gevalideerd",
        "- 3B — documentation mapping vastgesteld",
        "- 3C — mapping geladen en toegepast",
        "- 3D — concrete documentgeneratie getest",
        "- 3E — bestaande headings gevalideerd",
        "- 3F — managed-block diff gevalideerd",
        "- 3G — gecontroleerde document-write beschikbaar",
        "",
        "**Write-status:** gecontroleerde write-fase actief.",
        "",
        "**Airtable:** geen writes uitgevoerd door de Documentation Engine.",
        "",
        "**GitHub:** wijzigingen worden via de lokale Git-workflow gecommit en gepusht."
    ].join("\n");

}


function generateCheckpoint() {

    return [
        "### Documentation Engine status",
        "",
        "De managed-block beveiliging is actief.",
        "",
        "De engine mag uitsluitend inhoud tussen RZD-AUTO START/END-markers wijzigen.",
        "",
        "Alle bestaande documentinhoud buiten deze markers blijft onaangetast.",
        "",
        "Documentation Engine 3G ondersteunt gecontroleerde writes.",
        "",
        "Na de write moet de Git-diff worden gecontroleerd voordat wordt gecommit."
    ].join("\n");

}


/* =========================================================
   GENERATOR SELECTOR
   ========================================================= */

function getGeneratedContent(file) {

    if (
        file ===
        mapping.documents.fieldSpecification.path
    ) {

        return generateFieldSpecification();

    }


    if (
        file ===
        mapping.documents.projectStatus.path
    ) {

        return generateProjectStatus();

    }


    if (
        file ===
        mapping.documents.checkpoint.path
    ) {

        return generateCheckpoint();

    }


    return null;

}


/* =========================================================
   BUILD PROPOSED DOCUMENT
   ========================================================= */

function buildProposedDocument(
    original,
    block,
    generated
) {

    const before =
        original.substring(
            0,
            block.contentStart
        );


    const after =
        original.substring(
            block.end
        );


    return (
        before +
        "\n" +
        generated +
        "\n" +
        after
    );

}


/* =========================================================
   SAFETY CHECK
   ========================================================= */

/**
 * Controleert uitsluitend het gedeelte BUITEN
 * het managed block.
 *
 * Dit gebeurt aan beide kanten van de markers:
 *
 * ORIGINAL:
 *
 * [before START]
 * START
 * [managed content]
 * END
 * [after END]
 *
 * PROPOSED:
 *
 * [before START]
 * START
 * [new managed content]
 * END
 * [after END]
 *
 * Alleen before + after mogen verschillen niet.
 */
function verifyOutsideManagedBlockUnchanged(
    original,
    proposed,
    block
) {

    const startMarker =
        block.markers.start;

    const endMarker =
        block.markers.end;


    /* -----------------------------------------------------
       POSITIES IN OORSPRONKELIJK DOCUMENT
       ----------------------------------------------------- */

    const originalStart =
        original.indexOf(
            startMarker
        );

    const originalEnd =
        original.indexOf(
            endMarker
        );


    if (
        originalStart === -1 ||
        originalEnd === -1
    ) {

        return false;

    }


    /* -----------------------------------------------------
       POSITIES IN VOORGESTELD DOCUMENT
       ----------------------------------------------------- */

    const proposedStart =
        proposed.indexOf(
            startMarker
        );

    const proposedEnd =
        proposed.indexOf(
            endMarker
        );


    if (
        proposedStart === -1 ||
        proposedEnd === -1
    ) {

        return false;

    }


    /* -----------------------------------------------------
       ALLES VOOR START
       ----------------------------------------------------- */

    const originalBefore =
        original.substring(
            0,
            originalStart
        );


    const proposedBefore =
        proposed.substring(
            0,
            proposedStart
        );


    if (
        originalBefore !==
        proposedBefore
    ) {

        return false;

    }


    /* -----------------------------------------------------
       ALLES NA END
       ----------------------------------------------------- */

    const originalAfter =
        original.substring(
            originalEnd +
            endMarker.length
        );


    const proposedAfter =
        proposed.substring(
            proposedEnd +
            endMarker.length
        );


    if (
        originalAfter !==
        proposedAfter
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   MARKER SAFETY AFTER BUILD
   ========================================================= */

function verifyProposedMarkers(
    proposed,
    name
) {

    const inspection =
        inspectManagedBlock(
            proposed,
            name
        );


    if (!inspection.valid) {

        return {

            valid: false,

            reason:
                inspection.reason

        };

    }


    return {

        valid: true

    };

}


/* =========================================================
   DOCUMENT PREPARATION
   ========================================================= */

function prepareDocument(
    definition
) {

    const file =
        definition.path;


    const name =
        path.basename(
            file,
            ".md"
        );


    const original =
        read(file);


    const block =
        inspectManagedBlock(
            original,
            name
        );


    if (!block.valid) {

        return {

            file,

            name,

            status:
                "BLOCKED",

            reason:
                block.reason

        };

    }


    const generated =
        getGeneratedContent(
            file
        );


    if (generated === null) {

        return {

            file,

            name,

            status:
                "BLOCKED",

            reason:
                "Geen generator beschikbaar."

        };

    }


    const proposed =
        buildProposedDocument(
            original,
            block,
            generated
        );


    /* -----------------------------------------------------
       SAFETY CHECK 1
       BUITEN BLOCK ONGEWIJZIGD
       ----------------------------------------------------- */

    const outsideUnchanged =
        verifyOutsideManagedBlockUnchanged(
            original,
            proposed,
            block
        );


    if (!outsideUnchanged) {

        return {

            file,

            name,

            status:
                "BLOCKED",

            reason:
                "Veiligheidscontrole mislukt: inhoud buiten managed block zou wijzigen."

        };

    }


    /* -----------------------------------------------------
       SAFETY CHECK 2
       MARKERS NOG STEEDS GELDIG
       ----------------------------------------------------- */

    const markerCheck =
        verifyProposedMarkers(
            proposed,
            name
        );


    if (!markerCheck.valid) {

        return {

            file,

            name,

            status:
                "BLOCKED",

            reason:
                `Markercontrole mislukt: ${markerCheck.reason}`

        };

    }


    /* -----------------------------------------------------
       WIJZIGING BEPALEN
       ----------------------------------------------------- */

    const currentManaged =
        block.managedContent
            .trim();


    const proposedManaged =
        generated.trim();


    const changed =
        currentManaged !==
        proposedManaged;


    return {

        file,

        name,

        status:
            changed
                ? "PROPOSED_CHANGE"
                : "NO_CHANGE",

        original,

        proposed,

        currentManaged,

        proposedManaged,

        outsideUnchanged: true,

        markersValid: true

    };

}


/* =========================================================
   WRITE
   ========================================================= */

function executeWrite(
    result
) {

    if (
        result.status !==
        "PROPOSED_CHANGE"
    ) {

        return {

            written: false,

            reason:
                "Geen wijziging nodig."

        };

    }


    write(
        result.file,
        result.proposed
    );


    return {

        written: true

    };

}


/* =========================================================
   POST-WRITE VERIFICATION
   ========================================================= */

function verifyWrittenDocument(
    result
) {

    const current =
        read(
            result.file
        );


    if (current === null) {

        return {

            valid: false,

            reason:
                "Document kan na write niet worden gelezen."

        };

    }


    if (
        current !==
        result.proposed
    ) {

        return {

            valid: false,

            reason:
                "Document na write komt niet exact overeen met de voorgestelde inhoud."

        };

    }


    const block =
        inspectManagedBlock(
            current,
            result.name
        );


    if (!block.valid) {

        return {

            valid: false,

            reason:
                "Managed block is na write niet meer geldig."

        };

    }


    return {

        valid: true

    };

}


/* =========================================================
   RESULT OUTPUT
   ========================================================= */

function printResult(
    result
) {

    console.log("");

    console.log(
        `DOCUMENT: ${result.file}`
    );

    console.log(
        `STATUS: ${result.status}`
    );


    if (result.reason) {

        console.log(
            `REDEN: ${result.reason}`
        );

        return;

    }


    console.log(
        "START/END markers: GELDIG"
    );

    console.log(
        "Inhoud buiten managed block: ONGEWIJZIGD"
    );


    if (
        result.status ===
        "NO_CHANGE"
    ) {

        console.log(
            "Managed block: geen wijziging."
        );

        return;

    }


    if (
        result.status ===
        "PROPOSED_CHANGE"
    ) {

        console.log(
            "Managed block: wijziging voorbereid."
        );

    }

}


/* =========================================================
   MAIN
   ========================================================= */

function run() {

    console.log("");

    console.log(
        "===== RZD 5.1 DOCUMENTATION ENGINE 3G ====="
    );

    console.log("");


    if (EXECUTE) {

        console.log(
            "MODUS: CONTROLLED WRITE"
        );

        console.log(
            "VEILIG: WRITE ALLEEN BINNEN MANAGED BLOCKS"
        );

    }
    else {

        console.log(
            "MODUS: WRITE DRY-RUN"
        );

        console.log(
            "VEILIG: JA - GEEN SCHRIJFACTIES"
        );

    }


    console.log(
        "REGEL: ALLES BUITEN RZD-AUTO MARKERS BLIJFT INTACT"
    );

    console.log("");


    const definitions = [

        mapping.documents.fieldSpecification,

        mapping.documents.projectStatus,

        mapping.documents.checkpoint

    ];


    /* -----------------------------------------------------
       FASE 1
       ALLE DOCUMENTEN VOORAF CONTROLEREN
       ----------------------------------------------------- */

    console.log(
        "===== SAFETY CHECK ====="
    );


    const results =
        definitions.map(
            prepareDocument
        );


    for (
        const result
        of results
    ) {

        printResult(
            result
        );

    }


    const blocked =
        results.filter(
            result =>
                result.status ===
                "BLOCKED"
        );


    /* -----------------------------------------------------
       NO WRITE BIJ ENIGE SAFETY FAILURE
       ----------------------------------------------------- */

    if (
        blocked.length > 0
    ) {

        console.log("");

        console.log(
            "===== WRITE GEBLOKKEERD ====="
        );

        console.log("");

        console.log(
            "Niet alle managed blocks zijn veilig."
        );

        console.log(
            "Er is niets geschreven."
        );

        process.exit(2);

    }


    /* -----------------------------------------------------
       DRY-RUN
       ----------------------------------------------------- */

    if (!EXECUTE) {

        console.log("");

        console.log(
            "===== 3G DRY-RUN GESLAAGD ====="
        );

        console.log("");

        console.log(
            "Gebruik --execute om de gecontroleerde write uit te voeren."
        );

        console.log("");

        console.log(
            "Documenten gewijzigd: 0"
        );

        console.log(
            "Airtable writes: 0"
        );

        console.log(
            "GitHub writes: 0"
        );

        console.log("");

        return;

    }


    /* -----------------------------------------------------
       CONTROLLED WRITE
       ----------------------------------------------------- */

    console.log("");

    console.log(
        "===== CONTROLLED WRITE ====="
    );


    const writes = [];


    for (
        const result
        of results
    ) {

        const writeResult =
            executeWrite(
                result
            );


        writes.push({

            result,

            writeResult

        });


        if (
            writeResult.written
        ) {

            console.log(
                `WRITE: ${result.file}`
            );

        }
        else {

            console.log(
                `GEEN WRITE: ${result.file}`
            );

        }

    }


    /* -----------------------------------------------------
       POST-WRITE VERIFICATIE
       ----------------------------------------------------- */

    console.log("");

    console.log(
        "===== POST-WRITE VERIFICATIE ====="
    );


    let verificationFailed =
        false;


    for (
        const item
        of writes
    ) {

        if (
            !item.writeResult.written
        ) {

            continue;

        }


        const verification =
            verifyWrittenDocument(
                item.result
            );


        if (
            verification.valid
        ) {

            console.log(
                `OK: ${item.result.file}`
            );

        }
        else {

            verificationFailed =
                true;

            console.log(
                `FOUT: ${item.result.file}`
            );

            console.log(
                `  ${verification.reason}`
            );

        }

    }


    /* -----------------------------------------------------
       SUMMARY
       ----------------------------------------------------- */

    const written =
        writes.filter(
            item =>
                item.writeResult.written
        ).length;


    console.log("");

    console.log(
        "===== 3G SAMENVATTING ====="
    );

    console.log("");

    console.log(
        "Managed documenten:",
        results.length
    );

    console.log(
        "Writes uitgevoerd:",
        written
    );

    console.log(
        "Volledige documenten vervangen:",
        0
    );

    console.log(
        "Inhoud buiten managed blocks gewijzigd:",
        0
    );

    console.log(
        "Airtable writes:",
        0
    );

    console.log(
        "GitHub writes:",
        0
    );

    console.log("");


    if (
        verificationFailed
    ) {

        console.log(
            "===== 3G WRITE VERIFICATIE MISLUKT ====="
        );

        console.log("");

        process.exit(3);

    }


    console.log(
        "===== DOCUMENTATION ENGINE 3G WRITE GESLAAGD ====="
    );

    console.log("");

}


/* =========================================================
   EXECUTION
   ========================================================= */

try {

    run();

}
catch (error) {

    console.error("");

    console.error(
        "===== DOCUMENTATION ENGINE 3G MISLUKT ====="
    );

    console.error("");

    console.error(
        error.stack ||
        error.message
    );

    console.error("");

    process.exit(1);

}