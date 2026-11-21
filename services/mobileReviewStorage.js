const fs =
    require("fs");

const path =
    require("path");


const STORAGE_FILE =
    path.join(__dirname, "..", "data", "mobile-reviews.json");

let storageFile = STORAGE_FILE;


function configureStorage(filePath) {

    storageFile = filePath || STORAGE_FILE;

}


function readReviews() {

    if (!fs.existsSync(storageFile)) {
        return {};
    }

    const content =
        fs.readFileSync(storageFile, "utf8");

    if (!content.trim()) {
        return {};
    }

    return JSON.parse(content);

}


function writeReviews(reviews) {

    fs.mkdirSync(path.dirname(storageFile), { recursive: true });
    fs.writeFileSync(
        storageFile,
        JSON.stringify(reviews, null, 2),
        "utf8"
    );

}


function saveReview(review) {

    if (!review || !review.localId) {
        throw new Error(
            "saveReview: localId is verplicht."
        );
    }

    const reviews = readReviews();
    const storedReview = {
        ...review,
        photos: review.photos ?? [],
        syncStatus: review.syncStatus ?? "pending"
    };

    reviews[review.localId] = storedReview;
    writeReviews(reviews);

    return storedReview;

}


function getReview(localId) {

    if (!localId) {
        return null;
    }

    const reviews = readReviews();
    return reviews[localId] || null;

}


function getAllReviews() {

    return Object.values(readReviews());

}


function getPendingReviews() {

    const reviews = readReviews();

    return Object.values(reviews).filter(review =>
        review.syncStatus === "pending" ||
        review.syncStatus === "error"
    );

}


function updateReview(localId, updates) {

    if (!localId) {
        throw new Error(
            "updateReview: localId is verplicht."
        );
    }

    const reviews = readReviews();
    const existingReview = reviews[localId];

    if (!existingReview) {
        return null;
    }

    const updatedReview = {
        ...existingReview,
        ...updates,
        localId
    };

    reviews[localId] = updatedReview;
    writeReviews(reviews);

    return updatedReview;

}


function deleteReview(localId) {

    if (!localId) {
        return false;
    }

    const reviews = readReviews();

    if (!Object.prototype.hasOwnProperty.call(reviews, localId)) {
        return false;
    }

    delete reviews[localId];
    writeReviews(reviews);

    return true;

}


module.exports = {
    configureStorage,
    saveReview,
    getReview,
    getAllReviews,
    getPendingReviews,
    updateReview,
    deleteReview
};
