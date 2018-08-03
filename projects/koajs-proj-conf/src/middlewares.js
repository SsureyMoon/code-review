const validators = require('./validators');

const resolve = (obj, property) => {
    const properties = property.split('.');
    return properties.reduce((prevObj, key) => prevObj[key], obj);
};

exports.handleExceptions = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;

        if (ctx.status >= 500) {
            ctx.body = 'Internal server error';
            ctx.app.emit('error', err, ctx);
        }
    }
};

exports.handleHealthCheck = async (ctx, next) => {
    const userAgent = ctx.request.header['user-agent'];
    if (userAgent && userAgent.toLowerCase().includes('elb-healthchecker')) {
        ctx.status = 200;
        ctx.body = { message: 'ok' };
        return;
    }
    await next();
};

exports.buildValidateMiddleware = (validator, fieldToValidate) => async (ctx, next) => {
    // validate body
    const body = { ...resolve(ctx, fieldToValidate) };
    ctx.validation = validators.validate(validator, body);

    // sanitize body
    if (ctx.validation.isValid) {
        ctx.sanitizedBody = validators.sanitize(validator, body);
    } else {
        ctx.sanitizedBody = {};
    }

    await next();
};
