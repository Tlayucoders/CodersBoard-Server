/**
 * Load environment variables
 */
const Dotenv = require('dotenv');

/**
 * laod init db function
 */
const { init } = require('./app/system/mongoose');

/**
 * Load init koa function
 */
const koa = require('./app/system/koa');

Dotenv.config();

/**
 * Init the server
 */
init(() => koa());
