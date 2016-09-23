(function(){
    'use strict';

    angular.module('user.service')
        .factory('userService', ['appGateway', userService]);

    function userService(appGateway) {
        var service = {
            logon : function(obj){
                return appGateway.post('/logon/', obj);
            },
            logout : function(){
                return appGateway.post('/logout');
            },
            getAuthUser : function(){
                return appGateway.get('/login');
            }
        };
        return service;
    };
})();
