const Mongoose = require('mongoose');

const hubSchema = new Mongoose.Schema({
    name: { type: String, trim: true, required: true },
    unique_key: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: false },
    institution: { type: String, trim: true, required: false },
    phone: { type: String, trim: true, required: false },
    contact: { type: String, trim: true, required: false },
    address: { type: String, trim: true, required: false },
    zip_code: { type: Number, required: false },
    state: { type: String, trim: true, required: false },
    country: { type: String, trim: true, required: false },
    img_logo: { data: Buffer, contentType: String },
    img_background: { data: Buffer, contentType: String },
}, { collection: 'hubs', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Mongoose.model('Hub', hubSchema);
