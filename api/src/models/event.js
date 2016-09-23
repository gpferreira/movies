var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var schema = new Schema({
    type : String,
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    movie: { type: Schema.Types.ObjectId, ref: 'Movie'}
});

module.exports = Mongoose.model('Event', schema);