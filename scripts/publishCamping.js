require("dotenv").config();

const crypto =
    require("crypto");

const campingReadService =
    require("../services/campingReadService");

const wordpressMapper =
    require("../services/wordpressMapper");

const wordpressPublisher =
    require("../services/wordpressPublisher");

const wordpressPostService =
    require("../services/wordpressPostService");

const EXISTING_PAGE_ID = 1554;


function parseArgs(args) {

    const positional =
        args.filter(value => !value.startsWith("--"));

    const flags =
        args.filter(value => value.startsWith("--"));

    const unknownFlags =
        flags.filter(value => ![
            "--publish",
            "--update-existing",
            "--dry-run",
            "--apply-update"
        ].includes(value));

    const updateExisting =
        flags.includes("--update-existing");
    const dryRun =
        flags.includes("--dry-run");
    const applyUpdate =
        flags.includes("--apply-update");

    if (
        unknownFlags.length > 0 ||
        positional.length !== 1 ||
        (updateExisting && dryRun === applyUpdate) ||
        (!updateExisting && (dryRun || applyUpdate)) ||
        (updateExisting && flags.includes("--publish"))
    ) {
        throw new Error(
            "Gebruik: node scripts/publishCamping.js <campingId> [--publish] of [--update-existing --dry-run|--apply-update]"
        );
    }

    return {
        campingId: positional[0],
        publish: flags.includes("--publish"),
        updateExisting,
        dryRun,
        applyUpdate
    };

}


function formatServiceError(result) {

    const status =
        result?.status === undefined ? "onbekend" : result.status;
    const statusText =
        result?.statusText ? `: ${result.statusText}` : "";

    return `WordPress-verwerking mislukt (status ${status})${statusText}.`;

}


function validateExistingPage(matches, payload, campingId) {

    if (matches.length !== 1) {
        throw new Error(
            `Verwacht exact één bestaande WordPress-pagina voor ${campingId}; gevonden: ${matches.length}.`
        );
    }

    const page = matches[0];

    if (page.id !== EXISTING_PAGE_ID) {
        throw new Error(
            `Bestaande WordPress-pagina heeft onverwacht ID ${page.id}.`
        );
    }

    if (page.status !== "draft") {
        throw new Error(
            `Bestaande WordPress-pagina heeft status ${page.status || "onbekend"}; alleen draft is toegestaan.`
        );
    }

    if (payload?.meta?.rzd_camping_id !== campingId) {
        throw new Error(
            "WordPress-payload bevat geen exact overeenkomende rzd_camping_id."
        );
    }

    return page;

}


function listUpdateFields(payload) {

    return Object.keys(payload)
        .filter(key => key !== "status")
        .join(", ");

}


function buildUpdateRequestBody(payload) {

    return {
        ...payload,
        status: "draft"
    };

}


function pageField(page, field) {

    const value = page?.[field];

    if (value && typeof value === "object" && "rendered" in value) {
        return value.rendered || "";
    }

    return value || "";

}


function displayValue(value) {

    if (value === undefined || value === null || value === "") {
        return "(leeg)";
    }

    if (typeof value === "string") {
        return value;
    }

    return JSON.stringify(value);

}


function normalizeContent(content) {

    return String(content || "")
        .replace(/>\s*</g, ">\n<")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

}


function selectContent(page, field = "content") {

    const value = page?.[field];

    if (
        value &&
        typeof value === "object" &&
        Object.prototype.hasOwnProperty.call(value, "raw")
    ) {
        return {
            value: value.raw || "",
            source: "raw"
        };
    }

    if (
        value &&
        typeof value === "object" &&
        Object.prototype.hasOwnProperty.call(value, "rendered")
    ) {
        return {
            value: value.rendered || "",
            source: "rendered"
        };
    }

    return {
        value: value || "",
        source: "plain"
    };

}


function hashContent(content) {

    return crypto
        .createHash("sha256")
        .update(content, "utf8")
        .digest("hex");

}


function buildContentDiff(currentContent, proposedContent) {

    const currentLines = normalizeContent(currentContent);
    const proposedLines = normalizeContent(proposedContent);
    const matrix = Array.from(
        { length: currentLines.length + 1 },
        () => Array(proposedLines.length + 1).fill(0)
    );

    for (let currentIndex = currentLines.length - 1; currentIndex >= 0; currentIndex--) {
        for (let proposedIndex = proposedLines.length - 1; proposedIndex >= 0; proposedIndex--) {
            matrix[currentIndex][proposedIndex] =
                currentLines[currentIndex] === proposedLines[proposedIndex]
                    ? matrix[currentIndex + 1][proposedIndex + 1] + 1
                    : Math.max(
                        matrix[currentIndex + 1][proposedIndex],
                        matrix[currentIndex][proposedIndex + 1]
                    );
        }
    }

    const diff = [];
    let currentIndex = 0;
    let proposedIndex = 0;

    while (currentIndex < currentLines.length || proposedIndex < proposedLines.length) {
        if (
            currentIndex < currentLines.length &&
            proposedIndex < proposedLines.length &&
            currentLines[currentIndex] === proposedLines[proposedIndex]
        ) {
            diff.push(`  ${currentLines[currentIndex]}`);
            currentIndex++;
            proposedIndex++;
        } else if (
            proposedIndex < proposedLines.length &&
            (currentIndex >= currentLines.length ||
                matrix[currentIndex][proposedIndex + 1] >= matrix[currentIndex + 1][proposedIndex])
        ) {
            diff.push(`+ ${proposedLines[proposedIndex]}`);
            proposedIndex++;
        } else {
            diff.push(`- ${currentLines[currentIndex]}`);
            currentIndex++;
        }
    }

    return diff;

}


function comparePage(page, requestBody) {

    const currentMeta = page?.meta || {};
    const proposedMeta = requestBody?.meta || {};
    const metadataKeys = Array.from(
        new Set([...Object.keys(currentMeta), ...Object.keys(proposedMeta)])
    ).sort();
    const metadata = {
        toegevoegd: [],
        gewijzigd: [],
        explicietLeeggemaakt: [],
        nietMeegestuurd: [],
        ongewijzigd: []
    };

    metadataKeys.forEach(key => {
        const currentExists =
            Object.prototype.hasOwnProperty.call(currentMeta, key);
        const proposedExists =
            Object.prototype.hasOwnProperty.call(proposedMeta, key);

        if (!proposedExists) {
            metadata.nietMeegestuurd.push({
                key,
                current: currentMeta[key]
            });
            return;
        }

        const item = {
            key,
            current: currentMeta[key],
            proposed: proposedMeta[key]
        };

        if (!currentExists) {
            metadata.toegevoegd.push(item);
        } else if (
            JSON.stringify(currentMeta[key]) === JSON.stringify(proposedMeta[key])
        ) {
            metadata.ongewijzigd.push(item);
        } else if (
            proposedMeta[key] === "" ||
            proposedMeta[key] === null ||
            (Array.isArray(proposedMeta[key]) && proposedMeta[key].length === 0)
        ) {
            metadata.explicietLeeggemaakt.push(item);
        } else {
            metadata.gewijzigd.push(item);
        }
    });

    const currentContent =
        selectContent(page);
    const proposedContent =
        selectContent(requestBody);
    const exactContentEqual =
        currentContent.value === proposedContent.value;
    const normalizedContentEqual =
        normalizeContent(currentContent.value).join("\n") ===
        normalizeContent(proposedContent.value).join("\n");

    return {
        currentTitle: pageField(page, "title"),
        proposedTitle: pageField(requestBody, "title"),
        metadata,
        contentDetails: {
            currentSource: currentContent.source,
            proposedSource: proposedContent.source,
            current: currentContent.value,
            proposed: proposedContent.value,
            exactEqual: exactContentEqual,
            normalizedEqual: normalizedContentEqual,
            currentLength: currentContent.value.length,
            proposedLength: proposedContent.value.length,
            currentSha256: hashContent(currentContent.value),
            proposedSha256: hashContent(proposedContent.value)
        },
        content: buildContentDiff(
            currentContent.value,
            proposedContent.value
        )
    };

}


function printComparison(page, payload) {

    const comparison =
        comparePage(page, payload);

    console.log(`Huidige status: ${displayValue(page?.status)}`);
    console.log(`Voorgestelde status: ${displayValue(payload?.status)}`);
    console.log(
        `Huidige meta.rzd_camping_id: ${displayValue(page?.meta?.rzd_camping_id)}`
    );
    console.log(
        `Voorgestelde meta.rzd_camping_id: ${displayValue(payload?.meta?.rzd_camping_id)}`
    );
    console.log(`Huidige titel: ${displayValue(comparison.currentTitle)}`);
    console.log(`Voorgestelde titel: ${displayValue(comparison.proposedTitle)}`);
    console.log(
        `Contentbron huidige pagina: ${comparison.contentDetails.currentSource}`
    );
    console.log(
        `Contentbron voorgestelde payload: ${comparison.contentDetails.proposedSource}`
    );
    if (comparison.contentDetails.currentSource === "rendered") {
        console.log(
            "Let op: huidige content bevat geen raw-waarde; vergelijking gebruikt rendered inhoud."
        );
    }
    console.log(
        `Content exact gelijk: ${comparison.contentDetails.exactEqual}`
    );
    console.log(
        `Contentlengte huidig/voorgesteld: ${comparison.contentDetails.currentLength}/${comparison.contentDetails.proposedLength}`
    );
    console.log(
        `Content SHA-256 huidig: ${comparison.contentDetails.currentSha256}`
    );
    console.log(
        `Content SHA-256 voorgesteld: ${comparison.contentDetails.proposedSha256}`
    );

    const metadataCategories = [
        ["Toegevoegd", comparison.metadata.toegevoegd],
        ["Gewijzigd", comparison.metadata.gewijzigd],
        ["Expliciet leeggemaakt", comparison.metadata.explicietLeeggemaakt],
        ["Niet meegestuurd", comparison.metadata.nietMeegestuurd],
        ["Ongewijzigd", comparison.metadata.ongewijzigd]
    ];

    metadataCategories.forEach(([label, items]) => {
        console.log(`Metadata ${label}:`);

        if (items.length === 0) {
            console.log("  (geen velden)");
            return;
        }

        items.forEach(item => {
            const proposed =
                Object.prototype.hasOwnProperty.call(item, "proposed")
                    ? ` -> ${displayValue(item.proposed)}`
                    : " (niet meegestuurd; bestaande waarde blijft ongewijzigd)";
            console.log(
                `- ${item.key}: ${displayValue(item.current)}${proposed}`
            );
        });
    });

    if (comparison.contentDetails.exactEqual) {
        console.log("Contentverschil: geen; ruwe strings zijn exact gelijk.");
    } else if (comparison.contentDetails.normalizedEqual) {
        console.log(
            "Contentverschil: alleen formatterings-/whitespaceverschil volgens de leesbare normalisatie; semantische gelijkheid wordt niet geclaimd."
        );
    } else {
        console.log("Content-verschil (HTML-regels):");
        if (comparison.content.length === 0) {
            console.log("  (geen verschillen)");
        } else {
            comparison.content.forEach(line => console.log(line));
        }
    }

    return comparison;

}


async function updateExisting(campingId, payload, applyUpdate) {

    const matches =
        await wordpressPostService.findByCampingId(campingId);
    const page =
        validateExistingPage(matches, payload, campingId);
    const requestBody =
        buildUpdateRequestBody(payload);

    console.log(
        `Bestaande WordPress-pagina ${page.id} gecontroleerd; status blijft draft.`
    );
    console.log(
        `Bij te werken payloadvelden: ${listUpdateFields(payload) || "geen"}.`
    );

    if (!applyUpdate) {
        printComparison(page, requestBody);
        console.log("Update-dry-run: geen WordPress-schrijfverzoek uitgevoerd.");

        return {
            campingId,
            payload,
            page,
            updated: false,
            dryRun: true
        };
    }

    const result =
        await wordpressPostService.updateExisting(
            EXISTING_PAGE_ID,
            requestBody
        );

    if (
        !result ||
        result.ok !== true ||
        result.body?.id !== EXISTING_PAGE_ID ||
        result.body?.status !== "draft" ||
        result.body?.meta?.rzd_camping_id !== campingId
    ) {
        throw new Error(formatServiceError(result));
    }

    console.log(
        `WordPress-pagina ${EXISTING_PAGE_ID} is bijgewerkt en blijft draft.`
    );

    return {
        campingId,
        payload,
        page,
        updated: true,
        result
    };

}


function preparePayload(campingAggregate, campingId) {

    const mapped =
        wordpressMapper.mapCampingAggregate(campingAggregate);

    const prepared =
        wordpressPublisher.preparePage(mapped);

    if (!prepared.ready) {
        const details =
            prepared.errors
                .map(error => `${error.field}: ${error.message}`)
                .join("; ");

        throw new Error(
            `WordPress-payload is niet gereed voor verwerking: ${details}`
        );
    }

    const payload = prepared.payload;

    if (payload?.meta?.rzd_camping_id !== campingId) {
        throw new Error(
            "WordPress-payload bevat geen exact overeenkomende rzd_camping_id."
        );
    }

    return payload;

}


async function run(args = process.argv.slice(2)) {

    const { campingId, publish, updateExisting: updateMode, applyUpdate } =
        parseArgs(args);

    const campingAggregate =
        await campingReadService.getCampingAggregate(campingId);

    const payload =
        preparePayload(campingAggregate, campingId);

    console.log(`Camping ${campingId} is voorbereid als WordPress-concept.`);

    if (updateMode) {
        return updateExisting(campingId, payload, applyUpdate);
    }

    if (!publish) {
        console.log("Dry-run: geen WordPress-aanroep uitgevoerd.");

        return {
            campingId,
            payload,
            published: false
        };
    }

    const result =
        await wordpressPostService.create(payload);

    if (!result || result.ok !== true) {
        throw new Error(formatServiceError(result));
    }

    if (result.reused) {
        console.log(
            `Bestaande WordPress-pagina ${result.body?.id || ""} wordt alleen hergebruikt; de pagina wordt niet automatisch bijgewerkt.`
        );
    } else {
        console.log(
            `Nieuwe WordPress-pagina aangemaakt met status ${result.status}.`
        );
    }

    return {
        campingId,
        payload,
        published: true,
        result
    };

}


if (require.main === module) {

    run().catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    });

}


module.exports = {
    parseArgs,
    preparePayload,
    validateExistingPage,
    buildUpdateRequestBody,
    selectContent,
    hashContent,
    comparePage,
    buildContentDiff,
    updateExisting,
    run
};
