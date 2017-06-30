const { Controller, controllerLoader } = require('../controller');
const User = require('../../models/user');
const Hub = require('../../models/hub');
const Judge = require('../../models/judge');

class UsersController extends Controller {
    /**
     * @api {patch} /v1/users/:user_id/hubs/:hub_id Link a user with one hub
     * @apiName HubLink
     * @apiGroup User
     *
     * @apiPermission user or admin
     *
     * @apiHeader {String}  x-access-token  Access token
     *
     * @apiParam    {String}    hub_id          Hub id
     * @apiParam    {String}    user_id         User id. Opcional
     * If user id is no present the current user is added to the hub
     * Only an Administrator can add other users
     *
     * @apiSuccess (204) {Null} - Not content
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 User Linked
     *
     * @apiError UnprocessableEntity   There was a error with the input data
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *       "Message error"
     *     }
     */
    async linkHub(ctx) {
        const params = ctx.params;
        params.user_id = params.user_id || ctx.user.id;
        // Validations
        this.validateIds(ctx, params, [
            'hub_id',
            'user_id',
        ]);
        // Find Hub
        await this.findById(ctx, Hub, params.hub_id);
        // Find user
        const user = await this.findById(ctx, User, params.user_id);
        // validate if the user is the the hub
        if (user.hubs.includes(params.hub_id)) {
            const message = 'User is already in the hub';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }
        // Attach thu to the user
        user.hubs.push(params.hub_id);
        this.saveDocument(ctx, user);

        this.responseSuccess(ctx, {
            status: 204,
            message: 'User linked to the hub',
        });
    }

    /**
     * @api {patch} /v1/users/:user_id/judge/:judge_id  Add a judge account to one user
     * @apiName AddUserJudge
     * @apiGroup User
     *
     * @apiPermission user
     *
     * @apiHeader {String}  x-access-token  Access token
     *
     * @apiParam    {string}    user_id    Id of the user registred in the Judge Online
     * @apiParam    {string}    username   Username registred in the Judge Online
     * @apiParam    {string}    judge_id   Id of the judge maped by this api
     *
     * @apiSuccess  (201) {Object}    data                         Response data
     * @apiSuccess  (201) {Object[]}  data.judge_users             Judges Online
     * accounts of the user
     * @apiSuccess  (201) {String}    data.judge_users.user_id     User is in the Judge Online
     * @apiSuccess  (201) {String}    data.judge_users.user_id     User id in the Judge Online
     * @apiSuccess  (201) {String}    data.judge_users.judge_id    Judge Onlide id
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Judge Account Linked
     *
     * @apiError UnprocessableEntity   There was a error with the input data
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *       "Message error"
     *     }
     */
    async addJudgeAccount(ctx) {
        const body = ctx.request.body;
        const params = ctx.params;
        params.user_id = params.user_id || ctx.user.id;
        // Validations
        this.validateIds(ctx, params, [
            'hub_id',
            'user_id',
        ]);
        await this.findById(ctx, Judge, params.judge_id);
        let user = await this.findById(ctx, User, params.user_id);
        await this.findById(ctx, User, body.judge_id);
        this.validateIds(ctx, body, ['judge_id']);
        // Get users's judges
        const judgeUsers = user.judge_users;
        if (!judgeUsers.find(item => String(item.judge_id) === body.judge_id)) {
            judgeUsers.push({
                user_id: body.user_id,
                username: body.username,
                judge_id: body.judge_id,
            });
            user = await this.saveDocument(ctx, user);
        }
        user = user.toJSON();
        delete user.password;
        delete user.verification_token;

        this.responseSuccess(ctx, { data: { user } });
    }
}

const usersController = new UsersController();

module.exports = controllerLoader(usersController);
