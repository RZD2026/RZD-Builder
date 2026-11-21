const REQUIRED_METHODS = [
    "createPlan",
    "getPlan",
    "claimPlan",
    "startOperation",
    "finishOperation",
    "finishPlan",
    "close"
];


function assertPlanStore(store) {

    if (!store || typeof store !== "object") {
        throw new TypeError("PlanStore-implementatie ontbreekt.");
    }

    const missingMethods =
        REQUIRED_METHODS.filter(method =>
            typeof store[method] !== "function"
        );

    if (missingMethods.length > 0) {
        throw new TypeError(
            `PlanStore-implementatie mist methoden: ${missingMethods.join(", ")}.`
        );
    }

    return store;

}


module.exports = {
    REQUIRED_METHODS,
    assertPlanStore
};
