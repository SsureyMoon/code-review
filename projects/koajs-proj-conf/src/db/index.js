const arangojs = require('arangojs');

const { database: dbConfig } = require('../config');
const {
    DatabaseClient,
} = require('./client');

// database connection pool
const db = new arangojs.Database({
    url: dbConfig.accessUrl,
}).useDatabase(
    dbConfig.dbName,
).useBasicAuth(
    dbConfig.dbUsername,
    dbConfig.dbPassword,
);

// create the collection if not exist
const collection = db.collection(dbConfig.dbCollection);
collection.get()
    .then(() => {
        console.log('collection exists'); // eslint-disable-line
    })
    .catch(() => {
        console.log('collection will be created'); // eslint-disable-line
        return collection.create();
    })
    .catch(() => {
        throw new Error('DB connection failed');
    });

module.exports = {
    db,
    collection,
    client: new DatabaseClient(db, collection),
};
