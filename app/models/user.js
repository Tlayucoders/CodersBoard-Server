/**
 * User Schema
 *
 * {
 *     name: String,
 *     lastname: String,
 *     email: String,
 *     password: String,
 *     verification_token: String,
 *     is_active: Boolean,
 *     social_accounts: [
 *          {
 *              provider_user_id: String,
 *              provider_id: String
 *          }
 *     ],
 *     judge_users: [
 *          {
 *              user_Id: String,
 *              username: String,
 *              judge_id: String
 *          }
 *     ],
 *     created_at: Date,
 *     updated_at: Date,
 * }
 */

import mongorito from 'mongorito';

const Model = mongorito.Model;

/**
 * User Model
 */
class User extends Model {
    configure () {
        this.before('create', 'checkIfExists');
    }

    async checkIfExists(next) {
        const user = await User.where('email', this.attributes.email).find();
        if (user.length) {
            throw new Error('The user is already registred');
        }
        await next;
    }
}


module.exports = User;
