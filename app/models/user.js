import mongorito from 'mongorito';
import Ajv from 'ajv';
import Logger from '../../utils/logger';

const Model = mongorito.Model;
const logger = new Logger();
const ajv = new Ajv({ removeAdditional: true });


/**
 * User Model
 */
class User extends Model {
    configure () {
        this.setSchema();
        this.before('create', 'validate');
        this.before('update', 'validate');
        this.before('save', 'validate');
        this.before('create', 'checkIfExists');
    }

    setSchema () {
        this.schema = {
            additionalProperties: false,
            properties: {
                name: {type: 'string', minLength: 1},
                lastname: {type: 'string', minLength: 1},
                email: {type: 'string', format: 'email', minLength: 1},
                password: {type: 'string', minLength: 1},
                verification_token: {type: 'string', minLength: 1 },
                is_active: {type: 'boolean'},
                social_accounts: {
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            provider_user_id : {type: 'string'},
                            provider_id: {type: 'string'}
                        }
                    }
                },
                judge_users: {
                    type: 'array',
                    uniqueItems: true,
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            user_id: {type: 'string'},
                            username: {type: 'string'},
                            judge_id: {type: 'string'}
                        }
                    }
                }
            },
            required: [
                'name',
                'lastname',
                'email',
                'password',
            ]
        };
    }

    async validate(next) {
        const valid = ajv.validate(this.schema, this.attributes);

        if (!valid) {
            logger.warn(ajv.errorsText());
            throw new Error(ajv.errorsText());
        }
        await next;
    }

    async checkIfExists(next) {
        const user = await User.where('email', this.attributes.email).find();
        if (user.length) {
            logger.warn('The user is already registred');
            throw new Error('The user is already registred');
        }
        await next;
    }
}


module.exports = User;
