exports.healthcheck = async (ctx) => {
    const dbCheck = await ctx.database.client.healthcheck(); // eslint-disable-line
    ctx.body = { message: 'ok' };
};

exports.postBook = async (ctx) => {
    if (!ctx.validation.isValid) {
        ctx.status = 400;
        ctx.body = { ...ctx.validation.messages };
        return;
    }
    await ctx.database.client.saveBook(ctx.sanitizedBody);
    ctx.status = 201;
};
