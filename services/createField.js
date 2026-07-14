
require("dotenv").config();

class CreateFieldService {

    async create(tableId, field) {

        console.log("");
        console.log("================================");
        console.log("Create Field Service");
        console.log("================================");
        console.log("");

        console.log("Tabel ID : " + tableId);
        console.log("Veld     : " + field.name);
        console.log("Type     : " + field.type);

        console.log("");
        console.log("Schrijffunctie volgt in de volgende versie.");
        console.log("");

        return true;

    }

}

module.exports = new CreateFieldService();