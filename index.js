/**
 * Load environment variables
 */
import Dotenv from 'dotenv'; Dotenv.config();

/**
 * laod init db function
 */
import { init } from './app/system/mongoose';

/**
 * Load init koa funtion
 */
import koa from './app/system/koa';

/**
 * Init the server
 */
init(() => koa());
