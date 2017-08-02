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
     * @apiParam    {String}    user_id         User id
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
        // Verified that the user is the same that the logged user
        if (ctx.user.id !== String(user.id)) {
            ctx.throw(401, 'You can only add a Hub to yourself');
        }
        // validate if the user is the the hub
        if (user.hubs.includes(params.hub_id)) {
            const message = 'User is already in the hub';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }
        // Attach the hub to the user
        user.hubs.push(params.hub_id);
        this.saveDocument(ctx, user);

        this.responseSuccess(ctx, {
            status: 204,
            message: 'User linked to the hub',
        });
    }

    /**
     * @api {delete} /v1/users/:user_id/hubs/:hub_id Unlink a user with a hub
     * @apiName HubUnlink
     * @apiGroup User
     *
     * @apiPermission user or admin
     *
     * @apiHeader {String}  x-access-token  Access token
     *
     * @apiParam    {String}    hub_id          Hub id
     * @apiParam    {String}    user_id         User id
     *
     * @apiSuccess (204) {Null} - Not content
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 User Unlinked
     *
     * @apiError UnprocessableEntity   There was a error with the input data
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *       "Message error"
     *     }
     */
    async unlinkHub(ctx) {
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
        // Verified that the user is the same that the logged user
        if (ctx.user.id !== String(user.id)) {
            ctx.throw(401, 'You can only unlink a Hub yourself');
        }
        // Remove the hub
        user.hubs = user.hubs.filter(hubId => hubId !== params.hub_id);
        this.saveDocument(ctx, user);

        this.responseSuccess(ctx, {
            status: 204,
            message: 'User unlinked to the hub',
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
     * @apiParam    {string}    user_id    Id of the user registered in the Judge Online
     * @apiParam    {string}    judge_id   Id of the judge maped by this api
     * @apiParam    {string}    judge_user_id    Id of the user registered in the Judge Online
     * @apiParam    {string}    judge_username   Username registered in the Judge Online
     *
     * @apiSuccess  (201) {Object}    data                              Response data
     * @apiSuccess  (201) {Object}    data.user                         User information
     * @apiSuccess  (201) {Object[]}  data.user.judge_users             Judges Online
     * @apiSuccess  (201) {String}    data.user.judge_users.user_id     User is in the Judge Online
     * @apiSuccess  (201) {String}    data.user.judge_users.username    Username in the Judge Online
     * @apiSuccess  (201) {String}    data.user.judge_users.judge_id    Judge Onlide id
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
        this.validateIds(ctx, params, ['user_id', 'judge_id']);
        this.validateIds(ctx, body, ['judge_user_id', 'judge_username']);
        // Validate and  obtain the user exists
        let user = await this.findById(ctx, User, params.user_id);
        // Validate that the judge exists
        await this.findById(ctx, Judge, params.judge_id);
        // Verified that the user is the same that the logged user
        if (ctx.user.id !== String(user.id)) {
            ctx.throw(401, 'You can only add a judge account to yourself');
        }
        // Get users's judges
        const judgeUsers = user.judge_users;
        if (!judgeUsers.find(item => String(item.judge_id) === params.judge_id)) {
            judgeUsers.push({
                user_id: body.judge_user_id,
                username: body.judge_username,
                judge_id: params.judge_id,
            });
            user = await this.saveDocument(ctx, user);
        } else {
            ctx.throw(400, 'You can only add one occount for each Judge');
        }
        user = user.toJSON();
        delete user.password;
        delete user.verification_token;

        this.responseSuccess(ctx, { data: { user } });
    }

    /**
     * @api {delete} /v1/users/:user_id/judge/:judge_id  Remove a judge account for the user
     * @apiName RemoveUserJudge
     * @apiGroup User
     *
     * @apiPermission user
     *
     * @apiHeader {String}  x-access-token  Access token
     *
     * @apiParam    {string}    user_id    Id of the user registered in the Judge Online
     * @apiParam    {string}    judge_id   Id of the judge maped by this api
     *
     * @apiSuccess  (201) {Object}    data                              Response data
     * @apiSuccess  (201) {Object}    data.user                         User information
     * @apiSuccess  (201) {Object[]}  data.user.judge_users             Judges Online
     * @apiSuccess  (201) {String}    data.user.judge_users.user_id     User is in the Judge Online
     * @apiSuccess  (201) {String}    data.user.judge_users.username    Usernamein the Judge Online
     * @apiSuccess  (201) {String}    data.user.judge_users.judge_id    Judge Onlide id
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
    async removeJudgeAccount(ctx) {
        const params = ctx.params;
        params.user_id = params.user_id || ctx.user.id;
        // Validations
        this.validateIds(ctx, params, ['user_id', 'judge_id']);
        // Validate and  obtain the user exists
        let user = await this.findById(ctx, User, params.user_id);
        // Validate that the judge exists
        await this.findById(ctx, Judge, params.judge_id);
        // Verified that the user is the same that the logged user
        if (ctx.user.id !== String(user.id)) {
            ctx.throw(401, 'You can only add a judge account to yourself');
        }
        // Remove the judge account
        user.judge_users = user.judge_users.filter(item =>
            String(item.judge_id) !== params.judge_id);

        user = await this.saveDocument(ctx, user);

        user = user.toJSON();
        delete user.password;
        delete user.verification_token;

        this.responseSuccess(ctx, { data: { user } });
    }
}

const usersController = new UsersController();

module.exports = controllerLoader(usersController);
