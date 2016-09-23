(function(){
    'use strict';

    angular.module('app.feature')
        .controller('userCtrl', ['$scope', '$filter', 'globalService', '$stateParams', '$state', 'appCommon', UserCtrl]);

    function UserCtrl($scope, $filter, globalService, $stateParams, $state, appCommon) {
        var init;

        $scope.user = {};
        $scope.user.category = [];
        $scope.users = [];
        $scope.searchKeywords = '';
        $scope.filteredUsers = [];
        $scope.row = '';
        $scope.select = select;
        $scope.onFilterChange = onFilterChange;
        $scope.onNumPerPageChange = onNumPerPageChange;
        $scope.onOrderChange = onOrderChange;
        $scope.search = search;
        $scope.order = order;
        $scope.new = newUser;
        $scope.edit = edit;
        $scope.save = save;
        $scope.editUser = editUser;
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
            return $scope.currentPageUsers = $scope.filteredUsers.slice(start, end);
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
            globalService.list('user').then(function(response){
                $scope.users = response.data;
                $scope.filteredUsers = $filter('filter')($scope.users, $scope.searchKeywords);
                return $scope.onFilterChange();
            });
        };

        function order(rowName) {
            if ($scope.row === rowName) {
                return;
            }
            $scope.row = rowName;
            $scope.filteredUsers = $filter('orderBy')($scope.users, rowName);
            return $scope.onOrderChange();
        };

        function edit() {
            var id = $stateParams.id;
            if(id !== undefined){
                globalService.findOne('user', id).then(function(response){
                    $scope.user = response.data;
                });
            }
        };

        function editUser(id){
            appCommon.goTo('features/user/edit', {id: id});
        }

        function newUser() {
            appCommon.goTo('features/user/new');
        };

        function save() {
            var saveControl = true;

            angular.forEach($scope.user.local, function(attribute){
                if(saveControl){
                    if (appCommon.isEmpty(attribute)){
                        saveControl = false;
                        return appCommon.showMessage('Por favor, preencha todos os campos deste formulário.', 'warning');
                    }
                }
            });

            if (saveControl){
                var message = '';

                globalService.save('user', $scope.user).then(function(response){
                    if(appCommon.isError(response))
                        message = 'Ocorreu um erro ao registrar o usuário';
                    else
                        message = 'Usuário cadastrado com sucesso!';

                    appCommon.goTo('features/user');
                    appCommon.showSimpleToast(message);
                });
            }
        };

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