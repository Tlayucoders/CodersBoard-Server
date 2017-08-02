const Joi = require('joi');
const { Controller, controllerLoader } = require('../controller');
const Hub = require('../../models/hub');
const User = require('../../models/user');
const uniqueToken = require('../../../utils/uniqueToken');

class HubController extends Controller {
    /**
     * @apiDefine HubInputData
     * @apiParam    {String}    name        Hub name
     * @apiParam    {String}    description Hub description
     * @apiParam    {String}    institution Institution
     * @apiParam    {String}    phone       Phone number
     * @apiParam    {String}    contact     Email for contact
     * @apiParam    {String}    address     Address
     * @apiParam    {String}    zip_code    Zip Code
     * @apiParam    {String}    state       State
     * @apiParam    {String}    country     Country
     */

     /**
     * @api {get} /v1/hubs Get the hubs
     * @apiName GetHubs
     * @apiGroup Hub
     *
     * @apiPermission admin
     *
     * @apiHeader {String}  x-access-token  Access token
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200
     *     {
     *          "data": {
     *              hubs: [
     *                  {
     *                      "_id": "58d8b70c4a9f312d045bff35",
     *                      "name": "Universidad X",
     *                      "description": "Hub of Universidad X",
     *                      ...
     *                  }
     *             ]
     *         }
     *     }
     *
     * @apiError UnprocessableEntity   There was a error with the input data
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 422 Unprocessable Entity
     *     {
     *       "Message error"
     *     }
     */
    async fetch(ctx) {
        let hubs;
        try {
            hubs = await Hub.find();
        } catch (error) {
            ctx.logger.error(error);
            this.responseError(ctx, this.httpErrorHandler.DB_ERROR, error);
        }

        this.responseSuccess(ctx, { data: { hubs } });
    }

    /**
     * @api {post} /v1/hubs Create a new hub
     * @apiName CreateHubs
     * @apiGroup Hub
     *
     * @apiPermission user | admin
     *
     * @apiHeader {String}  x-access-token  Access token
     * @apiUse HubInputData
     *
     * @apiSuccess (Success 201) {Object}    data            Response data
     * @apiSuccess (Success 201) {Object}    data.hub        Hub created
     * @apiSuccess (Success 201) {String}    data.hub._id    Hub id
     * @apiSuccess (Success 201) {String}    data.hub.unique_key    Hub id
     * @apiSuccess (Success 201) {String}    data.hub.name   Hub name
     * @apiSuccess (Success 201) {String}    data.hub.description   Hub description
     * @apiSuccess (Success 201) {String}    data.hub.institution Institution
     * @apiSuccess (Success 201) {String}    data.hub.phone       Phone number
     * @apiSuccess (Success 201) {String}    data.hub.contact     Email for contact
     * @apiSuccess (Success 201) {String}    data.hub.address     Address
     * @apiSuccess (Success 201) {String}    data.hub.zip_code    Zip Code
     * @apiSuccess (Success 201) {String}    data.hub.state       State
     * @apiSuccess (Success 201) {String}    data.hub.country     Country
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Hub Registered
     *     {
     *          "data": {
     *             "hub": {
     *                  "_id": "58d8b70c4a9f312d045bff35",
     *                  "name": "Universidad X",
     *                  "description": "Hub of Universidad X",
     *                  ...
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
        let hub;
        // Validations
        const input = this.validator(ctx, Joi.object().keys({
            name: Joi.string().trim().required(),
            description: Joi.string().trim().required(),
            institution: Joi.string().trim().required(),
            phone: Joi.string().trim().length(10).required(),
            contact: Joi.string().trim().email().required(),
            address: Joi.string().trim().required(),
            zip_code: Joi.string().trim().length(5).required(),
            state: Joi.string().trim().required(),
            country: Joi.string().trim().required(),
        }));
        // Generate unique key for the hub
        input.unique_key = uniqueToken(input.name);
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
     * @api {put} /v1/hubs/:hub_id Update a hub
     * @apiName UpdateHub
     * @apiGroup Hub
     *
     * @apiPermission user | admin
     *
     * @apiHeader {String}  x-access-token  Access token
     *
     * @apiUse HubInputData
     *
     * @apiSuccess (Success 200) {Object}    data            Response data
     * @apiSuccess (Success 200) {Object}    data.hub        Hub created
     * @apiSuccess (Success 200) {String}    data.hub._id    Hub id
     * @apiSuccess (Success 200) {String}    data.hub.unique_key    Hub id
     * @apiSuccess (Success 200) {String}    data.hub.name   Hub name
     * @apiSuccess (Success 200) {String}    data.hub.description   Hub description
     * @apiSuccess (Success 200) {String}    data.hub.institution Institution
     * @apiSuccess (Success 200) {String}    data.hub.phone       Phone number
     * @apiSuccess (Success 200) {String}    data.hub.contact     Email for contact
     * @apiSuccess (Success 200) {String}    data.hub.address     Address
     * @apiSuccess (Success 200) {String}    data.hub.zip_code    Zip Code
     * @apiSuccess (Success 200) {String}    data.hub.state       State
     * @apiSuccess (Success 200) {String}    data.hub.country     Country
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 Hub Update
     *     {
     *          "data": {
     *             "hub": {
     *                  "_id": "58d8b70c4a9f312d045bff35",
     *                  "name": "Universidad X",
     *                  "description": "Hub of Universidad X",
     *                  ...
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
    async update(ctx) {
        let hub;
        // Validations
        const input = this.validator(ctx, Joi.object().keys({
            name: Joi.string().trim(),
            description: Joi.string().trim(),
            institution: Joi.string().trim(),
            phone: Joi.string().trim().length(10),
            contact: Joi.string().trim().email(),
            address: Joi.string().trim(),
            zip_code: Joi.string().trim().length(5),
            state: Joi.string().trim(),
            country: Joi.string().trim(),
        }));
        this.validateIds(ctx, ctx.params, ['hub_id']);
        // validate if hub exists
        hub = this.findById(ctx, Hub, ctx.params.hub_id);
        // Update the hub
        Object.keys(input).forEach((key) => {
            hub[key] = input[key];
        });
        hub = await this.saveDocument(ctx, hub);

        this.responseSuccess(ctx, { data: { hub } });
    }

    /**
     * @api {get} /v1/hubs/:hub_id/users Request users information by Hub
     * @apiName GetUsers
     * @apiGroup Hub
     *
     * @apiPermission user | admin
     *
     * @apiHeader {String}  x-access-token  Access token
     *
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
     *                      ...
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
    async getUsers(ctx) {
        const params = ctx.params;
        this.validateIds(ctx, params, ['hub_id']);
        // validate if hub exists
        await this.findById(ctx, Hub, params.hub_id);
        let users;
        try {
            users = await User.find({ hubs: params.hub_id }).select([
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

const hubController = new HubController();

module.exports = controllerLoader(hubController);
