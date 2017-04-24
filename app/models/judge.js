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
        // this.before('create', 'validate');
        // this.before('update', 'validate');
        this.before('save', 'validate');
    }

    setSchema () {
        this.schema = Joi.object().keys({
            name: Joi.string().trim().alphanum().min(3).max(30).required(),
            url: Joi.string().trim().uri(),
            created_at: Joi.date(),
            updated_at: Joi.date()
        });
    }

    async validate(next) {
        const valid = ajv.validate(this.schema, JSON.parse(JSON.stringify(this.attributes)));

        if (!valid) {
            logger.warn(ajv.errorsText());
            throw new Error(ajv.errorsText());
        }
        await next;
    }
}


module.exports = Judge;
