const {
    validateWordPressPayload
} = require("./wordpressPayloadValidator");


class WordPressPublisher {

    prepare(post = {}) {

        const errors =
            validateWordPressPayload(post, {
                mode: "generic"
            });

        return {

            ready: errors.length === 0,

            payload: post,

            errors

        };

    }


    preparePage(page = {}) {

        const errors =
            validateWordPressPayload(page, {
                mode: "campingPage"
            });

        return {

            ready: errors.length === 0,

            payload: page,

            errors

        };

    }

}

module.exports = new WordPressPublisher();
