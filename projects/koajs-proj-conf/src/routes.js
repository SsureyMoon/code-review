const Router = require('koa-router');

const config = require('./config');
const controllers = require('./controllers');
const {
    bookItemValidators,
} = require('./validators');
const {
    buildValidateMiddleware,
} = require('./middlewares');

const router = new Router({
    prefix: `/${config.API_VER}`,
});
router.get('/health', controllers.healthcheck);
router.post('/books', buildValidateMiddleware(bookItemValidators, 'request.body'), controllers.postBook);

module.exports = router;
