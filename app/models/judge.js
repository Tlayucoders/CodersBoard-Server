import mongorito from 'mongorito';
import Ajv from 'ajv';
import Logger from '../../utils/logger';

const Model = mongorito.Model;
const logger = new Logger();
const ajv = new Ajv({ removeAdditional: true });


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
        this.schema = {
            additionalProperties: false,
            properties: {
                name: {type: 'string', minLength: 1},
                url: {type: 'string', minLength: 1}
            },
            required: [
                'name',
                'url'
            ]
        };
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
