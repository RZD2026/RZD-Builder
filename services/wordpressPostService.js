
const config =
    require("./wordpressConfig");

class WordPressPostService {

    buildHeaders(settings) {

        const credentials =
            Buffer
                .from(
                    `${settings.username}:${settings.applicationPassword}`
                )
                .toString("base64");

        return {

            "Content-Type":
                "application/json",

            Authorization:
                `Basic ${credentials}`

        };

    }


    async findByCampingId(campingId) {

        const settings =
            config.get();

        const matches = [];
        let page = 1;

        while (true) {

            const url =
                `${settings.url}${settings.api}/pages?context=edit&status=any&per_page=100&page=${page}`;

            const response =
                await fetch(
                    url,
                    {

                        method: "GET",

                        headers: this.buildHeaders(settings)

                    }

                );

            const body = await response.json();

            if (!response.ok) {
                throw new Error(
                    `WordPress lookup failed (${response.status}): ${body?.message || response.statusText}`
                );
            }

            if (!Array.isArray(body)) {
                throw new Error(
                    "WordPress lookup returned an invalid page list."
                );
            }

            matches.push(
                ...body.filter(pageRecord =>
                    Number.isInteger(pageRecord?.id) &&
                    pageRecord.id > 0 &&
                    pageRecord?.meta?.rzd_camping_id === campingId
                )
            );

            const totalPagesHeader =
                response.headers?.get?.("X-WP-TotalPages");
            const totalPages = Number(totalPagesHeader);

            if (
                !Number.isInteger(totalPages) ||
                totalPages < 1
            ) {
                throw new Error(
                    "WordPress lookup returned an invalid X-WP-TotalPages header."
                );
            }

            if (page >= totalPages) {
                return matches;
            }

            page++;

        }

    }

    async create(post) {

        const settings =
            config.get();

        const campingId =
            post?.meta?.rzd_camping_id;

        if (campingId) {

            const matches =
                await this.findByCampingId(campingId);

            if (matches.length > 1) {

                return {

                    ok: false,

                    status: 409,

                    statusText: "Conflict",

                    body: {

                        code: "rzd_duplicate_camping_id",

                        message: `Meerdere WordPress-pagina's hebben rzd_camping_id ${campingId}.`,

                        campingId,

                        pageIds: matches
                            .map(page => page?.id)
                            .filter(Boolean)

                    }

                };

            }

            if (matches.length === 1) {

                return {

                    ok: true,

                    status: 200,

                    statusText: "Existing",

                    body: matches[0],

                    reused: true

                };

            }

        }

        const headers =
            this.buildHeaders(settings);

        const response =
            await fetch(

                `${settings.url}${settings.api}/pages`,

                {

                    method: "POST",

                    headers,

                    body: JSON.stringify(post)

                }

            );

        return {

            ok: response.ok,

            status: response.status,

            statusText: response.statusText,

            body: await response.json()

        };

    }

}

module.exports = new WordPressPostService();