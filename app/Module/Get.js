(function() {
    var app = angular.module('Get', []);

    app.service('Get', ['$http', '$window', function($http, $window) {
        var self = this;
        this.data = null;

        this.getData = function(url, parameter, callback) {
            responsePromise = $http.get(url + parameter);
            responsePromise.success(function(data, status, headers, config) { 
                self.data = data;
                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getReceivedData = function() {
            return self.data;
        }
    }]);
})();