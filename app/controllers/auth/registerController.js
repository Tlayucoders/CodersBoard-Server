const Joi = require('joi');
const crypto = require('crypto');
const { Controller, controllerLoader } = require('../controller');
const User = require('../../models/user');
const sha256 = require('../../../utils/sha256');

class RegisterController extends Controller {
    /**
     * @api {post} /register Register  new user
     * @apiName UserRegistration
     * @apiGroup User
     *
     * @apiPermission user
     *
     * @apiParam    {String}    name        User name
     * @apiParam    {String}    lastname    User lastname
     * @apiParam    {String}    email       User email
     * @apiParam    {String}    password    User password
     *
     * @apiSuccess  (Success 201) {Object}    data                     Response data
     * @apiSuccess  (Success 201) {Object[]}  data.users               List fo users
     * @apiSuccess  (Success 201) {String}    data.users._id           User id
     * @apiSuccess  (Success 201) {String}    data.users.name          User name
     * @apiSuccess  (Success 201) {String}    data.users.lastname      User lastname
     * @apiSuccess  (Success 201) {String}    data.users.email         User email
     * @apiSuccess  (Success 201) {Integer}   data.users.registration_step    Registration step
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 User Registered
     *     {
     *          "data": {
     *             "user": {
     *                  "_id": "58d8b70c4a9f312d045bff35",
     *                  "name": "John",
     *                  "lastname": "McTim",
     *                  "email": "johnmctim@gmail.com",
     *                  "registration_step": 1
     *              }
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
    async register(ctx) {
        let user;
        // Validations
        const input = this.validator(ctx, Joi.object().keys({
            name: Joi.string().trim().required(),
            lastname: Joi.string().trim().required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().min(6).required(),
        }));
        try {
            user = await User.findOne({ email: input.email });
        } catch (error) {
            ctx.logger.error(error);
            this.responseError(ctx, this.httpErrorHandler.DB_ERROR, error);
        }
        if (user) {
            const message = 'The user is already registered';
            this.responseError(ctx, this.httpErrorHandler.VALIDATION_ERROR, message);
        }
        // Create user
        user = new User({
            name: input.name,
            lastname: input.lastname,
            email: input.email,
            password: sha256(input.password),
            verification_token: crypto.randomBytes(48).toString('hex'),
        });

        user = await this.saveDocument(ctx, user);
        user = user.toJSON();
        delete user.password;
        delete user.verification_token;

        this.responseSuccess(ctx, { data: { user } });
    }
}

const registerController = new RegisterController();

module.exports = controllerLoader(registerController);
