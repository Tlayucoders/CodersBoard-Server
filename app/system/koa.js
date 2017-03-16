import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';

import loader from './../../utils/fileLoader';
import Logger from './../../utils/logger';

const logger = new Logger();

function loadRoutes(router, callback) {
    // Load URLs
    const routesPath = `${__dirname}/../../routes`;
    loader(routesPath, (routePath) => {
        const routeSetter = require(routePath);
        routeSetter(router);
    });

    if (callback) callback(router);
}

function init() {
    const app = new Koa();
    const router = new KoaRouter();

    // Log every incoming request
    app.use(async (ctx, next) => {
        logger.info(`${ctx.method} ${ctx.url}`);
        await next();
    });

    // Log every response
    app.use(async (ctx, next) => {
        const start = new Date();
        await next();
        const ms = new Date().getTime() - start.getTime();
        logger.info(`${ctx.method} ${ctx.url} ${ms} ms`);
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
