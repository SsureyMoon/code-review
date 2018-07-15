const { aql } = require('arangojs');
const serializers = require('../serializers');

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

    async listBooks() {
        const booksCursor = await this.db.query(aql`
            FOR r IN ${this.collection}
            RETURN r
        `);
        const results = await booksCursor.map(value => serializers.serializeBook(value));
        return results || [];
    }
}

module.exports.DatabaseClient = DatabaseClient;
