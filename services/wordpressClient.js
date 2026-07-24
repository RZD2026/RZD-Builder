
const config =
    require("./wordpressConfig");

class WordPressClient {

    async publish(payload = {}) {

        const settings =
            config.get();

        return {

            success: true,

            message: "WordPress-client simulatie.",

            configuration: settings,

            payload

        };

    }

}

module.exports = new WordPressClient();