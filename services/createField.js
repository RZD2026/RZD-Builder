
async createField(tableName, field) {

    const tableId = await this.getTableId(tableName);

    console.log(`➕ Veld aanmaken: ${field.name}`);

    try {

        const response = await axios.post(
            `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}/fields`,
            {
                name: field.name,
                type: field.type
            },
            {
                headers
            }
        );

        console.log(`✅ Aangemaakt: ${response.data.name}`);

        return response.data;

    } catch (error) {

        console.log("");
        console.log("===== AIRTABLE ERROR =====");

        if (error.response) {
            console.dir(error.response.data, { depth: null });
        } else {
            console.log(error.message);
        }

        throw error;

    }

}