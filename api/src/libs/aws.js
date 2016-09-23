var common = require('../libs/common');
var fs = require('fs'),
    S3FS = require('s3fs'),
    s3fsImpl = new S3FS(process.env.S3_BUCKET || 'beet-movies',{
        accessKeyId: process.env.AWS_ACCESS_KEY || 'AKIAID5YPKOE6LML755A',
        secretAccessKey: process.env.AWS_SECRET_KEY || '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'
    });

var q = require('q');

var amazon = {
    putObject: function (file) {
        var d = new q.defer();

        var stream = fs.createReadStream(file.path);

        s3fsImpl.writeFile(file.name, stream).then(function (response) {
            var result = response;
            fs.unlink(file.path, function (err) {
                if (err) {
                    d.resolve(common.getErrorObj(err));
                }
                else {
                    d.resolve(common.getResultObj(result));
                }
            });
        });

        return d.promise;
    }
};

module.exports = amazon;