import fs from 'fs';
import { init } from './app/system/mongoose';
import koa from './app/system/koa';

const configFileByEnv = process.argv[2] ? process.argv[2] : './config/system_variables.json';
/**
 * Init project
 * @param {object} config - Application params
 */
function run(config) {
    process.env.PORT = process.env.PORT || config.port;
    process.env.APP_NAME = config.app_name || 'CodersBoard';
    process.env.APP_URL = config.app_url || '';

    process.env.MONGODB_URI = config.mongodb_uri || 'localhost';
    process.env.MONGODB_USER = config.mongodb_user || '';
    process.env.MONGODB_PASSWORD = config.mongodb_password || '';
    process.env.MONGODB_DEBUG = config.mongodb_debug || false;
    // Mongoose and Server Initialization
    init(() => koa());
}

fs.readFile(configFileByEnv, 'utf8', (err, configData) => {
    if (err) {
        console.log(err); // eslint-disable-line
    } else {
        run(JSON.parse(configData));
    }
});
