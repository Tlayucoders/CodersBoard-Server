import jwt from 'jsonwebtoken';
import User from '../../../models/user';
import sha256 from '../../../../utils/sha256';

/**
 * @api {post} /login User Login
 * @apiName UserLogin
 * @apiGroup User
 *
 * @apiParam    {string}    email   User email
 * @apiParam    {string}    password   User password
 *
 * @apiSuccess  {Object}    data                Response data
 * @apiSuccess  {String}    data.access_token  User access token
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": {
 *        	   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VyIj"
 *          }
 *     }
 *
 * @apiError NOTFOUND Invalid user information
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "Message error"
 *     }
 */
async function login(ctx) {
    try {
        const user = await User.exclude('password')
            .exclude('created_at')
            .exclude('updated_at')
            .where('email', ctx.request.body.email)
            .where('password', sha256(ctx.request.body.password))
            .findOne();

        if (!user) {
            throw new Error('Email or password invalid');
        }

        ctx.body = {
            data: {
                access_token: jwt.sign({
                    user: user.toJSON()
                }, process.env.APP_TOKEN, { expiresIn: '7d' })
            }
        };
        ctx.message = 'User logged';
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(404, e);
    }
}

module.exports = {
    login
};
