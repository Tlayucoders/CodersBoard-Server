const jwt = require('jsonwebtoken');
const GoogleAuth = require('google-auth-library');
const Joi = require('joi');
const { Controller, controllerLoader } = require('../controller');
const User = require('../../../models/user');
const sha256 = require('../../../../utils/sha256');

class LoginController extends Controller {
    /**
     * Set google app access variables
     */
    constructor() {
        super();
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
        this.googleAuth = new GoogleAuth();
        this.googleClient = new this.googleAuth.OAuth2(this.googleClientId, '', '');
    }

    /**
     * Validate a the google token user id
     * @param  {[type]} token [description]
     * @return {Promise}       Return a promise with resolution equals to true if the token is valid
     *                         a rejection with the error otherwise
     */
    validateGoogleToken(token) {
        return new Promise((resolve, reject) => {
            this.googleClient.verifyIdToken(token, this.googleClientId, (error, login) => {
                if (error) {
                    reject(error);
                } else {
                    const payload = login.getPayload();
                    resolve(payload);
                }
            });
        });
    }

    /**
     * @api {post} /login User Login
     * @apiName UserLogin
     * @apiGroup User
     *
     * @apiPermission none
     *
     * @apiParam    {string}    email   User email
     * @apiParam    {string}    password   User password
     *
     * @apiSuccess  {Object}    data                Response data
     * @apiSuccess  {String}    data.access_token  User access token
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "data": {
     *             "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1c2VyIj"
     *          }
     *     }
     *
     * @apiError NOTFOUND Invalid user information
     * @apiErrorExample {json} Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "Message error"
     *     }
     */
    async login(ctx) {
        const body = ctx.request.body;
        // Validations
        const data = this.validator(ctx, body, Joi.object().keys({
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().min(6).required(),
        }));
        // Get the user
        let user;
        try {
            user = await User.findOne({ email: data.email, password: sha256(data.password) });
        } catch (error) {
            ctx.logger.error(error);
            this.responseError(ctx, this.httpErrors.DB_ERROR, error);
        }
        if (!user) {
            const message = 'email or password invalid';
            ctx.logger.warn(message);
            this.responseError(ctx, this.httpErrors.NOT_FOUND_ERROR, message);
        }
        // Generate token
        const accessToken = jwt.sign({
            sub: user.id,
            email: user.email,
        }, process.env.APP_TOKEN, { expiresIn: '1d' });
        const decoded = jwt.decode(accessToken);

        this.responseSuccess(ctx, {
            data: {
                access_token: accessToken,
                iat: decoded.iat,
                exp: decoded.exp,
                email: decoded.email,
            },
        });
    }
}

const loginController = new LoginController();

module.exports = controllerLoader(loginController);
