/**
 * Http Errors handle by de app
 * @type {Object}
 */
module.exports = {
    VALIDATION_ERROR: { name: 'ValidationError', httpCode: 422 },
    DB_ERROR: { name: 'InternalError', httpCode: 500 },
    NOT_FOUND_ERROR: { name: 'NotFound', httpCode: 422 },
    UNAUTHORIZED_ERROR: { name: 'Unauthorized', httpCode: 401 },
    FORBIDDEN_ERROR: { name: 'Forbidden', httpCode: 403 },
    responseError: (ctx, type, error) => { // eslint-disable-line
        const messageError = error.message || error;
        ctx.throw(type.httpCode, `${type.name}:: ${messageError}`);
    },
};
