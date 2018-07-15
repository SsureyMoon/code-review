exports.healthcheck = async (ctx) => {
    const dbCheck = await ctx.database.client.healthcheck(); // eslint-disable-line
    ctx.body = { message: 'ok' };
};
