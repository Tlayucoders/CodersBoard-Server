import HomeController from '../app/http/controllers/homeController';

function routeSetter(router) {
    // Home View
    router.get('/', HomeController.index);
}

module.exports = routeSetter;
