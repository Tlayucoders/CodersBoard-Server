import { ObjectID } from 'mongorito';
import Hub from '../../../../models/hub';
import User from '../../../../models/user';
import uniqueToken from '../../../../../utils/uniqueToken';

/**
 * @api {post} /api/v1/hubs Create a new hub
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
 * @apiSuccess  {String}    data.hub.unique_key    Hub id
 * @apiSuccess  {String}    data.hub.name   Hub name
 * @apiSuccess  {String}    data.hub.description   Hub description
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
            unique_key: uniqueToken(body.name),
            name: body.name,
            description: body.description
        });

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

/**
 * @api {patch} /api/v1/hubs/:hub_id/link Link the current user with a hub
 * @apiName HubLink
 * @apiGroup Hub
 *
 * @apiPermission user
 *
 * @apiParam    {String}    x-access-token  Access token. No required if this is included in the Headers
 *
 * @apiSuccess (204) {Null} - Not content
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 Hub Linked
 *
 * @apiError UnprocessableEntity   There was a error with the input data
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 422 Unprocessable Entity
 *     {
 *       "Message error"
 *     }
 */
async function link(ctx) {
    const params = ctx.params;
    try {
        const user = await User.findById(ctx.user._id);
        if (!user) {
            throw new Error('User not Found');
        }

        const hub = await Hub.findById(params.hub_id);
        if (!hub) {
            throw new Error('Hub not Found');
        }

        const hubs = user.get('hubs') || [];

        if (hubs.includes(params.hub_id)) {
            throw new Error('User is already in the hub');
        }

        hubs.push(ObjectID(params.hub_id));
        user.set('hubs', hubs);
        await user.save();

        ctx.status = 204;
        ctx.message = 'User Linked to the Hub';
    } catch (e) {
        ctx.logger.error(e);
        ctx.throw(422, e);
    }
}

module.exports = {
    create,
    link
};
