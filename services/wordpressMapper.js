
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


    pageValue(label, value) {

        return this.hasValue(value)
            ? `<dt>${this.escapeHtml(label)}</dt><dd>${this.escapeHtml(value)}</dd>`
            : "";

    }


    pagePhoto(photo, alt) {

        const url = typeof photo === "object"
            ? photo?.url
            : photo;

        if (!this.hasValue(url)) {
            return "";
        }

        const filename = typeof photo === "object" &&
            this.hasValue(photo?.filename)
            ? photo.filename
            : alt;

        return `<img src="${this.escapeHtml(url)}" alt="${this.escapeHtml(filename)}">`;

    }


    pageReview(review = {}) {

        if (review.status === "Nog niet beoordeeld") {
            return "";
        }

        const point = review.beoordelingspunt || {};
        const values = [review.waarde, review.keuze]
            .filter(value => this.hasValue(value))
            .map(value => `<p><strong>Feit:</strong> ${this.escapeHtml(value)}</p>`)
            .join("");
        const note = this.hasValue(review.opmerking)
            ? `<p>${this.escapeHtml(review.opmerking)}</p>`
            : "";
        const photo = Array.isArray(review.fotos)
            ? review.fotos.map(item => this.pagePhoto(item, point.naam || "Beoordeling")).join("")
            : "";

        return `<article><h4>${this.escapeHtml(point.naam || "Beoordeling")}</h4>${values}${note}${photo}</article>`;

    }


    pageAssessmentsets(assessmentsets = []) {

        return assessmentsets.map(assessmentset => {

            const reviews = Array.isArray(assessmentset.beoordelingen)
                ? assessmentset.beoordelingen
                    .filter(review => review.status !== "Nog niet beoordeeld")
                    .map(review => this.pageReview(review))
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
        const attention = this.hasValue(camping.aandachtspunten)
            ? `<section><h2>Praktische aandachtspunten</h2><p>${this.escapeHtml(camping.aandachtspunten)}</p></section>`
            : "";
        const assessmentsets = this.pageAssessmentsets(camping.assessmentsets);
        const experiences = Array.isArray(camping.reizigerservaringen)
            ? camping.reizigerservaringen.map(experience =>
                `<article>${this.pageValue("Ervaring", experience.ervaring)}${this.pageValue("Reizigerstype", experience.reizigerstype)}${this.pageValue("Positief", experience.positief)}${this.pageValue("Aandachtspunt", experience.aandachtspunt)}${this.pageValue("Datum", experience.datumErvaring)}</article>`
            ).join("")
            : "";
        const notes = Array.isArray(camping.opmerkingen)
            ? camping.opmerkingen.map(note =>
                `<article>${this.pageValue(note.onderwerp || "Opmerking", note.omschrijving)}${this.pageValue("Module", note.module)}</article>`
            ).join("")
            : "";
        const accommodationLayer = camping.accommodatieLaag
            ? `<div class="accommodation-layer"><h3>Accommodatielaag</h3><dl>${this.pageValue("Aangepaste accommodatie aanwezig", camping.accommodatieLaag.aangepasteAccommodatieAanwezig)}${this.pageValue("Type", camping.accommodatieLaag.typeAangepasteAccommodatie)}${this.pageValue("Opmerking", camping.accommodatieLaag.opmerking)}</dl></div>`
            : "";
        const provisions = Array.isArray(camping.voorzieningen)
            ? camping.voorzieningen.map(provision =>
                `<article><h3>${this.escapeHtml(provision.naam || "Voorziening")}</h3><dl>${this.pageValue("Type", provision.type)}${this.pageValue("Status", provision.status)}${this.pageValue("Opmerking", provision.opmerking)}</dl></article>`
            ).join("")
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

        if (Object.prototype.hasOwnProperty.call(review, "beoordelingspunt")) {
            mapped.beoordelingspunt = {
                ...review.beoordelingspunt
            };
        }

        return mapped;

    }


    mapProvision(provision = {}) {

        const mapped = {
            ...provision
        };

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