class WordPressPublisher {

    prepare(post = {}) {

        return {

            ready: true,

            payload: post

        };

    }

}

module.exports = new WordPressPublisher();
