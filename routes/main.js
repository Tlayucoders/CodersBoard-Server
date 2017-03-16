function routeSetter(router) {
    router.get('/', (ctx) => {
        ctx.body = 'CodersBoard is on fire!';
    });
}

module.exports = routeSetter;
