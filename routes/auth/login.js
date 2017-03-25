import LoginController from '../../app/http/controllers/auth/loginController';
import auth from '../../app/http/middlewares/auth.js';

function routeSetter(router) {
    router.post('/login', LoginController.login);
    router.get('/protected', auth, LoginController.functionProtected);
}

module.exports = routeSetter;
