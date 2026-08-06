
const config =
    require("./wordpressConfig");

class WordPressConnection {

    async test() {

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
                `${settings.url}${settings.api}/users/me`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Basic ${credentials}`
                    }
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

module.exports = new WordPressConnection();