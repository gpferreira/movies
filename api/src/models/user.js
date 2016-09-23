// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user model
var userSchema = new Schema({
    local            : {
        email        : String,
        username     : String,
        password     : String,
        name         : String,
        phone        : String,
        cpf          : String
    },
    supervisor   : Boolean,
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    profile: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
    active: {type: Boolean, default: true}
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.validCpf = function(cpf) {
    console.log(this.local.cpf);
    return cpf.toString()==this.local.cpf;
};

module.exports = mongoose.model('User', userSchema);