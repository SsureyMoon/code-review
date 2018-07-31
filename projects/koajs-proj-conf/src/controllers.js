exports.postBook = async (ctx) => {
    if (!ctx.validation.isValid) {
        ctx.status = 400;
        ctx.body = { ...ctx.validation.messages };
        return;
    }
    await ctx.database.client.saveBook(ctx.sanitizedBody);
    ctx.status = 201;
};

exports.listBooks = async (ctx) => {
    ctx.body = await ctx.database.client.listBooks();
    ctx.status = 200;
};
