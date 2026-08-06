
require("dotenv").config();

const postService =
    require("./services/wordpressPostService");

(async () => {

    console.log("");
    console.log("================================");
    console.log("WordPress Post Service Test");
    console.log("================================");
    console.log("");

    const post = {

        title: "RZD Test Accommodatie",

        content:
            "<p>Dit is de eerste automatische publicatie vanuit de RZD Builder.</p>",

        status: "draft"

    };

    console.log("Concept");
    console.log("--------------------------------");

    console.dir(post, {
        depth: null
    });

    console.log("");

    try {

        const result =
            await postService.create(post);

        console.log("Resultaat");
        console.log("--------------------------------");

        console.log("HTTP Status :", result.status);
        console.log("OK          :", result.ok);

        console.log("");

        console.log("Response");
        console.log("--------------------------------");

        console.dir(result.body, {
            depth: null
        });

        console.log("");

        if (result.ok) {

            console.log("================================");
            console.log("CONCEPT SUCCESVOL AANGEMAAKT");
            console.log("================================");

            console.log("");
            console.log("Post ID :", result.body.id);
            console.log("Titel   :", result.body.title.rendered);
            console.log("Status  :", result.body.status);
            console.log("Link    :", result.body.link);

        }

        else {

            console.log("");
            console.log("PUBLICATIE MISLUKT");

        }

    }

    catch (err) {

        console.log("");
        console.log("================================");
        console.log("FOUT");
        console.log("================================");
        console.log("");

        console.log(err);

    }

})();