import User from '../../../../models/user';

/**
 * @api {get} /api/v1/users Request users information
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiParam    {String}    x-access-token  Access token. No required if this is included in the Headers
 * @apiSuccess  {Object}    data                     Response data
 * @apiSuccess  {Object[]}  data.users               List fo users
 * @apiSuccess  {String}    data.users._id           User id
 * @apiSuccess  {String}    data.users.name          User name
 * @apiSuccess  {String}    data.users.lastname      User lastname
 * @apiSuccess  {String}    data.users.created_at    Date of user registration
 * @apiSuccess  {String}    data.users.updated_at    Date of last user information update
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": {
 *        	   "users": [
 *        			{
 *        				"_id": "58d8b70c4a9f312d045bff35",
 *        				"name": "John",
 *        				"lastname": "McTim",
 *        				"created_at": "2017-03-27T06:54:04.318Z",
 *        				"updated_at": "2017-03-27T06:54:04.318Z"
 *        			}
 *              ]
 *          }
 *     }
 *
 * @apiError UsersNotFound The was a error getting the users information
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "Message error"
 *     }
 */
async function fetch(ctx) {
    try {
        const users = await User.exclude('password').find();
        ctx.body = {
            data: {
                users: JSON.parse(JSON.stringify(users))
            }
        };
    } catch (e) {
        ctx.logger.info(e);
        ctx.throw(404, e);
    }
}

module.exports = {
    fetch
};
