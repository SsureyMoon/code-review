exports.setContext = contextObj =>
    async (ctx, next) => {
        Object.keys(contextObj).forEach((key) => {
            ctx[key] = contextObj[key];
        });
        await next();
    };
