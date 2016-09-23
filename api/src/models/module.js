var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var schema = new Schema({
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    profile: [{type: Schema.Types.ObjectId, ref: 'Profile'}]
});

module.exports = Mongoose.model('Module', schema);