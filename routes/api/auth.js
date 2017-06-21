const LoginController = require('../../app/http/controllers/auth/loginController');
const RegisterController = require('../../app/http/controllers/auth/registerController');

/**
 * Set the routes defined inside
 * @param {object}  router  koa router object
 */
function routeSetter(router) {
    router.post('/login', LoginController('login'));
    router.post('/register', RegisterController('register'));
}

module.exports = routeSetter;
