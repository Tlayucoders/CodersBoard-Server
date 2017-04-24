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
        // this.before('create', 'validate');
        // this.before('update', 'validate');
        this.before('save', 'validate');
    }

    setSchema () {
        this.schema = Joi.object().keys({
            name: Joi.string().alphanum().min(3).max(30).required(),
            description: Joi.string().min(3),
            created_at: Joi.date(),
            updated_at: Joi.date()
        });
    }

    async validate(next) {
        const ans = Joi.validate(JSON.parse(JSON.stringify(this.attributes)), this.schema);

        if (ans.error) {
            logger.warn(ans.error.toString());
            throw new Error(ans.error.toString());
        }
        await next;
    }
}


module.exports = Jub;
