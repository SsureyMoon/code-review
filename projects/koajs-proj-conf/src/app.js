const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const winston = require('winston');

const db = require('./db');
const { environment } = require('./config');
const middlewares = require('./middlewares');
const routes = require('./routes');

const app = new Koa();

const errLogger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

if (environment === 'develop') {
    app.use(logger());
} else if (environment === 'production') {
    app.on('error', (err) => {
        errLogger.error(err);
    });
}

app.use(middlewares.handleExceptions);
app.use(bodyParser());
app.use(middlewares.setContext({
    database: {
        client: db.client,
    },
}));
app.use(routes.routes());

module.exports = app;
