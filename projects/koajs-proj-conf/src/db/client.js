class DatabaseClient {
    constructor(db, collection) {
        this.db = db;
        this.collection = collection;
    }

    async healthcheck() {
        await this.collection.get();
    }
}

module.exports.DatabaseClient = DatabaseClient;
