const Mongoose = require('mongoose');

const socialAccountSchema = new Mongoose.Schema({
    provider_user_id: { type: String, trim: true, required: true },
    provider: { type: String, trim: true, required: true },
});

const JudgeUserSchema = new Mongoose.Schema({
    user_id: { type: String, trim: true, required: true },
    username: { type: String, trim: true, required: true },
    judge_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'Judge', required: true },
});

const userSchema = new Mongoose.Schema({
    name: { type: String, trim: true, required: true },
    lastname: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    verification_token: { type: String, trim: true, required: true },
    is_active: { type: Boolean, default: false, required: true },
    registration_step: { type: Number, default: 0, required: true },
    social_accounts: [socialAccountSchema],
    judge_users: [JudgeUserSchema],
    hubs: { type: Mongoose.Schema.Types.ObjectId, ref: 'Hub' },
    teams: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Teams' }],
}, { collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('User', userSchema);
