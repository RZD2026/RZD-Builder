
const config =
    require("./wordpressConfig");

class WordPressPostService {

    async create(post) {

        const settings =
            config.get();

        const credentials =
            Buffer
                .from(
                    `${settings.username}:${settings.applicationPassword}`
                )
                .toString("base64");

        const response =
            await fetch(

                `${settings.url}${settings.api}/posts`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Basic ${credentials}`

                    },

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