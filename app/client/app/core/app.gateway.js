(function(){
    'use strict';

    angular
        .module('app.core')
        .factory('appGateway', ['$http', '$q', 'configServer', 'Upload', appGateway]);

    function appGateway($http, $q, configServer, Upload) {
        var service = {
            post : function(path, obj){
                var defer = $q.defer();
                $http.post(configServer.getApiUrl() + path, obj)
                    .success(function(data) {
                        defer.resolve(data);
                    })
                    .error(function(data) {
                        if(data == null)
                            data = 'Connection Refused';
                        defer.resolve({error: data});
                    });
                return defer.promise;
            },
            get : function(path){
                var defer = $q.defer();

                $http.get(configServer.getApiUrl() + path)
                    .success(function(data) {
                        defer.resolve(data);
                    })
                    .error(function(data) {
                        defer.resolve({error: data});
                    });
                return defer.promise;
            },
            delete: function(path, id){
                var defer = $q.defer();
                $http.delete(configServer.getApiUrl() + path, id)
                    .success(function(data) {
                        defer.resolve(data);
                    })
                    .error(function(data) {
                        defer.resolve({error: data});
                    });
                return defer.promise;
            },
            upload: function(path, obj){
                var defer = $q.defer();
                var file = {
                    url: configServer.getApiUrl() + path,
                    method: 'POST',
                    file: obj
                };

                Upload.upload(file).then(function(data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
        };
        return service;
    };
})();
