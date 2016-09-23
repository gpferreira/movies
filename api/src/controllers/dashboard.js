var common = require('../libs/common');
var Event = require('../models/event');
var User = require('../models/user');
var Movie = require('../models/movie');
var Category = require('../models/category');

module.exports = {
    list: function(req, res){
        var response = {};

        Event.find().count(function(err, data){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            response.event = data;

            Movie.find().count(function(err, data){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                response.movie = data;

                User.find().count(function(err, data){
                    if (err)
                        return res.send(400, common.getErrorObj('failed: ' + err));

                    response.user = data;

                    Category.find().count(function(err, data) {
                        if (err)
                            return res.send(400, common.getErrorObj('failed: ' + err));

                        response.category = data;

                        /*if(!common.isEmpty(data))
                            return res.send(200, common.getResultObj(response));*/

                        if(!common.isEmpty(data))
                            return res.send(200, common.getResultObj(response));

                        return res.send(204, common.getResultObj('no_content'));
                    });
                });
            });
        });
    },
    movieHistory: function(req, res){
        Event
            .find({type: 'played'})
            //.distinct('movie')
            .lean()
            .populate('movie')
            .populate('user')
            .exec(function(err, data){
                data.forEach(function(item){
                    if(item.movie){
                        if(item.movie['thumbnail']){
                            delete item.movie['thumbnail'];
                        }
                    }
                });

                if(!common.isEmpty(data))
                    return res.send(200, common.getResultObj(data));

                return res.send(204, common.getResultObj('no_content'));
            });
    }
};