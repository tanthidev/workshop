const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    event_id: { type: Schema.Types.ObjectId, ref: 'Event' },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema, 'chats');

module.exports = Chat;