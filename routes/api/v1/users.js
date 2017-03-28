import UserController from '../../../app/http/controllers/api/v1/userController';
import auth from '../../../app/http/middlewares/auth';

function routeSetter(router) {
    router.get('/users', auth, UserController.fetch);
}

module.exports = routeSetter;
