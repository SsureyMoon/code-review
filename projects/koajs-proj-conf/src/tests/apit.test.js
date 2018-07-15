const request = require('supertest');
const app = require('../../app');
const { API_VER } = require('../config');

describe('healthcheck endpoint', async () => {
    test('should return 200 OK', async () => {
        const response = await request(app.callback()).get(`/${API_VER}/health`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'ok' });
    });
});
