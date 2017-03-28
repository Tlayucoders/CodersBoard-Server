import mongorito from 'mongorito';
import Logger from './../../utils/logger';

const logger = new Logger();

export function connect(callback) {
    mongorito.connect(process.env.MONGODB_URI)
        .then(() => {
            logger.info('MongoDB connection established');
            if (callback) callback();
        })
        .catch(error => {
            logger.warn('Could not connect to MongoDB!');
            logger.error(error);
        });
}

// Disconnect from DB
export function disconnect(callback) {
    mongorito.disconnect()
        .then(() => {
            logger.info('Disconnected from MongoDB.');
            if (callback) callback();
        })
        .catch(error => {
            logger.warn('Could not disconnect to MongoDB!');
            logger.error(error);
        });
}

// Initialize Mongoose
export function init(callback) {
    connect(() => {
        if (callback) callback();
    });
}
