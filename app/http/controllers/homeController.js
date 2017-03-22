async function index(ctx) {
    await ctx.render('templates/main');
    //await ctx.render('pages/home');
}

module.exports = {
    index
};
