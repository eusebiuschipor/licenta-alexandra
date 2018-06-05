(function() {
    var app = angular.module('Currency', []);

    app.service('GetAllCurrencies', ['$http', '$window', function($http, $window) {
        var currencies = null,
            self = this;

        this.get = function(callback) {
            $http.get(Global.getAllCurrencies)
                .success(function(data, status, headers, config) {
                    currencies = new Array();

                    for (var i = 0; i < data.length; i++) {
                        var currency = new Object();
                        currency.id = data[i]['currencies']['id'];
                        currency.name = data[i]['currencies']['currency_html'];
                        currency.html = data[i]['currencies']['currency_name'];
                        currencies.push(currency);
                    }

                    callback();
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getCurrenciesList = function() {
            return currencies;
        }
    }]);
})();
