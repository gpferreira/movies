(function(){
    angular.module('app.core')
        .factory('globalService', ['appGateway', 'appCommon', globalService]);

    function globalService(appGateway, appCommon){
        var service = {
            save: function(feature, obj){
                return appGateway.post('/' + feature + '/save', obj);
            },
            update: function(feature, obj){
                return appGateway.post('/' + feature + '/update', obj);
            },
            delete: function(feature, id){
                return appGateway.delete('/' + feature + '/' + id);
            },
            list: function(feature){
                return appGateway.get('/' + feature);
            },
            findOne: function(feature, id){
                return appGateway.get('/' + feature + '/' + id);
            },
            find : function(feature, obj){
                var queryString = '';
                if (!appCommon.isEmpty(obj)){
                    angular.forEach(obj, function(value){
                        queryString += '/' + value;
                    });
                }
                return appGateway.get('/' + feature + queryString);
            },
            upload: function(obj){
                return appGateway.upload('/aws/file/upload', obj);
            },
            get : function(feature, obj){
                var queryString = '';
                if (!appCommon.isEmpty(obj)){
                    angular.forEach(obj, function(value, key){
                        queryString += (queryString=='') ? '?' + key + '=' + value : '&' + key + '=' + value;
                    });
                }
                return appGateway.get('/' + feature + queryString);
            }
        };
        return service;
    };
})();
