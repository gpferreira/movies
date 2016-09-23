var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var schema = new Schema({
    title : String,
    description : String,
    thumbnail: String,
    extension: String,
    type: String,
    duration: Number,
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    tags : [String],
    active: {type: Boolean, default: true}
});

module.exports = Mongoose.model('Movie', schema);