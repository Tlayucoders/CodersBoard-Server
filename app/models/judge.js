import mongorito from 'mongorito';
import Joi from 'joi';
import Logger from '../../utils/logger';

const Model = mongorito.Model;
const logger = new Logger();

/**
 * Judge Model
 */
class Judge extends Model {
    configure () {
        this.setSchema();
        this.before('save', 'validate');
    }

    /**
     * Model schema used to validations
     */
    setSchema () {
        this.schema = Joi.object().keys({
            _id: Joi.string(),
            name: Joi.string().trim().min(3).max(30).required(),
            url: Joi.string().trim().uri(),
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


}


module.exports = Judge;
