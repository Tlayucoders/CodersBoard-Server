import jwt from 'jsonwebtoken';
import User from '../../models/user';

/**
 * Middlewares for jwt authentication
 * @param   {object}    ctx     Koa context object
 * @param   {function}  next    Next middleware
 */
async function auth(ctx, next) {
    const access_token = ctx.request.body.access_token || ctx.headers['x-access-token'] || '';

    try {
        const decoded = jwt.verify(access_token, process.env.APP_TOKEN);
        const user = await User.findById(decoded.user._id);
        if (!user) {
            throw Error('User not Found');
        }
        ctx.app.context.user = decoded.user;
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(403,'Forbidden resource');
    }

    await next();
}

module.exports = auth;
