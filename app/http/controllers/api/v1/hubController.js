const Joi = require('joi');
const Hub = require('../../../../models/hub');
const User = require('../../../../models/user');
const { Controller, controllerLoader } = require('../../controller');
const uniqueToken = require('../../../../../utils/uniqueToken');

class HubController extends Controller {
    /**
     * @api {post} /api/v1/hubs Create a new hub
     * @apiName GetHubs
     * @apiGroup Hub
     *
     * @apiParam    {String}        x-access-token  Access token.
     * No required if this is included in the Headers
     * @apiParam    {name}          name            Hub name
     * @apiParam    {description}   name            Hub description (Optional)
     *
     * @apiSuccess  {Object}    data            Response data
     * @apiSuccess  {Object}    data.hub        Hub created
     * @apiSuccess  {String}    data.hub._id    Hub id
     * @apiSuccess  {String}    data.hub.unique_key    Hub id
     * @apiSuccess  {String}    data.hub.name   Hub name
     * @apiSuccess  {String}    data.hub.description   Hub description
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Hub Registered
     *     {
     *          "data": {
     *             "hub": {
     *                  "_id": "58d8b70c4a9f312d045bff35",
     *                  "name": "Universidad X",
     *                  "description": "Hub of Universidad X",
     *              }
     *          }
     *     }
     *
     * @apiError UnprocessableEntity   There was a error with the input data
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *       "Message error"
     *     }
     */
    async create(ctx) {
        const body = ctx.request.body;
        let hub;
        // Validations
        const input = this.validator(ctx, body, Joi.object().keys({
            name: Joi.string().trim().min(3).max(30).required(), // eslint-disable-line
            description: Joi.string().trim().min(3).max(30).required(), // eslint-disable-line
        }));
        // Generate unique key for the hub
        input.unique_key = uniqueToken(body.name);
        // validate if hub exist
        try {
            hub = await Hub.findOne({ unique_key: input.unique_key });
        } catch (error) {
            ctx.logger.error(error);
            this.responseError(ctx, this.httpErrorHandler.DB_ERROR, error);
        }
        if (hub) {
            const message = 'The hub is already registered';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }
        // Create the hub
        hub = new Hub(input);
        hub = await this.saveDocument(ctx, hub);

        this.responseSuccess(ctx, { data: { hub } });
    }

    /**
     * @api {patch} /api/v1/hubs/:hub_id/link Link the current user with a hub
     * @apiName HubLink
     * @apiGroup Hub
     *
     * @apiPermission user
     *
     * @apiParam    {String}    x-access-token  Access token.
     * No required if this is included in the Headers
     *
     * @apiSuccess (204) {Null} - Not content
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204 Hub Linked
     *
     * @apiError UnprocessableEntity   There was a error with the input data
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *       "Message error"
     *     }
     */
    async link(ctx) {
        const params = ctx.params;
        // Validations
        this.validateIds(ctx, params, [
            'hub_id',
        ]);
        // Find user
        let user = await this.findById(ctx, User, ctx.user.id);
        if (!user) {
            const message = 'User not Found';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }
        // Find Hub
        const hub = await this.findById(ctx, Hub, params.hub_id);
        if (!hub) {
            const message = 'Hub not Found';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }
        if (user.hubs.includes(params.hub_id)) {
            const message = 'User is already in the hub';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }

        user.hubs.push(params.hub_id);
        this.saveDocument(ctx, user);
        user = user.toJSON();
        delete user.password;
        delete user.verification_token;
        delete user.__v; // eslint-disable-line

        this.responseSuccess(ctx, { user });
    }
}

const hubController = new HubController();

module.exports = controllerLoader(hubController);
