const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const winston = require('winston');

const db = require('./db');
const { environment } = require('../config');
const middlewares = require('./middlewares');
const routes = require('./routes');

const app = new Koa();

const errLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
    ),
    transports: [
        new winston.transports.Console({ level: 'error' }),
    ],
});

app.use(middlewares.handleExceptions);

if (environment === 'develop') {
    app.use(logger());
} else if (environment === 'production') {
    app.on('error', (err) => {
        errLogger.error(err);
    });
}

app.use(middlewares.handleHealthCheck);
app.use(bodyParser());
app.use(middlewares.setContext({
    db: db.client,
}));
app.use(routes.routes());

module.exports = app;
