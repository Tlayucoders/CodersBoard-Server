import Judge from '../../../../models/judge';
import User from '../../../../models/user';

/**
 * @api {get} /api/v1/judges Request judges information
 * @apiName GetJudges
 * @apiGroup Judge
 *
 * @apiParam    {String}    x-access-token  Access token. No required if this is included in the Headers
 *
 * @apiSuccess  {Object}    data                Response data
 * @apiSuccess  {Object[]}  data.judges         List fo judges
 * @apiSuccess  {String}    data.judges._id     Judge id
 * @apiSuccess  {String}    data.judges.name    Judge name
 * @apiSuccess  {String}    data.judges.url     Judge lastname
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "data": {
 *        	   "judges": [
 *        			{
 *        				"_id": "58d8b70c4a9f312d045bff35",
 *        				"name": "Uva Online Judge",
 *        				"url": "https://uva.onlinejudge.org/",
 *        			}
 *              ]
 *          }
 *     }
 *
 * @apiError JudgesNotFound The was a error getting the judges information
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "Message error"
 *     }
 */
async function fetch(ctx) {
    try {
        const judges = await Judge.exclude('created_at')
            .exclude('updated_at').find();
        ctx.body = {
            data: {
                judges: JSON.parse(JSON.stringify(judges))
            }
        };
    } catch (e) {
        ctx.logger.info(e);
        ctx.throw(404, e);
    }
}

/**
 * @api {post} api/v1/judges/link  Link a judge account
 * @apiName JudgeLink
 * @apiGroup Judge
 *
 * @apiParam    {String}    x-access-token  Access token. No required if this is included in the Headers
 * @apiParam    {string}    user_id    Id of the user registred in the Judge Online
 * @apiParam    {string}    username   Username registred in the Judge Online
 * @apiParam    {string}    judge_id   Id of the judge maped by this api
 *
 * @apiSuccess  (201) {Object}    data                         Response data
 * @apiSuccess  (201) {Object[]}  data.judge_users             Juges Online accounts of the user
 * @apiSuccess  (201) {String}    data.judge_users.user_id     User is in the Judge Online
 * @apiSuccess  (201) {String}    data.judge_users.user_id     User id in the Judge Online
 * @apiSuccess  (201) {String}    data.judge_users.judge_id    Judge Onlide id
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Judge Account Linked
 *
 * @apiError UnprocessableEntity   There was a error with the input data
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "Message error"
 *     }
 */
async function link(ctx) {
    const body = ctx.request.body;
    try {
        let user = await User.findById(ctx.user._id);
        const judge_users = user.get('judge_users') || [];
        judge_users.push({
            user_id: (body.user_id)? body.user_id.trim() : undefined,
            username: (body.username)? body.username.trim() : undefined,
            judge_id: (body.judge_id)? body.judge_id: undefined
        });
        user.set('judge_users', judge_users);

        if (user.set('registration_step') === 1) {
            user.set('registration_step', 2);
        }

        await user.save();

        user = JSON.parse(JSON.stringify(user));
        ctx.status = 201;
        ctx.message = 'Judge Account Linked';
        ctx.body = {
            data: {
                judge_users: user.judge_users
            }
        };
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(422, e);
    }
}

module.exports = {
    fetch,
    link
};
