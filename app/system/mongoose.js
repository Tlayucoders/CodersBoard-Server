const Mongoose = require('mongoose');
const Logger = require('../../utils/logger');
const fileLoader = require('../../utils/fileLoader');

// const { softDelete } = require('./mongoosePlugins');

Mongoose.Promise = global.Promise;
// Mongoose.plugin(softDelete);

const logger = new Logger();

/**
 * Load the mongoose models
 * @param {function}    callback    Callback function
 */
function loadModels(callback) {
    const modelsPath = `${__dirname}/../models`;
    fileLoader(modelsPath, (modelPath) => require(modelPath)); // eslint-disable-line
    if (callback) callback();
}

/**
 * Initialize the connection to the db
 * @param {function}    Callback    Callback function
 */
function connect(callback) {
    const options = {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
    };

    const db = Mongoose.connect(process.env.MONGODB_URI, options, (err) => {
        if (err) {
            logger.warn('Could not connect to MongoDB!');
            logger.error(err);
        } else {
            logger.info('MongoDB connection established');
            // Enabling mongoose debug mode if required
            Mongoose.set('debug', (process.env.MONGODB_DEBUG === 'true'));
            if (callback) callback(db);
        }
    });
}

/**
 * Finalize the connection to the db
 * @param {function}    callback    Callback function
 */
function disconnect(callback) {
    Mongoose.disconnect((err) => {
        if (err) {
            logger.warn('Could not disconnect to MongoDB!');
            logger.error(err);
        } else {
            logger.info('Disconnected from MongoDB.');
            if (callback) callback();
        }
    });
}

/**
 * Initialize the connection process
 * @param {function}    callback    Callback function
 */
function init(callback) {
    connect(() => {
        loadModels(() => {
            logger.info('Loaded Models');
            if (callback) callback();
        });
    });
}

module.exports = { init, connect, disconnect };
