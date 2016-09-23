var common = require('../libs/common');
var Category = require('../models/category');

module.exports = {
    list: function(req, res){
        Category.find().populate('user').exec(function(err, data){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            if(!common.isEmpty(data))
                return res.send(200, common.getResultObj(data));

            return res.send(204, common.getResultObj('no_content'));
        });
    },
    find: function(req, res){
        var data = JSON.stringify(req.body);

        Category.find(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    findOne: function(req, res){
        var data = JSON.stringify(req.body);

        Category.findOne(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    save: function(req, res){
        var data = req.body;

        if(common.isEmpty(data._id)){
            Category.findOne({description: data.description}, function(err, docs){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                if(common.isEmpty(docs)){
                    var category = new Category({
                        description: data.description,
                        user: req.user._doc._id
                    });

                    category.save(function(err, docs){
                        if (err)
                            return res.send(400, common.getErrorObj('failed: ' + err));

                        return res.send(201, common.getResultObj(docs));
                    });
                } else {
                    return res.json(common.getErrorObj('category_already_exists'));
                }
            });
        } else {
            Category.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                return res.send(200, common.getSuccessObj());
            });
        }
    },
    delete: function(req, res){
        Category.remove({_id: req.body._id}, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    update: function(req, res){
        var data = req.body;

        Category.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getSuccessObj());
        });
    }
};