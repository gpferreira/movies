(function(){
    'use strict';

    angular.module('app.layout')
        .controller('headerCtrl', ['$scope', 'userService', 'appCommon', HeaderCtrl]);

    function HeaderCtrl($scope, userService, appCommon){
        $scope.logout = logout;

        function logout(){
            userService.logout().then(function(){
                appCommon.goTo('auth/signin')
            });
        };
    };
})();