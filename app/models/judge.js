const Mongoose = require('mongoose');

const judgeSchema = new Mongoose.Schema({
    name: { type: String, trim: true, required: true },
    url: { type: String, trim: true, required: true },
}, { collection: 'judges', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('Judge', judgeSchema);
