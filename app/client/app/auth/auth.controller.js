(function() {
    'use strict';

    angular.module('app.feature')
        .controller('authCtrl', ['$scope', '$rootScope', '$state', '$timeout', '$location', '$filter', 'userService','appCommon', authCtrl]);

    function authCtrl($scope, $rootScope, $state, $timeout, $location, $filter, userService, appCommon) {

        $scope.user = {};
        $scope.logon = logon;
        $scope.signup = signup;
        $scope.reset = reset;
        $scope.unlock = unlock;

        function logon() {
            if (appCommon.isEmpty($scope.user.username))
                return appCommon.showSimpleToast('Digite seu e-mail.');

            if (appCommon.isEmpty($scope.user.password))
                return appCommon.showSimpleToast('Digite sua senha.');

            userService.logon($scope.user).then(function(response){
                if(appCommon.isError(response)){
                    $scope.user.password = '';
                    appCommon.showSimpleToast('E-mail ou senha incorretos.');
                }
                else {
                    $rootScope.$emit('getFeature');
                    $rootScope.session = {user: response.data};
                    var result = $filter('filter')(response.data.profile, { description: 'administrator' })[0];
                    $rootScope.session.user.supervisor = !appCommon.isEmpty(result);
                    $timeout(function(){
                        $rootScope.session.user.supervisor ? $state.transitionTo('dashboard') : $state.transitionTo('home');
                        //$state.transitionTo('dashboard');
                    }, 1000);
                }
            });
        };

        function signup() {
            $location.url('/')
        };

        function reset() {
            $location.url('/')
        };

        function unlock() {
            $location.url('/')
        };
    }
})();
