import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import cors from 'kcors';
import serve from 'koa-static';

import loader from './../../utils/fileLoader';
import Logger from './../../utils/logger';

const logger = new Logger();

/**
 * Load all the route files in the directory routes
 * @param {object}      router      Koa router object
 * @param {function}    callback    Callback function
 */
function loadRoutes(router, callback) {
    // Load URLs
    const routesPath = `${__dirname}/../../routes`;
    loader(routesPath, (routePath) => {
        const routeSetter = require(routePath);
        routeSetter(router);
    });

    if (callback) callback(router);
}

/**
 * Initialize the Koa application
 */
function init() {
    const app = new Koa();
    const router = new KoaRouter();

    // Logger instance available from the context
    app.context.logger = logger;

    // Cross-Origin Resource Sharing(CORS)
    app.use(cors());

    // Expose public files
    const publicDir = __dirname + '/../../public';
    logger.info('Exposing public directory:', publicDir);
    app.use(serve(publicDir));

    // x-response-time
    app.use(async function (ctx, next) {
        const start = new Date();
        await next();
        const ms = new Date() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
        logger.info(`X-Response-Time: ${ms}ms`);
    });

    // Logger
    app.use(async function (ctx, next) {
        const start = new Date();
        await next();
        const ms = new Date() - start;
        logger.info(`${ctx.method} ${ctx.url} - ${ms}`);
    });

    app.use(koaBodyParser());

    loadRoutes(router, (attachedRouter) => {
        app.use(attachedRouter.routes());
        app.use(attachedRouter.allowedMethods());
        app.listen(process.env.PORT, () => {
            logger.info('%s listening at %s', process.env.APP_NAME, process.env.PORT);
        });
    });
}

export default init;
