const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const db = require('./src/db');
const { environment } = require('./src/config');
const middlewares = require('./src/middlewares');
const routes = require('./src/routes');

const app = new Koa();

if (environment === 'develop') {
    app.use(logger());
}

app.use(bodyParser());
app.use(middlewares.setContext({
    database: {
        client: db.client,
    },
}));
app.use(routes.routes());

module.exports = app;
