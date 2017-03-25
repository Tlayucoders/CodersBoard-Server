import jwt from 'jsonwebtoken';

function login(ctx) {
    ctx.body = {
        access_token: jwt.sign({
            user: 'esau'
        }, process.env.APP_TOKEN, { expiresIn: '7d' })
    };
    ctx.message = 'User logged';
}

function functionProtected(ctx) {
    ctx.body = {
        data: [1,2,3,4]
    };
}

module.exports = {
    login,
    functionProtected
};
