import jwt from 'jsonwebtoken';

/**
 * Middlewares for jwt authentication
 */
async function auth(ctx, next) {
    const access_token = ctx.request.body.access_token || ctx.headers['x-access-token'] || '';

    try {
        const decoded = jwt.verify(access_token, process.env.APP_TOKEN);
        ctx.app.context.user = decoded.user;
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(403,'Forbidden resource');
    }

    await next();
}

module.exports = auth;
