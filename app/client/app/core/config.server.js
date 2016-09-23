(function(){
    'use strict';

    angular.module('app.core')
        .factory('configServer', [configServer]);

    function configServer() {
        var factory = {
            getDomainUrl : function () {
                //return 'http://localhost:1313';
                return 'http://beet-movies.herokuapp.com';
            },
            getApiUrl : function () {
                return this.getDomainUrl() + '/api';
            }
        };
        return factory;
    };
})();
