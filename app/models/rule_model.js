import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
    gnip_id: { type: String, default: '', trim: true },
    data_entity_id: { type: String, trim: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'Consumer', required: true },
    rule: { type: String, default: '', required: true, trim: true },
    consumption_total: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    connections: [{
        _id: mongoose.Schema.Types.ObjectId,
        start: Date,
        finish: Date,
        status: { type: String, default: 'PENDING' },
    }],
    data_limit: { type: Number, default: 0 }
}, { collection: 'kairoz_rule' });

export default mongoose.model('Rule', ruleSchema);
