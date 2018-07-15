const validators = require('../validators');
const {
    buildValidateMiddleware,
} = require('../middlewares');

describe('ValidateMiddleware for book item', async () => {
    const next = jest.fn();
    const middleware = buildValidateMiddleware(validators.bookItemValidators, 'request.body');
    let ctx;

    beforeEach(() => {
        ctx = {
            request: {
                body: {},
            },
        };
    });

    test('should return invalid status when required fields do not exist', async () => {
        await middleware(ctx, next);
        expect(ctx.validation.isValid).toBe(false);
        expect(ctx.validation.messages).toEqual({
            name: 'required but not provided',
            isbn: 'required but not provided',
        });
        expect(ctx.sanitizedBody).toEqual({});
    });

    test('should return valid status when required fields are in the right formats', async () => {
        ctx = {
            request: {
                body: {
                    name: '리눅스 커널 이야기',
                    isbn: '9788966264049',
                    publishedAt: '2007-08-16',
                },
            },
        };
        await middleware(ctx, next);
        expect(ctx.validation.isValid).toBe(true);
        expect(ctx.validation.messages).toEqual({});
        expect(ctx.sanitizedBody).toEqual(ctx.request.body);
    });

    test('should return invalid status when values are not in the right format', async () => {
        ctx = {
            request: {
                body: {
                    name: '',
                    isbn: 'ABC9788966264049XYZ',
                    publishedAt: '20070816',
                },
            },
        };
        await middleware(ctx, next);
        expect(ctx.validation.isValid).toBe(false);
        expect(ctx.validation.messages).toEqual({
            name: 'name must not be empty',
            isbn: 'invalid ISBN',
            publishedAt: 'invalid time format (YYYY-MM-DD)',
        });
        expect(ctx.sanitizedBody).toEqual({});
    });

    test('should return a body object undefined fields are filtered in', async () => {
        ctx = {
            request: {
                body: {
                    _key: '9999', // try overriding a key
                    name: '전문가를 위한 파이썬',
                    isbn: '9788968484988',
                    publishedAt: '2016-08-12',
                },
            },
        };
        await middleware(ctx, next);
        expect(ctx.validation.isValid).toBe(true);
        expect(ctx.validation.messages).toEqual({});
        expect(ctx.sanitizedBody).toEqual({
            name: '전문가를 위한 파이썬',
            isbn: '9788968484988',
            publishedAt: '2016-08-12',
        });
    });
});
