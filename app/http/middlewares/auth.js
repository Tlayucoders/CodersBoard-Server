import jwt from 'jsonwebtoken';

/**
 * Middlewares for jwt authentication
 */
async function auth(ctx, next) {
    const access_token = ctx.request.body.access_token || ctx.headers['x-access-token'] || '';

    try {
        jwt.verify(access_token, process.env.APP_TOKEN);
        await next();
    } catch(err) {
        ctx.status = 403;
        ctx.message = 'Forbidden resource';
    }
}

module.exports = auth;
