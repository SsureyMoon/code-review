const controllers = require('./controllers');

describe('healthcheck controller', async () => {
    const next = jest.fn();
    let ctx;

    beforeEach(() => {
        ctx = {
            database: {
                client: {
                    healthcheck: jest.fn(),
                },
            },
        };
    });

    test('should check database connection status', async () => {
        await controllers.healthcheck(ctx, next);
        expect(ctx.database.client.healthcheck).toHaveBeenCalled();
        expect(ctx.body).toEqual({ message: 'ok' });
    });

    test('should throw an exeption when the database connection fails', async () => {
        ctx.database.client.healthcheck.mockImplementation(() => {
            throw new Error('DB connection failed');
        });
        expect(controllers.healthcheck(ctx, next)).rejects.toThrowError();
    });
});


describe('books controller', async () => {
    const next = jest.fn();
    let ctx;

    beforeEach(() => {
        ctx = {
            database: {
                client: {
                    saveBook: jest.fn(),
                    listBooks: jest.fn(),
                },
            },
        };
        ctx.database.client.listBooks.mockImplementation(() => []);
    });

    test('should not save doc and return 400 when input is not valid', async () => {
        ctx.validation = {
            isValid: false,
            messages: {
                test: 'message',
            },
        };
        await controllers.postBook(ctx, next);
        expect(ctx.database.client.saveBook).not.toHaveBeenCalled();
        expect(ctx.status).toEqual(400);
        expect(ctx.body).toEqual(ctx.validation.messages);
    });

    test('should save doc and return 201 when input is valid', async () => {
        ctx.validation = {
            isValid: true,
        };
        ctx.sanitizedBody = {
            name: '리눅스 커널 이야기',
            isbn: '9788966264049',
        };
        await controllers.postBook(ctx, next);
        expect(ctx.database.client.saveBook).toHaveBeenCalledWith(ctx.sanitizedBody);
        expect(ctx.status).toEqual(201);
    });

    test('should fetch docs based in the coollection and return the result', async () => {
        ctx.validation = {
            isValid: true,
        };
        await controllers.listBooks(ctx, next);
        expect(ctx.database.client.listBooks).toHaveBeenCalled();
        expect(ctx.status).toEqual(200);
        expect(ctx.body).toEqual([]);
    });
});
