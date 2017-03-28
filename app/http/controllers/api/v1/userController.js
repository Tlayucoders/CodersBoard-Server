import User from '../../../../models/user';

async function fetch(ctx) {
    try {
        const users = await User.exclude('password').find();
        ctx.body = {
            data: {
                users: JSON.parse(JSON.stringify(users))
            }
        };
    } catch (e) {
        ctx.logger.info(e);
        ctx.throw(404, e);
    }
}

module.exports = {
    fetch
};
