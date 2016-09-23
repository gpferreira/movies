(function(){
    'use strict';

    angular.module('app.feature')
        .controller('tagCtrl', ['$scope', '$filter', 'globalService', '$stateParams', 'appCommon', TagCtrl]);

    function TagCtrl($scope, $filter, globalService, $stateParams, appCommon) {
        var init;

        $scope.tag = {};
        $scope.tags = [];
        $scope.searchKeywords = '';
        $scope.filteredTags = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.order = order;
        $scope.new = newTag;
        $scope.edit = edit;
        $scope.save = save;
        $scope.numPerPageOpt = [3, 5, 10, 20];
        $scope.numPerPage = $scope.numPerPageOpt[2];
        $scope.currentPage = 1;
        $scope.currentPage = [];

        function select(page) {
            var end, start;
            start = (page - 1) * $scope.numPerPage;
            end = start + $scope.numPerPage;
            return $scope.currentPageTags = $scope.filteredTags.slice(start, end);
        };

        function onFilterChange() {
            $scope.select(1);
            $scope.currentPage = 1;
            return $scope.row = '';
        };

        function onNumPerPageChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        function onOrderChange() {
            $scope.select(1);
            return $scope.currentPage = 1;
        };

        function search() {
            globalService.list('tag').then(function(response){
                $scope.tags = response.data;
                $scope.filteredTags = $filter('filter')($scope.tags, $scope.searchKeywords);
                return $scope.onFilterChange();
            });
        };

        function order(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredTags = $filter('orderBy')($scope.tags, rowName);
            return $scope.onOrderChange();
        };

        function edit(id) {
            appCommon.goTo('features/tag/edit', {id: id});
        };

        function newTag() {
            appCommon.goTo('features/tag/new');
        };

        function save() {
            var saveControl = true;

            angular.forEach($scope.tag, function(attribute){
                if(saveControl){
                    if (appCommon.isEmpty(attribute)){
                        saveControl = false;
                        return appCommon.showMessage('Por favor, preencha todos os campos deste formulário.', 'warning');
                    }
                }
            });

            if (saveControl){
                var message = '';

                globalService.save('tag', $scope.tag).then(function(response){
                    if(appCommon.isError(response))
                        message = 'Ocorreu um erro ao registrar a tag';
                    else
                        message = 'Tag registrada com sucesso!';

                    appCommon.goTo('features/tag');
                    appCommon.showSimpleToast(message);
                });
            }
        };

        init = function() {

            if(appCommon.isEmpty($stateParams.id)){
                $scope.search();
                return $scope.select($scope.currentPage);
            } else {
                globalService.findOne('tag', $stateParams.id).then(function(response){
                    $scope.tag = response.data;
                });
            }
        };

        init();
    }
})();
