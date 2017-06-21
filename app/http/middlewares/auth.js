const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const httpErrorhandler = require('../errors');

/**
 * Middlewares for jwt authentication
 * @param   {object}    ctx     Koa context object
 * @param   {function}  next    Next middleware
 */
async function auth(ctx, next) {
    const authorization = ctx.request.body.authorization || ctx.headers.authorization || ctx.headers['x-access-token'] || '';
    if (!authorization) {
        const message = 'Access token not Found';
        ctx.logger.warn(message);
        httpErrorhandler.responseError(ctx, httpErrorhandler.UNAUTHORIZED_ERROR, message);
    }
    // Check if is token type valid
    const [bearer, accessToken] = authorization.trim().split(' ');
    if (bearer !== 'Bearer') {
        const message = 'Token must be a bearer type token';
        ctx.logger.warn(message);
        httpErrorhandler.responseError(ctx, httpErrorhandler.UNAUTHORIZED_ERROR, message);
    }
    // Decode the token
    let decoded;
    try {
        decoded = jwt.verify(accessToken, process.env.APP_TOKEN);
    } catch (e) {
        const message = e.message;
        ctx.logger.warn(message);
        httpErrorhandler.responseError(ctx, httpErrorhandler.UNAUTHORIZED_ERROR, message);
    }
    // Find the user and attach to the context
    try {
        const user = await User.findById(decoded.sub);
        if (!user) {
            const message = 'User not Found';
            ctx.logger.warn(message);
            httpErrorhandler.responseError(ctx, httpErrorhandler.UNAUTHORIZED_ERROR, message);
        }
        ctx.app.context.user = user.toJSON();
        ctx.user.id = ctx.user._id; // eslint-disable-line
    } catch (e) {
        ctx.logger.error(e);
        httpErrorhandler.responseError(ctx, httpErrorhandler.DB_ERROR, e);
    }

    await next();
}

module.exports = auth;
