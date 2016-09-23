var common = require('../libs/common');
var Module = require('../models/module');

module.exports = {
    list: function(req, res){
        Module.find().populate('user').exec(function(err, data){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            if(!common.isEmpty(data))
                return res.send(200, common.getResultObj(data));

            return res.send(204, common.getResultObj('no_content'));
        });
    },
    find: function(req, res){
        var data = JSON.stringify(req.body);

        Module.find(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    findOne: function(req, res){
        var data = JSON.stringify(req.body);

        Module.findOne(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    save: function(req, res){
        var data = req.body;

        if(common.isEmpty(data._id)){
            Module.findOne({description: data.description}, function(err, docs){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                if(common.isEmpty(docs)){
                    var module = new Module({
                        description: data.description,
                        user: req.user._doc._id
                    });

                    module.save(function(err, docs){
                        if (err)
                            return res.send(400, common.getErrorObj('failed: ' + err));

                        return res.send(201, common.getResultObj(docs));
                    });
                } else {
                    return res.json(common.getErrorObj('profile_already_exists'));
                }
            });
        } else {
            Module.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                return res.send(200, common.getSuccessObj());
            });
        }
    },
    delete: function(req, res){
        Module.remove({_id: req.body._id}, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    update: function(req, res){
        var data = req.body;

        Module.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getSuccessObj());
        });
    }
};