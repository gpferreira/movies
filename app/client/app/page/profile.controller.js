(function(){
    'use strict';

    angular.module('app.page')
        .controller('profileCtrl', ['$scope', '$rootScope', 'globalService', 'appCommon', profileCtrl]);

    function profileCtrl($scope, $rootScope, globalService, appCommon) {
        var init;

        $scope.movieHistory = [];
        $scope.user = {};
        $scope.views = 0;
        $scope.getMovieHistory = getMovieHistory;

        function getMovieHistory(){
            globalService.findOne('movie/history', $scope.user._id).then(function(response) {
                if(appCommon.isError(response))
                    appCommon.showSimpleToast('Erro ao carregar o histórico de vídeos.');
                else {
                    angular.forEach(response.data.movie, function(item){
                        globalService.find('movie/progress', {user: $scope.user._id, movie: item._id}).then(function(response){
                            item.progress = response.data;
                            $scope.movieHistory.push(item);
                        });
                    });
                    $scope.views = response.data.event;
                    //$scope.movieHistory = response.data;
                }
            });
        }

        init = function(){
            $scope.user = $rootScope.session.user;
            $scope.getMovieHistory();
        };

        init();
    }
})();