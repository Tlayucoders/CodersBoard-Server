import HomeController from '../app/http/controllers/homeController';

function routeSetter(router) {
    router.get('/', HomeController.index);
}

module.exports = routeSetter;
