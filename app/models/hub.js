const Mongoose = require('mongoose');

const hubSchema = new Mongoose.Schema({
    name: { type: String, trim: true, required: true },
    unique_key: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: false },
}, { collection: 'hubs', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('Hub', hubSchema);
