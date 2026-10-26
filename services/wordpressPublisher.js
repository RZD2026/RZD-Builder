class WordPressPublisher {

    prepare(post = {}) {

        return this.preparePage(post);

    }


    preparePage(page = {}) {

        return {

            ready: true,

            payload: page

        };

    }

}

module.exports = new WordPressPublisher();
