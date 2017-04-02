import User from '../../../models/user';
import sha256 from '../../../../utils/sha256';

async function register(ctx) {
    try {
        let user = new User({
            name: ctx.request.body.name || '',
            lastname: ctx.request.body.lastname  || '',
            email: ctx.request.body.email || '',
            password: sha256(ctx.request.body.password)  || ''
        });

        await user.save();
        user = JSON.parse(JSON.stringify(user));
        delete user.password;

        ctx.status = 201;
        ctx.message = 'User was registered';
        ctx.body = {
            data: {
                user: user
            }
        };
    } catch (e) {
        ctx.throw(422, e);
    }
}

module.exports = {
    register
};
