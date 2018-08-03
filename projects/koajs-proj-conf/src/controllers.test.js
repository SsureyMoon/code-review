const controllers = require('./controllers');

describe('books controller', async () => {
    const next = jest.fn();
    let ctx;

    beforeEach(() => {
        ctx = {
            db: {
                saveBook: jest.fn(),
                listBooks: jest.fn(),
            },
        };
        ctx.db.listBooks.mockImplementation(() => []);
    });

    test('should not save doc and return 400 when input is not valid', async () => {
        ctx.validation = {
            isValid: false,
            messages: {
                test: 'message',
            },
        };
        await controllers.postBook(ctx, next);
        expect(ctx.db.saveBook).not.toHaveBeenCalled();
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
        expect(ctx.db.saveBook).toHaveBeenCalledWith(ctx.sanitizedBody);
        expect(ctx.status).toEqual(201);
    });

    test('should fetch docs based in the coollection and return the result', async () => {
        ctx.validation = {
            isValid: true,
        };
        await controllers.listBooks(ctx, next);
        expect(ctx.db.listBooks).toHaveBeenCalled();
        expect(ctx.status).toEqual(200);
        expect(ctx.body).toEqual([]);
    });
});
