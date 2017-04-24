import User from '../../../models/user';
import sha256 from '../../../../utils/sha256';

/**
 * @api {post} /register Register  new user
 * @apiName UserRegistration
 * @apiGroup User
 *
 * @apiParam    {String}    name        User name
 * @apiParam    {String}    lastname    User lastname
 * @apiParam    {String}    email       User email
 * @apiParam    {String}    password    User password
 *
 * @apiSuccess  (201) {Object}    data                     Response data
 * @apiSuccess  (201) {Object[]}  data.users               List fo users
 * @apiSuccess  (201) {String}    data.users._id           User id
 * @apiSuccess  (201) {String}    data.users.name          User name
 * @apiSuccess  (201) {String}    data.users.lastname      User lastname
 * @apiSuccess  (201) {String}    data.users.email         User email
 * @apiSuccess  (201) {Integer}   data.users.registration_step    Registration step
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 User Registered
 *     {
 *          "data": {
 *        	   "user": {
 *        			"_id": "58d8b70c4a9f312d045bff35",
 *        			"name": "John",
 *        			"lastname": "McTim",
 *        			"email": "johnmctim@gmail.com",
 *        			"registration_step": 1
 *        		}
 *          }
 *     }
 *
 * @apiError UnprocessableEntity Invalid input
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "Message error"
 *     }
 */
async function register(ctx) {
    const body = ctx.request.body;
    try {
        let user = new User({
            name: (body.name)? body.name.trim() : undefined,
            lastname: (body.lastname)? body.lastname.trim() : undefined,
            email: (body.email)? body.email.trim() : undefined,
            password: (body.password)?
                (body.password.trim().length > 5)? sha256(body.password.trim()) : body.password.trim()
                : undefined,
            registration_step: 1
        });

        await user.save();
        user = JSON.parse(JSON.stringify(user));
        delete user.password;

        ctx.status = 201;
        ctx.message = 'User Registered';
        ctx.body = {
            data: {
                user: user
            }
        };
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(422, e);
    }
}

module.exports = {
    register
};
