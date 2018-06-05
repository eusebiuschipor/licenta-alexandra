(function() {
    var app = angular.module('MaritalStatus', []);

    app.service('GetMaritalStatus', ['$http', '$window', function($http, $window) {
        var maritalStatusList = null,
            self = this;
        
        this.get = function(callback) {
            responsePromise = $http.get(Global.getMaritalStatus, {});
            responsePromise.success(function(data, status, headers, config) { 
                maritalStatusList = new Array();
                
                for (var i = 0; i < data.length; i++) {
                    var maritalStatus = new Object();
                    maritalStatus.id = data[i]['marital_statuses']['id'];
                    maritalStatus.name = data[i]['marital_statuses']['name'];
                    maritalStatusList.push(maritalStatus);
                }
                
                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getMaritalStatusList = function() {
            return maritalStatusList;
        }
    }]);
})();