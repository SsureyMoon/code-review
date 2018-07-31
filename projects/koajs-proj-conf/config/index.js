const API_VER = 'v1';

const environment = process.env.NODE_ENV || 'develop';

const database = {
    accessUrl: process.env.DB_ACCESS_URL || 'http+tcp://127.0.0.1:8529',
    dbName: process.env.DB_NAME || 'defaultdb',
    dbUsername: process.env.DB_USERNAME || 'defaultuser',
    dbPassword: process.env.DB_PASSWORD || 'defaultpassword',
    dbCollection: 'books',
};

if (environment === 'test') {
    database.dbCollection = 'books_test';
}

module.exports = {
    API_VER,
    environment,
    database,
};
