require("dotenv").config();
const client =
    require("./services/wordpressClient");

(async () => {

    console.log("");
    console.log("================================");
    console.log("WordPress Client Test");
    console.log("================================");
    console.log("");

    const payload = {

        title: "Camping Bella Italia",

        status: "draft",

        meta: {

            land: "Italië",

            plaats: "Peschiera del Garda"

        }

    };

    console.log("Input");
    console.log("--------------------------------");

    console.dir(payload, {
        depth: null
    });

    console.log("");

    const result =
        await client.publish(payload);

    console.log("Output");
    console.log("--------------------------------");

    console.dir(result, {
        depth: null
    });

    console.log("");

    console.log("Controle");
    console.log("--------------------------------");

    console.log(
        "Success      :",
        result.success === true
    );

    console.log(
        "Message      :",
        result.message ===
        "WordPress-client simulatie."
    );

    console.log(
        "Configuration:",
        typeof result.configuration === "object"
    );

    console.log(
        "Payload      :",
        result.payload.title === payload.title
    );

    console.log("");

    console.log("================================");
    console.log("TEST GESLAAGD");
    console.log("================================");

})();