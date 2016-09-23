var common = require('../libs/common');
var User = require('../models/user');
var Profile = require('../models/profile');

module.exports = {
    list: function(req, res){
        User.find().populate('user').populate('profile').populate('category').exec(function(err, data){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            if(!common.isEmpty(data))
                return res.send(200, common.getResultObj(data));

            return res.send(204, common.getResultObj('no_content'));
        });
    },
    find: function(req, res){
        var data = JSON.stringify(req.body);

        User.find(data).populate('profile').populate('category').exec(function(err, users){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(users));
        });
    },
    findOne: function(req, res){
        User.findOne({_id: req.body._id}).populate('profile').populate('category').exec(function(err, user){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            user._doc.local.password = '';
            return res.send(200, common.getResultObj(user._doc));
        });
    },
    save: function(req, res){
        var data = req.body;

        if(common.isEmpty(data._id)){
            User.findOne({username: data.local.username}, function(err, docs){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                if(common.isEmpty(docs)){
                    Profile.findOne({description: 'user'}, function(err, doc){

                        var category = [];
                        data.category.forEach(function(item){
                            category.push(item._id);
                        });

                        var user = new User({
                            local            : {
                                email        : data.local.email,
                                username     : data.local.username,
                                name         : data.local.name,
                                phone        : data.local.phone,
                                cpf          : data.local.cpf
                            },
                            supervisor   : data.supervisor,
                            user: req.user._doc._id,
                            profile: doc._doc._id,
                            category: category
                        });

                        user.local.password = user.generateHash(data.local.password);

                        user.save(function(err, docs){
                            if (err)
                                return res.send(400, common.getErrorObj('failed: ' + err));

                            return res.send(201, common.getResultObj(docs));
                        });
                    });
                } else {
                    return res.json(common.getErrorObj('movie_already_exists'));
                }
            });
        } else {
            if ((data.local.password != undefined) && (data.local.password != ''))
                data.local.password = new User().generateHash(data.local.password);

            User.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
                if (err)
                    return res.send(400, common.getErrorObj('failed: ' + err));

                return res.send(200, common.getSuccessObj());
            });
        }
    },
    delete: function(req, res){
        User.remove({_id: req.body._id}, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    update: function(req, res){
        var data = req.body;

        User.update({_id: req.body._id}, {$set: data}, {upsert: true}, function(err){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getSuccessObj());
        });
    }
};