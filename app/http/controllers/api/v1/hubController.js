import Hub from '../../../../models/hub';

/**
 * @api {get} /api/v1/hubs Request hubs information
 * @apiName GetHubs
 * @apiGroup Hub
 *
 * @apiParam    {String}        x-access-token  Access token. No required if this is included in the Headers
 * @apiParam    {name}          name            Hub name
 * @apiParam    {description}   name            Hub description (Optional)
 *
 * @apiSuccess  {Object}    data            Response data
 * @apiSuccess  {Object}    data.hub        Hub created
 * @apiSuccess  {String}    data.hub._id    Hub id
 * @apiSuccess  {String}    data.hub.name   Hub name
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Hub Registered
 *     {
 *          "data": {
 *        	   "hub": {
 *        			"_id": "58d8b70c4a9f312d045bff35",
 *        			"name": "Universidad X",
 *        			"description": "Hub of Universidad X",
 *              }
 *          }
 *     }
 *
 * @apiError UnprocessableEntity   There was a error with the input data
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "Message error"
 *     }
 */
async function create(ctx) {
    const body = ctx.request.body;
    try {
        const hub = new Hub({
            name: (body.name)? body.name.trim(): undefined,
            description: (body.description)? body.description.trim() : undefined
        });

        if (await Hub.where('name', body.name.trim()).findOne()) {
            throw new Error('Hub already exists');
        }

        await hub.save();

        ctx.message = 'Hub Registered';
        ctx.body = {
            data: {
                hubs: JSON.parse(JSON.stringify(hub))
            }
        };
    } catch (e) {
        ctx.logger.info(e);
        ctx.throw(422, e);
    }
}

module.exports = {
    create
};
