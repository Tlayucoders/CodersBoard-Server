import mongorito from 'mongorito';
import Logger from '../../utils/logger';
import Joi from 'joi';

const Model = mongorito.Model;
const logger = new Logger();


/**
 * User Model
 */
class User extends Model {
    configure () {
        this.setSchema();
        // this.before('create', 'validate');
        // this.before('update', 'validate');
        this.before('save', 'validate');
        this.before('create', 'checkIfExists');
    }

    /**
     * Model schema used to validations
     */
    setSchema () {
        this.schema = Joi.object().keys({
            _id: Joi.string(),
            name: Joi.string().trim().min(3).max(30).required(),
            lastname: Joi.string().trim().min(3).max(30).required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().trim().min(6).required(),
            verification_token: Joi.string(),
            is_active: Joi.boolean(),
            registration_step: Joi.number().integer().positive(),
            social_accounts: Joi.array().items(Joi.object().keys({
                provider_user_id: Joi.string().trim().min(3).required(),
                provider_id: Joi.string().trim().min(3).required()
            })).unique((a, b) => a.provider_user_id === b.provider_user_id && a.provider_id === b.provider_id),
            judge_users: Joi.array().items(Joi.object().keys({
                user_id: Joi.string().trim().min(3).required(),
                username: Joi.string().trim().min(3).required(),
                judge_id: Joi.string().trim().min(3).required(),
            })).unique((a, b) => a.user_id === b.user_id && a.judge_id === b.judge_id),
            hubs: Joi.array().items(Joi.string()).unique((a, b) => a === b),
            teams: Joi.array().items(Joi.string()).unique((a, b) => a === b),
            created_at: [Joi.date(), Joi.string()],
            updated_at: [Joi.date(), Joi.string()]
        });
    }

    /**
     * Validate the record attributes throw a exception if is invalid
     * @param {function} next callback function
     */
    async validate(next) {
        const ans = Joi.validate(JSON.parse(JSON.stringify(this.attributes)), this.schema, {
            convert: false
        });
        if (ans.error) {
            logger.error(ans.error);
            throw new Error(`${ans.error.name}:: ${ans.error.details[0].message}`);
        }
        await next;
    }

    /**
     * Validate the record attributes throw a exception if is invalid
     * @param {function} next callback function
     */
    async checkIfExists(next) {
        const user = await User.where('email', this.attributes.email).findOne();
        if (user) {
            const error = 'ValidationError:: The user is already registred';
            logger.error(error);
            throw new Error(error);
        }
        await next;
    }
}


module.exports = User;
