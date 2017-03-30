import UserController from '../../app/http/controllers/api/v1/userController';
import auth from '../../app/http/middlewares/auth';

const API_PREFIX = '/api/v1';

function routeSetter(router) {
    // Users
    router.get(`${API_PREFIX}/users`, auth, UserController.fetch);
}

module.exports = routeSetter;
