var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var schema = new Schema({
    description : String,
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    active: {type: Boolean, default: true}
});

module.exports = Mongoose.model('Category', schema);