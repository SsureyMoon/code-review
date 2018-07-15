class DatabaseClient {
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
    }

    async healthcheck() {
        await this.collection.get();
    }

    async saveBook(sanitizedBody) {
        await this.collection.save(sanitizedBody);
    }
}

module.exports.DatabaseClient = DatabaseClient;
