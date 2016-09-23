var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var schema = new Schema({
    path: String,
    dataTranslate: String,
    class: String,
    parent: Boolean,
    module: [{type: Schema.Types.ObjectId, ref: 'Module'}]
});

module.exports = Mongoose.model('Feature', schema);