import UserController from '../../app/http/controllers/api/v1/userController';
import JudgeController from '../../app/http/controllers/api/v1/judgeController';
import auth from '../../app/http/middlewares/auth';

const API_PREFIX = '/api/v1';

function routeSetter(router) {
    // Users
    router.get(`${API_PREFIX}/users`, auth, UserController.fetch);
    // judges
    router.get(`${API_PREFIX}/judges`, auth, JudgeController.fetch);
}

module.exports = routeSetter;
