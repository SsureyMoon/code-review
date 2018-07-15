const { DatabaseClient } = require('../db/client');

describe('database client', async () => {
    let db;
    let collection;
    let client;

    beforeEach(() => {
        db = {
            query: jest.fn(),
        };
        db.query.mockImplementation(() => []);

        collection = {
            get: jest.fn(),
            save: jest.fn(),
        };

        client = new DatabaseClient(db, collection);
    });

    test('healthcheck should check if the database collection is reachable', async () => {
        await client.healthcheck();
        expect(collection.get).toHaveBeenCalled();
    });

    test('saveBook should call save method on the collection', async () => {
        const testData = {
            test: 'test1',
            test1234: 'test1234.1234.io',
            num: 12123212,
        };
        await client.saveBook(testData);
        expect(collection.save).toHaveBeenCalledWith(testData);
    });
});
