function routeSetter(router) {
    router.get('/', (ctx) => {
        console.log('test emthod -> get');
        ctx.body = 'Hello World';
    });
}

module.exports = routeSetter;
