const crypto =
    require("crypto");


const CANONICALIZATION_VERSION =
    1;


class CanonicalizationError extends Error {

    constructor(message) {

        super(message);
        this.name = "CanonicalizationError";

    }

}


function isPlainObject(value) {

    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
    }

    const prototype =
        Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;

}


function canonicalize(value, ancestors = new Set()) {

    if (
        value === null ||
        typeof value === "string" ||
        typeof value === "boolean"
    ) {
        return JSON.stringify(value);
    }

    if (typeof value === "number") {

        if (!Number.isFinite(value)) {
            throw new CanonicalizationError(
                "Plan bevat een niet-eindig getal."
            );
        }

        return JSON.stringify(Object.is(value, -0) ? 0 : value);

    }

    if (typeof value !== "object") {
        throw new CanonicalizationError(
            "Plan bevat een niet-JSON-waarde."
        );
    }

    if (ancestors.has(value)) {
        throw new CanonicalizationError(
            "Plan bevat een cyclische waarde."
        );
    }

    ancestors.add(value);

    try {

        if (Array.isArray(value)) {

            const ownKeys =
                Reflect.ownKeys(value);

            for (const key of ownKeys) {

                if (typeof key === "symbol") {
                    throw new CanonicalizationError(
                        "Plan bevat een array met aanvullende properties."
                    );
                }

                if (key === "length") {
                    continue;
                }

                if (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= value.length) {
                    throw new CanonicalizationError(
                        "Plan bevat een array met aanvullende properties."
                    );
                }

                const descriptor =
                    Object.getOwnPropertyDescriptor(value, key);

                if (
                    !descriptor ||
                    !descriptor.enumerable ||
                    !Object.prototype.hasOwnProperty.call(descriptor, "value")
                ) {
                    throw new CanonicalizationError(
                        "Planarrays mogen geen accessors bevatten."
                    );
                }

            }

            const items = [];

            for (let index = 0; index < value.length; index++) {

                if (!Object.prototype.hasOwnProperty.call(value, index)) {
                    throw new CanonicalizationError(
                        "Plan bevat een sparse array."
                    );
                }

                const descriptor =
                    Object.getOwnPropertyDescriptor(value, String(index));

                items.push(canonicalize(descriptor.value, ancestors));

            }

            return `[${items.join(",")}]`;

        }

        if (!isPlainObject(value)) {
            throw new CanonicalizationError(
                "Planobjecten moeten plain JSON-objecten zijn."
            );
        }

        const ownKeys =
            Reflect.ownKeys(value);

        for (const key of ownKeys) {

            if (typeof key !== "string") {
                throw new CanonicalizationError(
                    "Planobjecten mogen geen symbol-properties bevatten."
                );
            }

            const descriptor =
                Object.getOwnPropertyDescriptor(value, key);

            if (
                !descriptor ||
                !descriptor.enumerable ||
                !Object.prototype.hasOwnProperty.call(descriptor, "value")
            ) {
                throw new CanonicalizationError(
                    "Planobjecten mogen geen verborgen properties of accessors bevatten."
                );
            }

        }

        const keys =
            ownKeys.sort();

        const entries = [];

        for (const key of keys) {

            const descriptor =
                Object.getOwnPropertyDescriptor(value, key);

            if (!descriptor || descriptor.value === undefined) {
                throw new CanonicalizationError(
                    "Planobjecten mogen geen accessors of undefined-waarden bevatten."
                );
            }

            entries.push(
                `${JSON.stringify(key)}:${canonicalize(descriptor.value, ancestors)}`
            );

        }

        return `{${entries.join(",")}}`;

    } finally {

        ancestors.delete(value);

    }

}


function hashValue(domain, value) {

    const serialized =
        canonicalize(value);

    return crypto
        .createHash("sha256")
        .update(
            `rzd-production-mutation-plan:${CANONICALIZATION_VERSION}:${domain}\0${serialized}`,
            "utf8"
        )
        .digest("hex");

}


function buildCanonicalPlan({
    intent,
    operations,
    blocked = [],
    summary = {}
}) {

    if (!Array.isArray(operations)) {
        throw new CanonicalizationError(
            "Planoperaties moeten een array zijn."
        );
    }

    if (!Array.isArray(blocked)) {
        throw new CanonicalizationError(
            "Geblokkeerde planpunten moeten een array zijn."
        );
    }

    const preparedOperations =
        operations.map((operation, sequence) => {

            if (!isPlainObject(operation)) {
                throw new CanonicalizationError(
                    `Planoperatie ${sequence} moet een plain object zijn.`
                );
            }

            const {
                system,
                action,
                target,
                payload
            } = operation;

            if (
                typeof system !== "string" ||
                !system ||
                typeof action !== "string" ||
                !action ||
                !isPlainObject(target) ||
                !isPlainObject(payload)
            ) {
                throw new CanonicalizationError(
                    `Planoperatie ${sequence} mist system, action, target of payload.`
                );
            }

            const payloadHash =
                hashValue("payload", payload);

            const operationId =
                `op-${sequence}-${hashValue(
                    "operation",
                    {
                        sequence,
                        system,
                        action,
                        target,
                        payloadHash
                    }
                ).slice(0, 20)}`;

            return {
                operationId,
                sequence,
                system,
                action,
                target,
                payloadHash,
                payload
            };

        });

    const document = {
        canonicalizationVersion: CANONICALIZATION_VERSION,
        intent,
        summary,
        blocked,
        operations: preparedOperations.map(operation => ({
            operationId: operation.operationId,
            sequence: operation.sequence,
            system: operation.system,
            action: operation.action,
            target: operation.target,
            payloadHash: operation.payloadHash
        }))
    };

    const fingerprint =
        hashValue("plan", document);

    return {
        canonicalizationVersion: CANONICALIZATION_VERSION,
        document,
        fingerprint,
        operations: preparedOperations
    };

}


module.exports = {
    CANONICALIZATION_VERSION,
    CanonicalizationError,
    buildCanonicalPlan,
    canonicalize,
    hashValue,
    isPlainObject
};
