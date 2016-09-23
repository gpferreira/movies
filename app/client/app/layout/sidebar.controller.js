(function () {
    'use strict';

    angular.module('app.layout')
        .controller('sidebarCtrl', ['$scope', '$rootScope', '$timeout', 'globalService', 'appCommon', sidebarCtrl]);

    function sidebarCtrl($scope, $rootScope, $timeout, globalService, appCommon){

        $scope.features = [];
        $scope.getFeature = getFeature;

        $rootScope.$on('getFeature', function(){
            $timeout(function(){ $scope.getFeature() }, 0);
        });

        function getFeature(){
            globalService.list('feature').then(function(response){
                if(!appCommon.isError()){
                    $rootScope.session.features = response.data;
                    $scope.features = response.data;
                }
                else {
                    appCommon.showSimpleToast('Ocorreu um erro ao carregar a lista de menus.');
                }
            });
        }
    }
})();



