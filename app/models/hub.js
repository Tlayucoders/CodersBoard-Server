import mongorito from 'mongorito';
import Logger from '../../utils/logger';
import Joi from 'joi';

const Model = mongorito.Model;
const logger = new Logger();


/**
 * Judge Model
 */
class Jub extends Model {
    configure () {
        this.setSchema();
        this.before('save', 'validate');
        this.before('create', 'checkIfExists');
    }

    /**
     * Model schema used to validations
     */
    setSchema () {
        this.schema = Joi.object().keys({
            _id: Joi.string(),
            unique_key: Joi.string(),
            name: Joi.string().min(3).max(30).required(),
            description: Joi.string().min(3),
            created_at: Joi.date(),
            updated_at: Joi.date()
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
            logger.warn(ans.error.toString());
            throw new Error(ans.error.toString());
        }
        await next;
    }

    /**
     * Validate if the record exists throw a exception if this exists
     * @param {function} next callback function
     */
    async checkIfExists(next) {
        const hub = await Jub.where('unique_key', this.attributes.unique_key).findOne();
        if (hub) {
            const error = 'ValidationError:: The hub is already registred';
            logger.error(error);
            throw new Error(error);
        }
        await next;
    }
}


module.exports = Jub;
