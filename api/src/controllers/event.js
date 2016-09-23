var common = require('../libs/common');
var Event = require('../models/event');

module.exports = {
    list: function(req, res){
        Event.find().populate('user').exec(function(err, data){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            if(!common.isEmpty(data))
                return res.send(200, common.getResultObj(data));

            return res.send(204, common.getResultObj('no_content'));
        });
    },
    find: function(req, res){
        var data = JSON.stringify(req.body);

        Event.find(data).populate('movie').exec(function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    findOne: function(req, res){
        var data = JSON.stringify(req.body);

        Event.findOne(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    save: function(req, res){
        var data = req.body;

        if((!common.isEmpty(data.type)) && (!common.isEmpty(data.movie))) {
            var event = new Event({
                type: data.type,
                user: req.user._doc._id,
                movie: data.movie
            });

            event.save(function(err, docs){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                return res.send(201, common.getResultObj(docs));
            });
        }
    },
    delete: function(req, res){
        Event.remove({_id: req.body._id}, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    }
};