exports.postBook = async (ctx) => {
    if (!ctx.validation.isValid) {
        ctx.status = 400;
        ctx.body = { ...ctx.validation.messages };
        return;
    }
    await ctx.db.saveBook(ctx.sanitizedBody);
    ctx.status = 201;
};

exports.listBooks = async (ctx) => {
    ctx.body = await ctx.db.listBooks();
    ctx.status = 200;
};
