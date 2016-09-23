var common = require('../libs/common');
var Customer = require('../models/customer');

module.exports = {
    list: function(req, res){
        Customer.find(function(err, data){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            if(!common.isEmpty(data))
                return res.send(200, common.getResultObj(data));

            return res.send(204, common.getResultObj('no_content'));
        });
    },
    find: function(req, res){
        var data = JSON.stringify(req.body);

        Customer.find(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    findOne: function(req, res){
        var data = JSON.stringify(req.body);

        Customer.findOne(data, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    save: function(req, res){
        var data = req.body;

        var cpf = data.cpf.replace(/\D/g,'');

        if (!common.validCPF(cpf)) {
            return res.send(400, common.getErrorObj('invalid_cpf'));
        }

        Customer.findOne({cpf: data.cpf}, function(err, docs){
            if(err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            if(common.isEmpty(docs)){
                var customer = new Customer({
                    cpf: data.cpf,
                    name: data.name,
                    email: data.email,
                    marital_status: data.marital_status,
                    address: data.address,
                    phone_numbers: data.phone_numbers
                });

                customer.save(function(err, docs){
                    if (err)
                        return res.send(400, common.getErrorObj('failed: ' + err));

                    return res.send(201, common.getResultObj(docs));
                });
            }
            else {
                return res.json(common.getErrorObj('user_exists'));
            }

        });
    },
    delete: function(req, res){
        Customer.remove({cpf: req.params.cpf}, function(err, docs){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getResultObj(docs));
        });
    },
    update: function(req, res){
        var data = req.body;

        Customer.update({cpf: data.cpf}, {$set: data}, {upsert: true}, function(err){
            if (err)
                return res.send(400, common.getErrorObj('failed: ' + err));

            return res.send(200, common.getSuccessObj());
        });
    }
};