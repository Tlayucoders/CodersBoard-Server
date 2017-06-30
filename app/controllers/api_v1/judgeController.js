const { Controller, controllerLoader } = require('../controller');
const Judge = require('../../models/judge');


class JudgesController extends Controller {
    /**
     * @api {get} /api/v1/judges Request judges information
     * @apiName GetJudges
     * @apiGroup Judge
     *
     * @apiPermission user | admin
     *
     * @apiHeader {String}  x-access-token  Access token
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
     *             "judges": [
     *                  {
     *                      "_id": "58d8b70c4a9f312d045bff35",
     *                      "name": "Uva Online Judge",
     *                      "url": "https://uva.onlinejudge.org/",
     *                  }
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
    async fetch(ctx) {
        let judges;
        try {
            judges = await Judge.find().select([
                '-updatedAt',
                '-createdAt',
                '-__v',
            ]);
        } catch (error) {
            ctx.logger.info(error);
            this.responseError(ctx, this.httpErrorHandler.DB_ERROR, error);
        }

        this.responseSuccess(ctx, { data: { judges } });
    }
}

const judgesController = new JudgesController();

module.exports = controllerLoader(judgesController);
