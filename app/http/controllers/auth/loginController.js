import jwt from 'jsonwebtoken';
import User from '../../../models/user';
import sha256 from '../../../../utils/sha256';

/**
 * Login
 */
async function login(ctx) {
    try {
        const user = await User.where('email', ctx.request.body.email)
            .where('password', sha256(ctx.request.body.password))
            .find();

        if (!user.length) {
            throw new Error('Email or password invalid');
        }

        ctx.body = {
            access_token: jwt.sign({
                user: JSON.parse(JSON.stringify(user))
            }, process.env.APP_TOKEN, { expiresIn: '7d' })
        };
        ctx.message = 'User logged';
    } catch (e) {
        ctx.throw(404, e);
    }
}

module.exports = {
    login
};
