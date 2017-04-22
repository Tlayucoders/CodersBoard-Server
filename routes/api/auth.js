import LoginController from '../../app/http/controllers/auth/loginController';
import RegisterController from '../../app/http/controllers/auth/registerController';
import auth from '../../app/http/middlewares/auth';

function routeSetter(router) {
    router.post('/login', LoginController.login);
    router.post('/register', RegisterController.register);
    router.post('/register/link', auth, RegisterController.accountLink);
}

module.exports = routeSetter;
