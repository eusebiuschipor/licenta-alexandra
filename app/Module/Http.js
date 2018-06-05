(function() {
    var app = angular.module('Http', []);

    app.service('Http', ['$http', '$window', '$route', function ($http, $window, $route) {
        this.post = function(url, data) {
            var responsePromise = null;

            responsePromise = $http.post(url, data, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.get = function(url, parameter) {
            var dataFromServer = null;
            $http.get(url + parameter)
                .success(function (data, status, headers, config) {
                    dataFromServer = data;
                }).error(function (data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();