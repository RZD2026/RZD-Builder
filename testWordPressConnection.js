
require("dotenv").config();

const connection =
    require("./services/wordpressConnection");

(async () => {

    console.log("");
    console.log("================================");
    console.log("WordPress Connection Test");
    console.log("================================");
    console.log("");

    try {

        const result =
            await connection.test();

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

        console.log("================================");
        console.log("TEST VOLTOOID");
        console.log("================================");

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