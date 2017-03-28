import LoginController from '../app/http/controllers/auth/loginController';
import RegisterController from '../app/http/controllers/auth/registerController';

function routeSetter(router) {
    router.post('/login', LoginController.login);
    router.post('/register', RegisterController.register);
}

module.exports = routeSetter;
