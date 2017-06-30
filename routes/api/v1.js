const UserController = require('../../app/controllers/api_v1/userController');
const JudgeController = require('../../app/controllers/api_v1/judgeController');
const HubController = require('../../app/controllers/api_v1/hubController');
const auth = require('../../app/middlewares/auth');

const API_PREFIX = '/v1';

/**
 * Set the routes defined inside
 * @param {object}  router  koa router object
 */
function routeSetter(router) {
    // Users
    router.get(`${API_PREFIX}/users`, auth, UserController('fetch'));
    // judges
    router.get(`${API_PREFIX}/judges`, auth, JudgeController('fetch'));
    router.patch(`${API_PREFIX}/judges/link`, auth, JudgeController('link'));
    // Hubs
    router.get(`${API_PREFIX}/hubs`, auth, HubController('fetch'));
    router.post(`${API_PREFIX}/hubs`, auth, HubController('create'));
    router.put(`${API_PREFIX}/hubs/:hub_id`, auth, HubController('update'));
    router.delete(`${API_PREFIX}/hubs/:hub_id`, auth, HubController('delete'));
    router.get(`${API_PREFIX}/hubs/:hub_id/users`, auth, HubController('getUsers'));
    // User
    router.patch(`${API_PREFIX}/users/:user_id/hubs/:hub_id`, auth, HubController('linkHub'));
    router.delete(`${API_PREFIX}/users/:user_id/hubs/:hub_id`, auth, HubController('unlinkHub'));
    router.patch(`${API_PREFIX}/users/:user_id/judge/:judge_id`, auth, HubController('addJudgeAccount'));
    router.delete(`${API_PREFIX}/users/:user_id/judge/:judge_id`, auth, HubController('removeJudgeAccount'));
}

module.exports = routeSetter;
