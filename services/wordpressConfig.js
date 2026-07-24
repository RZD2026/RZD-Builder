
class WordPressConfig {

    get() {

        return {

            url: process.env.WORDPRESS_URL || "",

            username: process.env.WORDPRESS_USERNAME || "",

            applicationPassword:
                process.env.WORDPRESS_APPLICATION_PASSWORD || "",

            api: "/wp-json/wp/v2",

            defaultStatus: "draft",

            timeout: 10000

        };

    }

}

module.exports = new WordPressConfig();