(function (){
    'use strict';

    angular.module('app.ui')
        .controller('videoCtrl', ['$scope', '$rootScope', '$timeout', '$mdDialog', function($scope, $rootScope, $timeout, $mdDialog){
            $scope.movie = '';

            $rootScope.$on('playVideo', function(event, movie){
                $timeout(function(){ $scope.movie = movie }, 0);
            });

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }]);

    angular.module('app.ui')
        .factory('movieService', ['$rootScope', '$mdDialog', 'globalService', 'appCommon', movieService]);

    function movieService($rootScope, $mdDialog, globalService, appCommon){
        var movie = '';
        function playMovie(movieId) {
            movie = movieId;
            $mdDialog.show({
                template:
                '<md-dialog aria-label="Movie" ng-cloak>' +
                '  <md-toolbar>' +
                '    <div class="md-toolbar-tools">' +
                '      <span flex></span>' +
                '      <md-button class="md-icon-button" ng-click="cancel()">' +
                '        <div class="zmdi zmdi-close" aria-label="Close dialog"></div>' +
                '      </md-button>' +
                '    </div>' +
                '  </md-toolbar>' +
                '  <md-dialog-content>' +
                '    <video id="video" class="video-js vjs-default-skin vjs-big-play-centered"' +
                '      controls poster="" data-setup="{}" width="800" height="400">' +
                '    </video>' +
                '  </md-dialog-content>' +
                '</md-dialog>',
                escapeToClose: false,
                clickOutsideToClose: false,
                onComplete: afterShowAnimation,
                onRemoving: onRemoving,
                controller: 'videoCtrl'
            });
        }

        function endedEvent(){
            saveEvent('ended');
            console.log('ended');
        }

        function pausedEvent(){
            saveEvent('paused');
            console.log('paused');
        }

        function playedEvent(){
            saveEvent('played');
            console.log('played');
        }

        function saveEvent(type){
            globalService.save('event', {type: type, movie: $rootScope.movie}).then(function(response){
                if(appCommon.isError(response))
                    console.log(response.error);
                else
                    console.log(response.data);
            });
        }

        function afterShowAnimation() {
            globalService.findOne('movie', movie).then(function(response){
                var resp = response.data;

                globalService.get('getObjectS3', {name: movie}).then(function(response) {
                    if (appCommon.isError(response)) {
                        appCommon.showSimpleToast('Erro ao carregar o vídeo');
                    }
                    else {
                        var player = videojs('video', { /* Options */ }, function() {
                            this.src({'type': resp.type, 'src': response.data});
                            this.play();
                            this.on('ended', endedEvent);
                            this.off('click');
                            this.on('click', function(event){
                                event.preventDefault();
                                if (player.paused()) {
                                    pausedEvent();
                                    console.log('paused ' + player.currentTime());
                                }
                            });

                            playedEvent();
                        });
                    }
                });
            });
        }

        function onRemoving(){
            var player = videojs('video');
            player.dispose();
        }

        var service = {
            play : function(movieId){
                $rootScope.movie = movieId;
                playMovie(movieId);
            }
        };

        return service;
    };
})();