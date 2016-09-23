(function(){
    'use strict';

    angular.module('app.feature')
        .controller('movieCtrl', ['$scope', '$filter', 'globalService', '$stateParams', '$state', 'appCommon', 'loaderService', 'Upload', 'movieService', MovieCtrl]);

    function MovieCtrl($scope, $filter, globalService, $stateParams, $state, appCommon, loaderService, Upload, movieService){
        var init;

        $scope.movie = {};
        $scope.movie.tags = [];
        $scope.movie.category = [];
        $scope.movies = [];
        $scope.readonly = false;
        $scope.searchKeywords = '';
        $scope.filteredMovies = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.new = newMovie;
        $scope.edit = edit;
        $scope.save = save;
        $scope.editMovie = editMovie;
        $scope.playMovie = playMovie;
        $scope.disableMovie = disableMovie;
        $scope.grabScreenshot = grabScreenshot;
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        $scope.categories = [];

        $scope.selectedItem = null;
        $scope.searchText = null;
        $scope.selectedVegetables = [];
        $scope.querySearch = querySearch;


        function querySearch (query) {
            var results = query ? $scope.categories.filter(createFilterFor(query)) : [];
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(category) {
                return (category._lowerdescription.indexOf(lowercaseQuery) === 0);
            };
        }

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageMovies = $scope.filteredMovies.slice(start, end);
        }

        function onFilterChange() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        }

        function onNumPerPageChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        }

        function onOrderChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        }

        function search() {
            globalService.list('movie').then(function(response){
                $scope.movies = response.data;
                $scope.filteredMovies = $filter('filter')($scope.movies, $scope.searchKeywords);
                return $scope.onFilterChange();
            });
        }

        function edit() {
            var id = $stateParams.id;
            if(id !== undefined){
                globalService.findOne('movie', id).then(function(response){
                    $scope.movie = response.data;
                });
            }
        }

        function editMovie(id){
            appCommon.goTo('features/movie/edit', {id: id});
        }

        function newMovie() {
            appCommon.goTo('features/movie/new');
        }

        function save() {
            var saveControl = true;

            // validating that all fields are filled
            angular.forEach($scope.movie, function(attribute){
                if(saveControl){
                    if (appCommon.isEmpty(attribute)){
                        saveControl = false;
                        return appCommon.showSimpleToast('Por favor, preencha todos os campos deste formulário.');
                    }
                }
            });

            if (saveControl){
                if($scope.movie['_id'] != undefined){
                    globalService.save('movie', $scope.movie).then(function(response){
                        if(appCommon.isError(response)) {
                            return appCommon.showSimpleToast('Erro ao requisitar autorização para upload.');
                        }

                        appCommon.showSimpleToast('Vídeo atualizado com sucesso.');
                        return appCommon.goTo('features/movie');
                    });
                }
                else {
                    loaderService.show();

                    // getting file extension
                    var extension = $scope.movie.file.name.split('.').pop();
                    $scope.movie.extension = extension;
                    $scope.movie.type = $scope.movie.file.type;

                    // generating screenshot
                    $scope.grabScreenshot();

                    // get media duration
                    Upload.mediaDuration($scope.movie.file).then(function(durationInSeconds){
                        $scope.movie.duration = durationInSeconds;

                        // save record to obtain movie id
                        globalService.save('movie', $scope.movie).then(function(response){
                            if(appCommon.isError(response)) {
                                var message = 'Ocorreu um erro ao registrar o vídeo';
                                appCommon.showSimpleToast(message);
                            } else {
                                // rename file to upload on amazon s3
                                var _id = response.data._id;
                                Upload.rename($scope.movie.file, _id + '.' + extension);

                                // get signed url to upload
                                globalService.get('putObjectS3', {name: $scope.movie.file.ngfName, type: $scope.movie.file.type}).then(function(response){
                                    if(appCommon.isError(response)) {
                                        return appCommon.showSimpleToast('Erro ao requisitar autorização para upload.');
                                    }
                                    else {
                                        // upload movie file
                                        Upload.http({
                                            url: response.data,
                                            data: $scope.movie.file,
                                            headers: {
                                                'Content-Type' : $scope.movie.file.type,
                                                'x-amz-acl': 'authenticated-read'
                                            },
                                            method: 'PUT'
                                        }).then(onSuccess, onError, onProgress);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        }

        function playMovie(movieId){
            movieService.play(movieId);
        }

        function onSuccess(response){
            console.log(response);
            loaderService.hide();
            var message = 'Vídeo cadastrado com sucesso!';
            appCommon.goTo('features/movie');
            appCommon.showSimpleToast(message);
        }

        function onError(response){
            console.log(response);
            loaderService.hide();
            var message = 'Ocorreu um erro ao registrar o arquivo de vídeo';
            appCommon.showSimpleToast(message);
        }

        function onProgress(event){
            var progressPercentage = parseInt(100.0 * event.loaded / event.total);
            loaderService.setLength(progressPercentage);
            console.log('progress: ' + progressPercentage + '% ' + event.config.data.name);
        }

        function grabScreenshot() {
            var video = document.getElementById("video");
            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext("2d");
            var videoHeight, videoWidth;

            videoWidth = 400;
            videoHeight = 260;

            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
            var img = new Image();
            img.src = canvas.toDataURL('image/jpeg');
            var imageCode = img.src.replace(/data:image\/jpeg;base64,/g, '');
            $scope.movie.thumbnail = imageCode;
        }

        function disableMovie(movie){
            movie.active = false;
            globalService.update('movie', movie).then(function(response){
                if(appCommon.isError(response)) {
                    return appCommon.showSimpleToast('Erro ao requisitar autorização para upload.');
                }

                appCommon.goTo('features/movie');
                var message = 'Vídeo desativado com sucesso';
                appCommon.showSimpleToast(message);
            });
        }

        init = function() {
            globalService.list('category').then(function(response){
                $scope.categories = response.data.map(function(item){
                    item._lowerdescription = item.description.toLowerCase();
                    return item;
                });
            });

            if($state.current.method !== undefined){
                $scope[$state.current.method]();
            } else {
                $scope.search();
                return $scope.select($scope.currentPage);
            }
        };

        init();
    }
})();