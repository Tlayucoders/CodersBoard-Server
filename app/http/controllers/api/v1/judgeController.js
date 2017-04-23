import Judge from '../../../../models/judge';

/**
 * @api {get} /api/v1/judges Request judges information
 * @apiName GetJudges
 * @apiGroup Judge
 *
 * @apiParam    {String}    x-access-token  Access token. No required if this is included in the Headers
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

module.exports = {
    fetch
};
