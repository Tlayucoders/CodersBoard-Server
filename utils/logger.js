const winston = require('winston');
const moment = require('moment');

/**
 * Provides a singleton for a logger.
 */
let instance = null;

class Logger {
    constructor() {
        if (!instance) {
            instance = this.createInstance();
        }
        return instance;
    }

    createInstance() {
        const loggerInstance = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    timestamp: () => {
                        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                        return date;
                    }
                }),
                new (winston.transports.File)({ filename: `${__dirname}/../storage/logs/system.log` })
            ]
        });
        return loggerInstance;
    }
}

module.exports = Logger;
