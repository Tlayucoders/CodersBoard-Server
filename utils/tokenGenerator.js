/**
 * Generate a token app and save it into env file
 */

const fs = require('fs');
const crypto = require('crypto');
const Logger = require('./logger');

const logger = new Logger;

crypto.randomBytes(48, (error, buffer) => {
    if (error) {
        logger.error(error);
        return;
    }

    const token = buffer.toString('hex');

    fs.appendFile(`${__dirname}/../.env`, `\nAPP_TOKEN=${token}\n`, (error) => {
        if (error) {
            logger.error(error);
            return;
        }
        logger.info(`Token generated: ${token}`);
    });
});
