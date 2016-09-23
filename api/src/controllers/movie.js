var common = require('../libs/common');
var aws = require('../libs/aws');
var Movie = require('../models/movie');
var Event = require('../models/event');
var q = require('q');

module.exports = {
    list: function(req, res){
        if(req.user._doc.category.length == 0){
            Movie
                .find({active: true})
                .populate('movie')
                .populate('category')
                .exec(function(err, data){
                    if (err)
                        return res.send(400, common.getErrorObj('failed: ' + err));

                    if(!common.isEmpty(data))
                        return res.send(200, common.getResultObj(data));

                    return res.send(204, common.getResultObj('no_content'));
                });
        }
        else {
            Movie
                .find({active: true})
                .where('category').in(req.user._doc.category)
                .populate('movie')
                .populate('category')
                .exec(function(err, data){
                    if (err)
                        return res.send(400, common.getErrorObj('failed: ' + err));

                    if(!common.isEmpty(data))
                        return res.send(200, common.getResultObj(data));

                    return res.send(204, common.getResultObj('no_content'));
                });
        }
    },
    find: function(req, res){
        var data = JSON.stringify(req.body);

        Movie.find(data).populate('category').exec(function(err, movies){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(movies));
        });
    },
    findOne: function(req, res){
        Movie.findOne({_id: req.body._id}).populate('category').exec(function(err, movie){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(movie));
        });
    },
    save: function(req, res){
        var data = req.body;

        if(common.isEmpty(data._id)){
            Movie.findOne({title: data.title}, function(err, docs){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                var newTags = [];
                data.tags.forEach(function(value){
                    if(value.indexOf('#') == -1)
                        value = '#' + value;
                    newTags.push(value);
                });

                var category = [];
                data.category.forEach(function(item){
                    category.push(item._id);
                });

                if(common.isEmpty(docs)){
                    var movie = new Movie({
                        title: data.title,
                        description: data.description,
                        //thumbnail: new Buffer(data.thumbnail, 'base64'),
                        thumbnail: data.thumbnail,
                        type: data.type,
                        extension: data.extension,
                        duration: data.duration,
                        user: req.user._doc._id,
                        //tags: data.tags
                        tags: newTags,
                        category: category
                    });

                    movie.save(function(err, docs){
                        if (err)
                            return res.send(400, common.getErrorObj('failed: ' + err));

                        return res.send(201, common.getResultObj(docs));
                    });
                } else {
                    return res.json(common.getErrorObj('movie_already_exists'));
                }
            });
        } else {
            Movie.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                return res.send(200, common.getSuccessObj());
            });
        }
    },
    delete: function(req, res) {
        Movie.remove({_id: req.body._id}, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    update: function(req, res) {
        var data = req.body;

        Movie.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getSuccessObj());
        });
    },
    history: function (req, res) {
        var response = {};
        var data = req.body;

        var filter = {user: data.user, type: 'played'};

        Event
            .find(filter)
            .distinct('movie')
            .lean()
            .exec(function(err, data){
                if (err)
                    return res.json(common.getErrorObj('event_query_failed'));

                Movie
                    .find()
                    .where('_id').in(data)
                    .lean()
                    .exec(function(err, data){
                        if (err)
                            return res.json(common.getErrorObj('movie_query_failed'));

                        data.forEach(function(item){
                            delete item.thumbnail;
                        });
                        response.movie = data;

                        Event
                            .find(filter)
                            .count(function(err, data){
                                response.event = data;

                                return res.json(common.getResultObj(response));
                            });

                        //for(var i = 0; i < data.length; i++){
                        //    Event
                        //        .find({user: data.user, type: 'ended', movie: data[i]._id})
                        //        .lean()
                        //        .exec(function(err, data){
                        //            console.log(data);
                        //        });
                        //}

                        //return res.json(common.getResultObj(data));
                    });
            });
    },
    progress: function(req, res){
        var data = req.body;

        Event
            .find({user: data.user, movie: data.movie, type: 'ended'})
            .lean()
            .exec(function(err, data){
                var progress = 50;
                if(data.length > 0)
                    progress = 100;
                return res.send(200, common.getResultObj(progress));
            });
    }
};