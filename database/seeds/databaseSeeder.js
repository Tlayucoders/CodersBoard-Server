/**
 * Load environment variables
 */
import Dotenv from 'dotenv'; Dotenv.config();

import mongorito from 'mongorito';
import judgeSeeder from './judgeDocumentSeeder';
import Logger from '../../utils/logger';

const logger = new Logger();

/**
 * Databse Seeder
 * @param {Class} Model     Mongorito Model
 * @param {array} records   array of records (object) to save
 */
async function seeder(Model, records) {
    try {
        for (const item of records) {
            const record = await new Model(item);
            await record.save();
            logger.info('Record saved:', Model.name);
            logger.info(JSON.parse(JSON.stringify(record)));
        }
    } catch (e) {
        logger.info(e);
    }
}

/**
 * Init function, start mongo connections and seed the records
 */
(async () => {
    try {
        await mongorito.connect(process.env.MONGODB_URI);
        logger.info('Seeding database');

        await judgeSeeder(seeder);

        logger.info('Database seeded');
        await mongorito.disconnect();
    } catch (e) {
        logger.error(e);
    }
})();
