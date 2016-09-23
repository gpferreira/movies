(function (){
    'use strict';

    angular.module('app.ui')
        .controller('dialogController', ['$rootScope', '$scope', '$timeout', function($rootScope, $scope, $timeout){
            $scope.progress = 1;

            $rootScope.$on('movieProgress', function(event, newProgress) {
                $timeout(function() { $scope.progress = newProgress; }, 0);
            });
        }]);

    angular.module('app.ui')
        .factory('loaderService', ['$rootScope', '$mdDialog', loaderService]);

    function loaderService($rootScope, $mdDialog){
        var determinateValue = 1;

        var service = {
            show : function() {

                // Show the loading overlay and text
                $rootScope.loading = $mdDialog.show({
                    template: '<md-dialog aria-label="Movie"  ng-cloak><md-dialog-content><div class="loading"><div layout layout-align="center center"><md-progress-linear value="{{progress}}" md-mode="determinate"></md-progress-linear></div></div></md-dialog-content></md-dialog>',
                    escapeToClose: false,
                    clickOutsideToClose: false,
                    controller: 'dialogController'
                });
            },
            hide : function(){
                $rootScope.loading = $mdDialog.hide();
            },
            cancel : function(){
                $rootScope.loading = $mdDialog.cancel();
            },
            increment : function(value){
                if((value !== undefined) && (value > 0 && value <= 100))
                    determinateValue += value;
                else
                    determinateValue += 1;
            },
            setLength : function(length){
                if(length <= 100)
                    determinateValue = length;
                $rootScope.$emit('movieProgress', determinateValue);
            }
        };

        return service;
    };
})();