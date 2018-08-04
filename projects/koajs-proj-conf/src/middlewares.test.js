const validators = require('./validators');
const {
    buildValidateMiddleware,
    handleExceptions,
    handleHealthCheck,
} = require('./middlewares');

describe('', () => {
    let ctx;
    let next;

    beforeEach(() => {
        next = jest.fn();
        ctx = {
            status: '',
            body: '',
            request: {
                header: {},
                body: {},
            },
            app: {
                emit: jest.fn(),
            },
        };
    });

    describe('ValidateMiddleware for book item', () => {
        const middleware = buildValidateMiddleware(validators.bookItemValidators, 'request.body');

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

    describe('Error handling middleware', () => {
        const middleware = handleExceptions;

        test('should wrapped the server exception(5xx) message and emit error', async () => {
            const err = new Error('Error');
            err.status = 500;
            err.message = 'stack trace.';
            next.mockImplementation((() => {
                throw err;
            }));

            await middleware(ctx, next);
            expect(ctx.status).toBe(500);
            expect(ctx.body).toBe('Internal server error');
            expect(ctx.app.emit).toHaveBeenCalledWith('error', err, ctx);
        });

        test('should pass the client exception(4xx)', async () => {
            const err = new Error('Error');
            err.status = 400;
            err.message = 'what the client did wrong';
            next.mockImplementation((() => {
                throw err;
            }));

            await middleware(ctx, next);
            expect(ctx.status).toBe(400);
            expect(ctx.body).toBe('what the client did wrong');
        });
    });

    describe('Health checking middleware', () => {
        const middleware = handleHealthCheck;

        test('should return 200 when the header user-agent contains elb-healthchecker', async () => {
            ctx.request.header['user-agent'] = 'ELB-HealthChecker/2.0';
            await middleware(ctx, next);
            expect(ctx.status).toBe(200);
            expect(ctx.body).toEqual({ message: 'ok' });
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next when the header user-agent does not contain elb-healthchecker', async () => {
            ctx.request.header['user-agent'] = 'BlahBlah';
            await middleware(ctx, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
