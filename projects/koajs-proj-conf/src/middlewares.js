const validators = require('./validators');

const resolve = (obj, property) => {
    const properties = property.split('.');
    return properties.reduce((prevObj, key) => {
        return prevObj[key];
    }, obj);
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

exports.setContext = contextObj => async (ctx, next) => {
    Object.keys(contextObj).forEach((key) => {
        ctx[key] = contextObj[key];
    });
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
