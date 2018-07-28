const request = require('supertest');
const app = require('../app');
const db = require('./db');
const { API_VER } = require('./config');

describe('healthcheck endpoint', async () => {
    test('should return 200 OK', async () => {
        const response = await request(app.callback()).get(`/${API_VER}/health`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'ok' });
    });
});

describe('books endpoint', async () => {
    beforeAll(async () => {
        try {
            await db.collection.create();
        } catch (error) {
            if (!error.errorNum === 1207) {
                throw error;
            }
        }
    });

    test('should return 400 for an invalid request', async () => {
        const response = await request(app.callback()).post(`/${API_VER}/books`, {});
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
            name: 'required but not provided',
            isbn: 'required but not provided',
        });
    });

    test('should save a book in the database and return 201 for a valid request', async () => {
        const testObject = {
            name: '리눅스 커널 이야기',
            isbn: '9788966264049',
            publishedAt: '2007-08-16',
        };

        const response = await request(app.callback())
            .post('/v1/books')
            .send(testObject)
            .set('Content-Type', 'application/json');
        expect(response.status).toEqual(201);

        const docs = await db.collection.all();
        expect(docs.count).toBe(1);

        const doc = await docs.next();
        expect(doc).toEqual(expect.objectContaining(testObject));
        expect(response.status).toEqual(201);
    });

    afterEach(async () => {
        // delete all docs in the collection after each test
        await db.collection.truncate();
    });

    afterAll(async () => {
        // drop the collection after all tests
        await db.collection.drop();
    });
});

describe('book list endpoint', async () => {
    beforeAll(async () => {
        try {
            await db.collection.create();
        } catch (error) {
            if (!error.errorNum === 1207) {
                throw error;
            }
        }
    });

    beforeEach(async () => {
        await db.collection.import([
            { name: '리눅스 커널 이야기', isbn: '9788966264049', publishedAt: '2007-08-16' },
            { name: '전문가를 위한 파이썬', isbn: '9788968484988', publishedAt: '2016-08-12' },
            { name: 'Python Cookbook', isbn: '9788992649681', publishedAt: '2014-01-17' },
        ]);
    });

    test('should return book list', async () => {
        const response = await request(app.callback())
            .get(`/${API_VER}/books`);
        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(3);
    });

    afterEach(async () => {
        // delete all docs in the collection after each test
        await db.collection.truncate();
    });

    afterAll(async () => {
        // drop the collection after all tests
        await db.collection.drop();
    });
});
