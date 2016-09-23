(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

                $httpProvider.defaults.withCredentials = true;

                var routes, setRoutes;

                /*routes = [
                 'ui/cards', 'ui/icons', 'ui/timeline',
                 'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                 'page/404', 'page/500', 'page/blank', 'page/invoice', 'page/lock-screen', 'page/profile',
                 'auth/forgot-password', 'auth/signin', 'auth/signup',
                 'app/calendar'
                 ];*/

                routes = [
                    'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                    'map/maps',
                    'table/static', 'table/dynamic', 'table/responsive',
                    'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                    'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                    'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                    'app/calendar',
                    'auth/forgot-password', 'auth/signin', 'auth/signup',
                ];

                setRoutes = function(route) {
                    var config, url;
                    url = '/' + route;
                    config = {
                        url: url,
                        templateUrl: 'app/' + route + '.html'
                    };
                    $stateProvider.state(route, config);
                    return $stateProvider;
                };

                routes.forEach(function(route) {
                    return setRoutes(route);
                });

                $urlRouterProvider.otherwise('/auth/signin');

                $stateProvider.state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/dashboard.html'
                });

                $stateProvider.state('home', {
                    url: '/home',
                    templateUrl: 'app/home/home.html'
                });

                $stateProvider.state('features/tag', {
                    url: '/features/tag',
                    templateUrl: 'app/features/tag/tagList.html'
                });

                $stateProvider.state('features/tag/edit', {
                    url: '/features/tag/:id',
                    templateUrl: 'app/features/tag/tag.html'
                });

                $stateProvider.state('features/tag/new', {
                    url: '/features/tag/new',
                    templateUrl: 'app/features/tag/tag.html'
                });

                $stateProvider.state('features/user', {
                    url: '/features/user',
                    templateUrl: 'app/features/user/userList.html'
                });

                $stateProvider.state('features/user/edit', {
                    url: '/features/user/edit/:id',
                    templateUrl: 'app/features/user/user.html',
                    method: 'edit'
                });

                $stateProvider.state('features/user/new', {
                    url: '/features/user/new',
                    templateUrl: 'app/features/user/user.html'
                });

                $stateProvider.state('features/movie', {
                    url: '/features/movie',
                    templateUrl: 'app/features/movie/movieList.html'
                });

                $stateProvider.state('features/movie/edit', {
                    url: '/features/movie/edit/:id',
                    templateUrl: 'app/features/movie/movie.html',
                    method: 'edit'
                });

                $stateProvider.state('features/movie/new', {
                    url: '/features/movie/new',
                    templateUrl: 'app/features/movie/movie.html'
                });

                $stateProvider.state('features/category', {
                    url: '/features/category',
                    templateUrl: 'app/features/category/categoryList.html'
                });

                $stateProvider.state('features/category/edit', {
                    url: '/features/category/edit/:id',
                    templateUrl: 'app/features/category/category.html',
                    method: 'edit'
                });

                $stateProvider.state('features/category/new', {
                    url: '/features/category/new',
                    templateUrl: 'app/features/category/category.html'
                });
            }]
        );

})();
