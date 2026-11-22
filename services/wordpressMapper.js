
const pointMappings =
    require("../content/mapping/pointMappings");

const airtablePointResolver =
    require("../content/mapping/airtablePointResolver");


const PARKING_POINT_MAPPINGS_BY_ID = new Map(
    Object.values(pointMappings)
        .filter(mapping =>
            mapping.status === "EXACT" &&
            mapping.airtable?.module === "Parkeren" &&
            typeof mapping.airtable.recordId === "string"
        )
        .map(mapping => [
            mapping.airtable.recordId,
            mapping
        ])
);

const PARKING_POINT_MAPPINGS_BY_NAME = new Map(
    [...PARKING_POINT_MAPPINGS_BY_ID.values()]
        .map(mapping => [mapping.airtable.name, mapping])
);


class WordPressMapper {

    escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }


    hasValue(value) {

        return value !== undefined &&
            value !== null &&
            value !== "";

    }

    hasMeaningfulValue(value) {

        if (typeof value === "string") {
            return value.trim() !== "";
        }

        if (Array.isArray(value)) {
            return value.some(item => this.hasMeaningfulValue(item));
        }

        return this.hasValue(value);

    }


    reviewChoiceText(review) {

        if (Array.isArray(review.keuzeOpties)) {
            const texts = review.keuzeOpties
                .map(choice => choice?.tekst)
                .filter(text =>
                    typeof text === "string" &&
                    text.trim() !== ""
                );

            return texts.length > 0 ? texts.join(", ") : undefined;
        }

        return Array.isArray(review.keuze)
            ? undefined
            : review.keuze;

    }


    pageValue(label, value) {

        return this.hasMeaningfulValue(value)
            ? `<dt>${this.escapeHtml(label)}</dt><dd>${this.escapeHtml(value)}</dd>`
            : "";

    }

    pageMeaningfulValue(label, value) {

        return this.hasMeaningfulValue(value)
            ? this.pageValue(label, value)
            : "";

    }


    pagePhoto(photo, alt) {

        const url = typeof photo === "object"
            ? photo?.url
            : photo;

        if (!this.hasMeaningfulValue(url)) {
            return "";
        }

        const filename = typeof photo === "object" &&
            this.hasMeaningfulValue(photo?.filename)
            ? photo.filename
            : alt;

        return `<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(filename)}">`;

    }


    pageReview(review = {}, heading = "Beoordeling", moduleHint) {

        const point = review.beoordelingspunt || {};
        const moduleName = point.module || moduleHint;
        const parkingMapping =
            PARKING_POINT_MAPPINGS_BY_ID.get(point.id);
        const unlinkedParkingMapping =
            !point.id
                ? PARKING_POINT_MAPPINGS_BY_NAME.get(point.naam)
                : undefined;
        const isParkingContext =
            moduleName === "Parkeren" ||
            Boolean(parkingMapping) ||
            (!moduleName && Boolean(unlinkedParkingMapping));

        if (isParkingContext) {
            if (!airtablePointResolver.matchesConfiguredPoint(
                parkingMapping,
                {
                    recordId: point.id,
                    moduleName,
                    name: point.naam
                }
            )) {
                return "";
            }
        }

        const pointName =
            parkingMapping
                ? parkingMapping.airtable.name
                : point.naam || heading;
        const pointDescription = this.hasMeaningfulValue(point.omschrijving)
            ? `<p class="review-description"><strong>Omschrijving:</strong> ${this.escapeHtml(point.omschrijving)}</p>`
            : "";
        const pointClarification = this.hasMeaningfulValue(point.toelichting)
            ? `<p class="review-clarification"><strong>Toelichting:</strong> ${this.escapeHtml(point.toelichting)}</p>`
            : "";
        const isConfirmed = review.status === "Beoordeeld";
        const values = [
            review.waarde,
            this.reviewChoiceText(review)
        ]
            .filter(value => this.hasMeaningfulValue(value))
            .map(value => `<p><strong>${isConfirmed ? "Feit" : "Waarde (niet bevestigd)"}:</strong> ${this.escapeHtml(value)}</p>`)
            .join("");
        const note = this.hasMeaningfulValue(review.opmerking)
            ? `<p>${isConfirmed ? "" : "<strong>Opmerking (niet bevestigd):</strong> "}${this.escapeHtml(review.opmerking)}</p>`
            : "";
        const photos = Array.isArray(review.fotos)
            ? review.fotos.map(item => this.pagePhoto(item, pointName)).filter(Boolean)
            : [];
        const photo = photos.length > 0
            ? `${isConfirmed ? "" : "<p><strong>Foto (niet bevestigd)</strong></p>"}${photos.join("")}`
            : "";
        const content = `${values}${note}${photo}`;

        if (!content) {
            return "";
        }

        const status = `<p class="review-status"><strong>${this.hasMeaningfulValue(review.status)
            ? `Status: ${this.escapeHtml(review.status)}${isConfirmed ? "" : " — informatie niet bevestigd."}`
            : "Status niet vastgelegd — informatie niet bevestigd."}</strong></p>`;

        return `<article><h4>${this.escapeHtml(pointName)}</h4>${pointDescription}${pointClarification}${status}${content}</article>`;

    }

    pagePracticalNote(note = {}) {

        const hasSubject = this.hasMeaningfulValue(note.onderwerp);
        const hasDescription = this.hasMeaningfulValue(note.omschrijving);

        if (!hasSubject && !hasDescription) {
            return "";
        }

        const subject = hasSubject
            ? `<h4>${this.escapeHtml(note.onderwerp)}</h4>`
            : "";
        const description = hasDescription
            ? `<p>${this.escapeHtml(note.omschrijving)}</p>`
            : "";
        const module = this.hasMeaningfulValue(note.module)
            ? this.pageValue("Module", note.module)
            : "";
        const moduleDetails = module ? `<dl>${module}</dl>` : "";

        return `<article class="practical-note"><p><strong>Praktische opmerking — niet formeel beoordeelde toegankelijkheidsinformatie.</strong></p>${subject}${description}${moduleDetails}</article>`;

    }


    pageAssessmentsets(assessmentsets = []) {

        return assessmentsets.map(assessmentset => {

            const reviews = Array.isArray(assessmentset.beoordelingen)
                ? assessmentset.beoordelingen
                    .map(review =>
                        this.pageReview(review, "Beoordeling", assessmentset.naam)
                    )
                    .filter(Boolean)
                    .join("")
                : "";

            return reviews
                ? `<article><h3>${this.escapeHtml(assessmentset.naam)}</h3>${reviews}</article>`
                : "";

        }).filter(Boolean).join("");

    }


    buildPageContent(campingAggregate = {}) {

        const camping = campingAggregate;
        const location = camping.locatie || {};
        const contact = camping.contact || {};
        const firstPhoto = Array.isArray(camping.fotos)
            ? this.pagePhoto(camping.fotos[0], camping.naam || "Accommodatie")
            : "";
        const accommodationInfo = [
            this.pageValue("Type", camping.type),
            this.pageValue("Land", location.land),
            this.pageValue("Regio", location.regio),
            this.pageValue("Plaats", location.plaats),
            this.pageValue("Website", contact.website),
            this.pageValue("Telefoon", contact.telefoon),
            this.pageValue("E-mail", contact.email)
        ].join("");
        const attention = this.hasMeaningfulValue(camping.aandachtspunten)
            ? `<section><h2>Praktische aandachtspunten</h2><p>${this.escapeHtml(camping.aandachtspunten)}</p></section>`
            : "";
        const assessmentsetContent = this.pageAssessmentsets(camping.assessmentsets);
        const assessmentsetReviews = Array.isArray(camping.assessmentsets)
            ? camping.assessmentsets.flatMap(assessmentset =>
                Array.isArray(assessmentset.beoordelingen)
                    ? assessmentset.beoordelingen
                    : []
            )
            : [];
        const assessmentsetReviewIds = new Set();
        const assessmentsetReviewObjects = new Set();

        assessmentsetReviews.forEach(review => {
            assessmentsetReviewObjects.add(review);
            if (typeof review?.id === "string" && review.id !== "") {
                assessmentsetReviewIds.add(review.id);
            }
        });

        const seenCampingReviewIds = new Set();
        const seenCampingReviewObjects = new Set();
        const campingReviews = Array.isArray(camping.campingBeoordelingen)
            ? camping.campingBeoordelingen.filter(review => {
                const reviewId = typeof review?.id === "string"
                    ? review.id
                    : "";

                if (reviewId) {
                    if (seenCampingReviewIds.has(reviewId)) {
                        return false;
                    }
                    seenCampingReviewIds.add(reviewId);
                    return true;
                }

                if (seenCampingReviewObjects.has(review)) {
                    return false;
                }
                seenCampingReviewObjects.add(review);
                return true;
            })
            : [];

        const renderCampingReviews = reviews =>
            reviews
                .map(review =>
                    this.pageReview(
                        review,
                        "Beoordeling",
                        review.beoordelingspunt?.module
                    )
                )
                .filter(Boolean)
                .join("");

        const additionalReviewsByModule = new Map();
        campingReviews.forEach(review => {
            const reviewId = typeof review?.id === "string"
                ? review.id
                : "";
            const isInAssessmentset = reviewId
                ? assessmentsetReviewIds.has(reviewId)
                : assessmentsetReviewObjects.has(review);

            if (isInAssessmentset) {
                return;
            }

            const moduleName =
                review.beoordelingspunt?.module || "Overige module";
            if (!additionalReviewsByModule.has(moduleName)) {
                additionalReviewsByModule.set(moduleName, []);
            }
            additionalReviewsByModule.get(moduleName).push(review);
        });

        const additionalReviewContent = [...additionalReviewsByModule.entries()]
            .map(([moduleName, reviews]) => {
                const content = renderCampingReviews(reviews);
                return content
                    ? `<article><h3>${this.escapeHtml(moduleName)}</h3>${content}</article>`
                    : "";
            })
            .filter(Boolean)
            .join("");

        const campingReviewContent =
            renderCampingReviews(campingReviews);
        const assessmentsets = assessmentsetContent
            ? `${assessmentsetContent}${additionalReviewContent}`
            : campingReviewContent
                ? `<article><h3>Beoordelingen</h3>${campingReviewContent}</article>`
                : "";
        const experiences = Array.isArray(camping.reizigerservaringen)
            ? camping.reizigerservaringen
                .filter(experience =>
                    [
                        experience.ervaring,
                        experience.reizigerstype,
                        experience.positief,
                        experience.aandachtspunt,
                        experience.datumErvaring
                    ].some(value => this.hasMeaningfulValue(value))
                )
                .map(experience =>
                    `<article>${this.pageValue("Ervaring", experience.ervaring)}${this.pageValue("Reizigerstype", experience.reizigerstype)}${this.pageValue("Positief", experience.positief)}${this.pageValue("Aandachtspunt", experience.aandachtspunt)}${this.pageValue("Datum", experience.datumErvaring)}</article>`
                )
                .join("")
            : "";
        const notes = Array.isArray(camping.opmerkingen)
            ? camping.opmerkingen
                .map(note => this.pagePracticalNote(note))
                .filter(Boolean)
                .join("")
            : "";
        const accommodationLayer = camping.accommodatieLaag
            ? `<div class="accommodation-layer"><h3>Accommodatielaag</h3><dl>${this.pageValue("Aangepaste accommodatie aanwezig", camping.accommodatieLaag.aangepasteAccommodatieAanwezig)}${this.pageValue("Type", camping.accommodatieLaag.typeAangepasteAccommodatie)}${this.pageValue("Opmerking", camping.accommodatieLaag.opmerking)}</dl></div>`
            : "";
        const provisions = Array.isArray(camping.voorzieningen)
            ? camping.voorzieningen.map(provision => {
                const reviews = Array.isArray(provision.beoordelingen)
                    ? provision.beoordelingen
                        .map(review => this.pageReview(review))
                        .filter(Boolean)
                        .join("")
                    : "";
                const reviewContent = reviews
                    ? `<div class="provision-assessments"><h4>Beoordelingen</h4>${reviews}</div>`
                    : "";

                const details = [
                    this.pageMeaningfulValue("Type", provision.type),
                    this.pageMeaningfulValue("Status (niet bevestigd)", provision.status),
                    this.pageMeaningfulValue("Opmerking (niet bevestigd)", provision.opmerking)
                ].join("");
                const provisionDetails = details ? `<dl>${details}</dl>` : "";
                const provisionName = this.hasMeaningfulValue(provision.naam)
                    ? provision.naam
                    : undefined;

                if (!provisionName && !provisionDetails && !reviewContent) {
                    return "";
                }

                return `<article><h3>${this.escapeHtml(provisionName || "Voorziening")}</h3>${provisionDetails}${reviewContent}</article>`;
            }).filter(Boolean).join("")
            : "";
        const experiencesAndNotes = experiences || notes || provisions || accommodationLayer
            ? `<section><h2>Ervaringen &amp; aandachtspunten</h2>${experiences ? `<div><h3>Reizigerservaringen</h3>${experiences}</div>` : ""}${notes ? `<div><h3>Opmerkingen</h3>${notes}</div>` : ""}${provisions ? `<div><h3>Voorzieningen</h3>${provisions}</div>` : ""}${accommodationLayer ? accommodationLayer : ""}</section>`
            : "";

        return `${firstPhoto || accommodationInfo
            ? `<section><div class="accommodation-info">${firstPhoto ? `<div>${firstPhoto}</div>` : ""}<div><dl>${accommodationInfo}</dl></div></div></section>`
            : ""}${attention}${assessmentsets ? `<section><h2>RZD-beoordelingen</h2>${assessmentsets}</section>` : ""}${experiencesAndNotes}<section><h2>No Surprises</h2><p>Geen marketingpraat, maar praktische informatie.</p></section><section><h2>RZD</h2><p>RZD beschrijft wat bekend, onbekend en waargenomen is.</p></section><footer>RZD</footer>`;

    }
    mapPresentFields(source, fieldNames) {

        const target = {};

        fieldNames.forEach(fieldName => {

            if (Object.prototype.hasOwnProperty.call(source, fieldName)) {
                target[fieldName] = source[fieldName];
            }

        });

        return target;

    }


    mapReview(review = {}) {

        const mapped = {
            ...review
        };
        delete mapped.verbeterpunten;
        delete mapped.Verbeterpunten;

        if (Object.prototype.hasOwnProperty.call(review, "beoordelingspunt")) {
            mapped.beoordelingspunt = {
                ...review.beoordelingspunt
            };
            delete mapped.beoordelingspunt.verbeterpunten;
            delete mapped.beoordelingspunt.Verbeterpunten;
        }

        return mapped;

    }


    mapProvision(provision = {}) {

        const mapped = {
            ...provision
        };
        delete mapped.verbeterpunten;
        delete mapped.Verbeterpunten;

        if (Object.prototype.hasOwnProperty.call(provision, "beoordelingen")) {
            mapped.beoordelingen = provision.beoordelingen.map(review =>
                this.mapReview(review)
            );
        }

        return mapped;

    }


    mapCampingAggregate(campingAggregate = {}) {

        const camping =
            this.mapPresentFields(
                campingAggregate,
                ["id", "naam", "type", "locatie", "contact"]
            );

        camping.fotos = campingAggregate.fotos || [];

        const mapped = {
            status: "draft",
            meta: {
                camping,
                rzd_camping_id: campingAggregate.id || ""
            }
        };

        if (Object.prototype.hasOwnProperty.call(campingAggregate, "naam")) {
            mapped.title = campingAggregate.naam;
        }

        if (Object.prototype.hasOwnProperty.call(campingAggregate, "assessmentsets")) {
            mapped.meta.assessmentsets = campingAggregate.assessmentsets.map(assessmentset => {
                const mappedAssessmentset = {
                    ...assessmentset
                };
                delete mappedAssessmentset.verbeterpunten;
                delete mappedAssessmentset.Verbeterpunten;

                if (Array.isArray(assessmentset.beoordelingen)) {
                    mappedAssessmentset.beoordelingen = assessmentset.beoordelingen
                        .filter(review => review.status !== "Nog niet beoordeeld")
                        .map(review => this.mapReview(review));
                }

                return mappedAssessmentset;
            });
        }

        if (Object.prototype.hasOwnProperty.call(campingAggregate, "campingBeoordelingen")) {
            mapped.meta.campingBeoordelingen = campingAggregate.campingBeoordelingen.map(review =>
                this.mapReview(review)
            );
        }

        if (Object.prototype.hasOwnProperty.call(campingAggregate, "voorzieningen")) {
            mapped.meta.voorzieningen = campingAggregate.voorzieningen.map(provision =>
                this.mapProvision(provision)
            );
        }

        if (Object.prototype.hasOwnProperty.call(campingAggregate, "accommodatieLaag")) {
            mapped.meta.accommodatieLaag = {
                ...campingAggregate.accommodatieLaag
            };
        }

        mapped.meta.reizigerservaringen =
            campingAggregate.reizigerservaringen || [];

        mapped.meta.opmerkingen =
            campingAggregate.opmerkingen || [];

        mapped.meta.aandachtspunten = campingAggregate.aandachtspunten || "";

        mapped.content = this.buildPageContent(campingAggregate);

        return mapped;

    }


    mapAccommodation(record = {}) {

        return {

            title: record.Naam || "",

            status: "draft",

            meta: {

                land: record.Land || "",

                regio: record.Regio || "",

                plaats: record.Plaats || "",

                adres: record.Adres || "",

                website: record.Website || "",

                telefoon: record.Telefoon || "",

                email: record["E-mail"] || "",

                gps: record.GPS || ""

            }

        };

    }

}

module.exports = new WordPressMapper();