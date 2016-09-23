'use strict';

var router = require('express').Router();
var common = require('../libs/common');
var tagCtrl = require('../controllers/tag');
var userCtrl = require('../controllers/user');
var movieCtrl = require('../controllers/movie');
var eventCtrl = require('../controllers/event');
var categoryCtrl = require('../controllers/category');
var dashboardCtrl = require('../controllers/dashboard');

var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

var aws = require('aws-sdk');
aws.config.update({accessKeyId: process.env.ACCESSKEY || 'AKIAJMBQXKR7PFBNK7RQ' , secretAccessKey: process.env.SECRETACCESSKEY || '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'});

module.exports = function(app, passport) {
    router.use(multipartyMiddleware);

    /********************* AUTH *********************/

    router.get('/login', isLoggedIn, function (req, res) {
        res.send(common.getResultObj(req.user));
    });

    router.post('/logon',
        passport.authenticate('local-login-admin'),
        function (req, res) {
            res.send(common.getResultObj(req.user));
        }
    );

    router.post('/logout', function(req, res) {
        req.logout();
        res.send(200);
    });

    /********************* S3 *********************/

    router.get('/putObjectS3', isLoggedIn, function(req, res){
        var storage = new aws.S3();

        storage.getSignedUrl('putObject', {
            Bucket: 'beet-movies',
            Key: req.query.name,
            ACL: 'authenticated-read',
            ContentType: req.query.type
        }, function(err, url) {
            if(err) console.log(err);
            res.send(200, common.getResultObj(url));
        });
    });

    router.get('/getObjectS3', isLoggedIn, function(req, res){
        var storage = new aws.S3();

        storage.getSignedUrl('getObject', {
            Bucket: 'beet-movies',
            Key: req.query.name + '.mp4'
        }, function(err, url) {
            if(err) console.log(err);
            res.send(200, common.getResultObj(url));
        });
    });

    /********************* TAG *********************/

    router.get('/tag', isLoggedIn, tagCtrl.list);

    router.post('/tag/find', function(req, res){
        tagCtrl.findOne(req, res);
    });

    router.post('/tag/save', function(req, res){
        tagCtrl.save(req, res);
    });

    router.post('/tag/update', function(req, res){
        tagCtrl.update(req, res);
    });

    router.get('/tag/:id', function(req, res){
        var data = { body: { id: req.params.id } };
        tagCtrl.findOne(data, res);
    });

    router.delete('/tag/:id', function(req, res){
        tagCtrl.delete(req, res);
    });

    /********************* CATEGORY *********************/

    router.get('/category', isLoggedIn, categoryCtrl.list);

    router.post('/category/find', isLoggedIn, function(req, res){
        categoryCtrl.findOne(req, res);
    });

    router.post('/category/save', isLoggedIn, function(req, res){
        categoryCtrl.save(req, res);
    });

    router.post('/category/update', isLoggedIn, function(req, res){
        categoryCtrl.update(req, res);
    });

    router.get('/category/:id', isLoggedIn, function(req, res){
        var data = { body: { id: req.params.id } };
        categoryCtrl.findOne(data, res);
    });

    router.delete('/category/:id', isLoggedIn, function(req, res){
        categoryCtrl.delete(req, res);
    });

    /********************* FEATURES *********************/

    var featureCtrl = require("../controllers/feature");
    router.get('/feature', isLoggedIn, featureCtrl.list);

    /********************* USER *********************/

    router.get('/user', isLoggedIn, userCtrl.list);

    router.get('/user/:id', isLoggedIn, function(req, res){
        var data = { body: { _id: req.params.id } };
        userCtrl.findOne(data, res);
    });

    router.post('/user/save', isLoggedIn, function(req, res){
        userCtrl.save(req, res);
    });

    /********************* MOVIE *********************/

    router.get('/movie', isLoggedIn, movieCtrl.list);

    router.get('/movie/:id', isLoggedIn, function(req, res){
        var data = { body: { _id: req.params.id } };
        return movieCtrl.findOne(data, res);
    });

    router.post('/movie/save', isLoggedIn, function(req, res){
        return movieCtrl.save(req, res);
    });

    router.post('/movie/update', isLoggedIn, function(req, res){
        return movieCtrl.update(req, res);
    });

    router.get('/movie/history/:id', isLoggedIn, function(req, res){
        var data = { body: { user: req.params.id } };
        return movieCtrl.history(data, res);
    });

    router.get('/movie/progress/:id/:movie', isLoggedIn, function(req, res){
        var data = { body: {
            user: req.params.id,
            movie: req.params.movie
        } };
        return movieCtrl.progress(data, res);
    });

    /********************* EVENT *********************/

    router.post('/event/save', isLoggedIn, function(req, res){
        return eventCtrl.save(req, res);
    });

    router.get('/event/user/:id', isLoggedIn, function(req, res){
        var data = { body: { user: req.params.id } };
        return eventCtrl.find(data, res);
    });

    /********************* DASHBOARD *********************/

    router.get('/dashboard', isLoggedIn, dashboardCtrl.list);

    router.get('/dashboard/history', isLoggedIn, dashboardCtrl.movieHistory);

    return router;
};

// route middleware to check user auth
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) 
    res.send(common.getErrorObj("unauthorized"));
else
    next();
}