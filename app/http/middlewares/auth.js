import jwt from 'jsonwebtoken';

/**
 * Middlewares for jwt authentication
 */
module.exports = (ctx, next) => {
    const access_token = ctx.request.body.access_token || ctx.headers['x-access-token'] || '';

    try {
        jwt.verify(access_token, process.env.APP_TOKEN);
        next();
    } catch(err) {
        ctx.status = 403;
        ctx.message = 'Forbidden resource';
    }
};
