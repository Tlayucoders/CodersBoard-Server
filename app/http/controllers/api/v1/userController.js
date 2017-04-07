import User from '../../../../models/user';

/**
 * @api {get} /users Request Users information
 * @apiName GetUsera
 * @apiGroup User
 *
 * @apiSuccess  {Object[]}  Users               List fo users
 * @apiSuccess  {String}    Users._id           User id
 * @apiSuccess  {String}    Users.name          User name
 * @apiSuccess  {String}    Users.lastname      User lastname
 * @apiSuccess  {String}    Users.created_at    Date of user registration
 * @apiSuccess  {String}    Users.updated_at    Date of last user information update
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": {
 *
        	   "users": [
        			{
        				"_id": "58d8b70c4a9f312d045bff35",
        				"name": "Esaú",
        				"lastname": "Peralta",
        				"created_at": "2017-03-27T06:54:04.318Z",
        				"updated_at": "2017-03-27T06:54:04.318Z"
        			}
                ]
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
