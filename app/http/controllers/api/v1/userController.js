const User = require('../../../../models/user');
const { Controller, controllerLoader } = require('../../controller');

class UsersController extends Controller {
  /**
   * @api {get} /api/v1/users Request users information
   * @apiName GetUsers
   * @apiGroup User
   *
   * @apiPermission user
   *
   * @apiParam    {String}    x-access-token  Access token.
   * No required if this is included in the Headers
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
   *             "users": [
   *                  {
   *                      "_id": "58d8b70c4a9f312d045bff35",
   *                      "name": "John",
   *                      "lastname": "McTim",
   *                      "created_at": "2017-03-27T06:54:04.318Z",
   *                      "updated_at": "2017-03-27T06:54:04.318Z"
   *                  }
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
    async fetch(ctx) {
        let users;
        try {
            users = await User.find().select([
                '-password',
                '-verification_token',
                '-registration_step',
                '-updatedAt',
                '-createdAt',
                '-__v',
            ]);
        } catch (error) {
            ctx.logger.info(error);
            this.responseError(ctx, this.httpErrorHandler.DB_ERROR, error);
        }

        this.responseSuccess(ctx, { data: { users } });
    }
}

const usersController = new UsersController();

module.exports = controllerLoader(usersController);
