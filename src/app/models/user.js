const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    full_name: String,
    email: String,
    password: String,
    phone: String,
    gender:{type: String, default:''},
    dob: {type: Date, default:''},
    role: {type: String, default:'participant'},
});

const User = mongoose.model('User', userSchema ,'users');

module.exports = User;