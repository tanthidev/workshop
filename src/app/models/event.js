const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: String,
    description: String,
    dateStart: Date,
    dateEnd: Date,
    location: String,
    speakers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    revenue: {type:Number , default: 0},
    numberOfTickets: {type: Number, default: 0},
    expenses: Number,
    rating: {
        type: [{
            reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
            star: { type: Number },
            comment: String
        }],
        default: null
    },
    backgroundImage: String
});

const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;