
class Registry {

    constructor() {

        this.services = new Map();

    }

    register(name, service) {

        this.services.set(name, service);

    }

    get(name) {

        if (!this.services.has(name)) {

            throw new Error(`Service '${name}' is niet geregistreerd.`);

        }

        return this.services.get(name);

    }

    has(name) {

        return this.services.has(name);

    }

}

module.exports = Registry;