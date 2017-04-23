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
 * @apiSuccess  {Object}    data                     Response data
 * @apiSuccess  {Object[]}  data.users               List fo users
 * @apiSuccess  {String}    data.users._id           User id
 * @apiSuccess  {String}    data.users.name          User name
 * @apiSuccess  {String}    data.users.lastname      User lastname
 * @apiSuccess  {String}    data.users.email         User email
 * @apiSuccess  {Integer}   data.users.registration_step    Registration step
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
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
    try {
        let user = new User({
            name: ctx.request.body.name,
            lastname: ctx.request.body.lastname,
            email: ctx.request.body.email,
            password: (ctx.request.body.password && ctx.request.body.password.length > 5)?
                sha256(ctx.request.body.password) : ctx.request.body.password,
            registration_step: 1
        });

        await user.save();
        user = JSON.parse(JSON.stringify(user));
        delete user.password;

        ctx.status = 201;
        ctx.message = 'User was registered';
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

 /**
  * @api {post} /register/link  Link a judge account
  * @apiName UserLink
  * @apiGroup User
  *
  * @apiParam    {String}    x-access-token  Access token. No required if this is included in the Headers
  * @apiParam    {string}    user_id    Id of the user registred in the Judge Online
  * @apiParam    {string}    username   Username registred in the Judge Online
  * @apiParam    {string}    judge_id   Id of the judge maped by this api
  *
  * @apiSuccess (204) {null} -
  *
  * @apiSuccessExample Success-Response:
  *     HTTP/1.1 204 OK
  *
  * @apiError UnprocessableEntity   There was a error with the input data
  * @apiErrorExample {json} Error-Response:
  *     HTTP/1.1 422 Unprocessable Entity
  *     {
  *       "Message error"
  *     }
  */
async function accountLink(ctx) {
    try {
        const user = await User.findById(ctx.user._id);
        const judge_users = user.get('judge_users') || [];
        judge_users.push({
            user_id: ctx.request.body.user_id,
            username: ctx.request.body.username,
            judge_id: ctx.request.body.judge_id
        });
        user.set('judge_users', judge_users);
        if (user.set('registration_step') === 1 )
            user.set('registration_step', 2);
        await user.save();
        ctx.status = 204;
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(422, e);
    }
}

module.exports = {
    register,
    accountLink
};
