(function() {
	var app = angular.module('ChangePassword', []);

	app.controller('ChangePasswordController', ['$scope', '$http', '$location', 'Form', 'Auth', 'PopupMessage', function($scope, $http, $location, Form, Auth, PopupMessage) {
		var self = this,
			dataObject = null,
			responsePromise = null,
            changePassword = null;

		this.changePasswordForm = {};
		this.equalPasswords = true;
		this.invalidPassword = false;

        if (Auth.isLoggedInAsOrganization() === 'true') {
            changePassword = Global.changeOrganizationPassword;
        } else {
            changePassword = Global.changePeoplePassword;
        }

					this.submitTheForm = function() {
            dataObject = {
            	email: sessionStorage.email,
            	organizationId: sessionStorage.organizationId,
            	oldPassword: self.changePasswordForm.oldPassword,
            	newPassword: self.changePasswordForm.newPassword,
            	peopleId: sessionStorage.peopleId
            };

            responsePromise = $http.post(changePassword, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
            	if (dataFromServer == Global.httpUnauthorized) {
            		self.invalidPassword = true;
            	} else {
            		$location.path('/posts');
								PopupMessage.showPopupMessage('Success', 'The password was changed with succes!');
            	}
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }
	}]);
})();
