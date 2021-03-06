/**
 * Load environment variables
 */
const Mongoose = require('mongoose');
const Dotenv = require('dotenv');
const Logger = require('../../utils/logger');
const judgeSeeder = require('./judgeDocumentSeeder');

Mongoose.Promise = global.Promise;

const logger = new Logger();
Dotenv.config();

/* eslint no-restricted-syntax: 0 */
/* eslint no-await-in-loop: 0 */

/**
 * Databse Seeder
 * @param {Class} Model     Mongorito Model
 * @param {array} records   array of records (object) to save
 */
async function seeder(Model, records) {
    try {
        for (const item of records) {
            const record = new Model(item);
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
        await Mongoose.connect(process.env.MONGODB_URI);
        logger.info('Seeding database');

        await judgeSeeder(seeder);

        logger.info('Database seeded');
        await Mongoose.disconnect();
    } catch (e) {
        logger.error(e);
    }
})();
