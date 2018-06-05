(function() {
    var app = angular.module('Settings', []);

    app.controller('SettingsController', ['$scope', '$http', '$window', function($scope, $http, $window) {
        var accountType = $window.sessionStorage['accountType'];
        accountType = accountType.split('-');
        accountType = accountType[0];

        this.getAccountType = function() {
            return accountType;
        }
    }]);
})();