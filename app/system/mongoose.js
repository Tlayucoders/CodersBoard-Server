import mongoose from 'mongoose';

import loader from './../../utils/fileLoader';
import Logger from './../../utils/logger';

mongoose.Promise = global.Promise;

const logger = new Logger();

// Load mongoose models
function loadModels(callback) {
    const modelsPath = `${__dirname}/../models`;
    loader(modelsPath, (model) => {
        require(model);
    });

    if (callback) callback();
}

// Connect to DB
export function connect(callback) {
    const options = {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD
    };

    const db = mongoose.connect(`${process.env.MONGODB_URI}`,
    options, (err) => {
        if (err) {
            logger.warn('Could not connect to MongoDB!');
            logger.error(err);
        } else {
            logger.info('MongoDB connection established');
            // Enabling mongoose debug mode if required
            mongoose.set('debug', (process.env.MONGODB_DEBUG === 'true'));

            // Call callback FN
            if (callback) callback(db);
        }
    });
}

// Disconnect from DB
export function disconnect(callback) {
    mongoose.disconnect((err) => {
        if (err) {
            logger.warn('Could not disconnect to MongoDB!');
            logger.error(err);
        } else {
            logger.info('Disconnected from MongoDB.');
            if (callback) callback();
        }
    });
}

// Initialize Mongoose
export function init(callback) {
    connect(() => {
        loadModels(() => {
            logger.info('Loaded Models');
            if (callback) callback();
        });
    });
}
