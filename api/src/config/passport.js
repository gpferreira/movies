var LocalStrategy   = require('passport-local').Strategy;
var User       		= require('../models/user');
var common          = require('../libs/common');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        User.findOne({ '_id' :  user._id }, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login-admin', new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User
                .findOne({ 'local.username' :  username })
                .populate({path: 'profile', select: 'description'})
                .exec(function(err, user) {

                    if(err)
                        return done(null, false, err);

                    if (!user)
                        return done(null, false, common.getErrorObj("user_not_found"));

                    if(user.errors)
                        return done(user.errors, common.getErrorObj("query_failed"));

                    if (!user.validPassword(password))
                        return done(null, false, common.getErrorObj("invalid_password"));

                    return done(null, user);
                });

        }));
};
