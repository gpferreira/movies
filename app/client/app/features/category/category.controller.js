(function(){
    'use strict';

    angular.module('app.feature')
        .controller('categoryCtrl', ['$scope', '$filter', 'globalService', '$stateParams', 'appCommon', CategoryCtrl]);

    function CategoryCtrl($scope, $filter, globalService, $stateParams, appCommon) {
        var init;

        $scope.category = {};
        $scope.categories = [];
        $scope.searchKeywords = '';
        $scope.filteredCategories = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.order = order;
        $scope.new = newCategory;
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
            return $scope.currentPageCategories = $scope.filteredCategories.slice(start, end);
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
            globalService.list('category').then(function(response){
                $scope.categories = response.data;
                $scope.filteredCategories = $filter('filter')($scope.categories, $scope.searchKeywords);
                return $scope.onFilterChange();
            });
        }

        function order(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredCategories = $filter('orderBy')($scope.categories, rowName);
            return $scope.onOrderChange();
        }

        function edit(id) {
            appCommon.goTo('features/category/edit', {id: id});
        }

        function newCategory() {
            appCommon.goTo('features/category/new');
        }

        function save() {
            var saveControl = true;

            angular.forEach($scope.category, function(attribute){
                if(saveControl){
                    if (appCommon.isEmpty(attribute)){
                        saveControl = false;
                        return appCommon.showMessage('Por favor, preencha todos os campos deste formulário.', 'warning');
                    }
                }
            });

            if (saveControl){
                var message = '';

                globalService.save('category', $scope.category).then(function(response){
                    if(appCommon.isError(response))
                        message = 'Ocorreu um erro ao registrar a category';
                    else
                        message = 'Categoria registrada com sucesso!';

                    appCommon.goTo('features/category');
                    appCommon.showSimpleToast(message);
                });
            }
        }

        init = function() {

            if(appCommon.isEmpty($stateParams.id)){
                $scope.search();
                return $scope.select($scope.currentPage);
            } else {
                globalService.findOne('category', $stateParams.id).then(function(response){
                    $scope.category = response.data;
                });
            }
        };

        init();
    }
})();
