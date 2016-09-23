var common = require('../libs/common');
var Feature = require('../models/feature');
var Module = require('../models/module');
var Profile = require('../models/profile');
var User = require('../models/user');

module.exports = {
    list: function(req, res){
        User
            .findOne({'_id': req.user._doc._id})
            .populate({path: 'profile', select: '_id'})
            .lean()
            .exec(function(err, data){
                if (err)
                    return res.json(common.getErrorObj('user_query_failed'));

                Module
                    .find()
                    .where('profile').in(data.profile)
                    .select('_id')
                    .lean()
                    .exec(function(err, modules){
                        if (err)
                            return res.json(common.getErrorObj('module_query_failed'));

                        Feature
                            .find()
                            .where('module').in(modules)
                            .lean()
                            .exec(function(err, data){
                                if (err)
                                    return res.json(common.getErrorObj('feature_query_failed'));

                                return res.json(common.getResultObj(data));
                            });
                    });
            });
    }
};