const Mongoose = require('mongoose');

const RoleSchema = new Mongoose.Schema({
    name: { type: String, trim: true, required: true },
    permissions: [
    ],
}, { collection: 'roles', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('Role', RoleSchema);
