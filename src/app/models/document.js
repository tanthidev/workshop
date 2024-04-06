const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    event_id: { type: Schema.Types.ObjectId, ref: 'Event' },
    speaker_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    file_url: String,
    timestamp: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema, 'documents');

module.exports = Document;