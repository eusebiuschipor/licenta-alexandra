(function() {
    var app = angular.module('Organization', []);

    app.controller('AddOrganizationController', ['$scope', '$http', '$location', 'Form', 'PopupMessage', function($scope, $http, $location, Form, PopupMessage) {
        this.addOrganizationForm = {};
        this.errorMessage = '';

        var self = this,
            dataObject = null,
            responseCode = null,
            responsePromise = null;

        this.submitTheForm = function() {
            dataObject = {
                name: self.addOrganizationForm.name,
                email: self.addOrganizationForm.email,
                password: self.addOrganizationForm.password,
            };

            responsePromise = $http.post(Global.addOrganization, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (Global.errorMessages[responseCode] !== undefined) {
                    self.errorMessage = Global.errorMessages[responseCode]
                } else {
                    self.addOrganizationForm = {};
                    $location.path('/organization-login');
                    PopupMessage.showPopupMessage('Success', 'Your organization was registered!');
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }
    }]);
})();
