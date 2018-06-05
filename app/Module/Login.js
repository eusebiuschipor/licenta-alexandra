(function() {
    var app = angular.module('Login', []);

	app.controller('LoginController', ['$scope', '$http', '$location', 'Auth', 'Form', 'PopupMessage', 'Tracking', function ($scope, $http, $location, Auth, Form, PopupMessage, Tracking) {
		$scope.loginForm = {};

		var self = this,
			invalidLogin = false;

		this.responsePromise = null;
		this.dataObject = null;

		this.userRevertToBasicAccount = function(dataObject) {
			Form.sendDataToServer(Global.userRevertToBasicAccount, dataObject);
		}

		this.loginCallback = function() {
			$location.path(Global.afterLoginRedirectRoute);
		}

		this.sendDataToServer = function(dataObject) {
			responsePromise = $http.post(Global.login, dataObject, {});
			responsePromise.success(function(response, status, headers, config) {
				if (response != Global.httpUnauthorized) {
					if (response.accountType !== Global.basicAccount) {
						premiumEndDate = response.premiumEndDate[0].organizations.premium_end_date;
						premiumEndDate = premiumEndDate.split('-');
						premiumEndYear = '20' + premiumEndDate[0];
						premiumEndMonth = premiumEndDate[1];
						premiumEndDay = premiumEndDate[2];
						premiumEndDateObj = new Date(premiumEndYear, premiumEndMonth, premiumEndDay);
						currentDateObj = new Date();

						if (premiumEndDateObj >= currentDateObj) {
				    		Auth.setUser(self.loginCallback, response.token, dataObject['email'], response.organizationId, false, response.id, response.teamId, response.accountType, response.firstName, response.lastName);
						} else {
							dataObject = {
								organizationId: response.organizationId
							};

							self.userRevertToBasicAccount(dataObject);
							Auth.setUser(self.loginCallback, response.token, dataObject['email'], response.organizationId, false, response.id, response.teamId, Global.basicAccount, response.firstName, response.lastName);
						}
					} else {
			    		Auth.setUser(self.loginCallback, response.token, dataObject['email'], response.organizationId, false, response.id, response.teamId, response.accountType, response.firstName, response.lastName);
					}
				} else {
					invalidLogin = true;
				}
			});
			responsePromise.error(function(data, status, headers, config) {
				console.log('error');
			});
		};

		this.invalidLogin = function() {
			return invalidLogin;
		}

		this.validateLogin = function() {
			invalidLogin = false;
		}

		this.login = function() {
			this.dataObject = {
				email: $scope.loginForm.email,
				password: $scope.loginForm.password
			};

			self.sendDataToServer(this.dataObject);
		};

		Tracking.track();
	}]);

	app.controller('OrganizationLoginController', ['$scope', '$http', '$location', '$route', 'Auth', 'Form', 'PopupMessage', 'Tracking', function ($scope, $http, $location, $route, Auth, Form, PopupMessage, Tracking) {
		$scope.loginForm = {};

		var self = this,
			invalidLogin = false,
			premiumEndDate = null,
			premiumEndDate = null,
			premiumEndYear = null,
			premiumEndMonth = null,
			premiumEndDay = null,
			premiumEndDateObj = null,
			currentDateObj = null;

		this.responsePromise = null;
		this.dataObject = null;

		this.revertToBasicAccount = function(dataObject) {
			Form.sendDataToServer(Global.revertToBasicAccount, dataObject);
			Global.notifyRevertToBasicAccount = true;
		}

		this.loginCallback = function() {
			$location.path(Global.afterLoginRedirectRoute);
		}

		this.sendDataToServer = function(dataObject) {
			responsePromise = $http.post(Global.organizationLogin, dataObject, {});
			responsePromise.success(function(response, status, headers, config) {
				if (response != Global.httpUnauthorized) {
					if (response.accountType[0].organizations.account_type !== Global.basicAccount) {
						premiumEndDate = response.premiumEndDate[0].organizations.premium_end_date;
						premiumEndDate = premiumEndDate.split('-');
						premiumEndYear = '20' + premiumEndDate[0];
						premiumEndMonth = premiumEndDate[1];
						premiumEndDay = premiumEndDate[2];
						premiumEndDateObj = new Date(premiumEndYear, premiumEndMonth, premiumEndDay);
						currentDateObj = new Date();

						if (premiumEndDateObj >= currentDateObj) {
				    		Auth.setUser(self.loginCallback, response.token, dataObject['email'], response.organizationId[0].organizations.id, true, null, null, response.accountType[0].organizations.account_type);
						} else {
							self.revertToBasicAccount(dataObject);
							Auth.setUser(self.loginCallback, response.token, dataObject['email'], response.organizationId[0].organizations.id, true, null, null, Global.basicAccount);
						}
					} else {
						Auth.setUser(self.loginCallback, response.token, dataObject['email'], response.organizationId[0].organizations.id, true, null, null, response.accountType[0].organizations.account_type);
					}
				} else {
					invalidLogin = true;
				}
			});
			responsePromise.error(function(data, status, headers, config) {
				console.log('error');
			});
		};

		this.invalidLogin = function() {
			return invalidLogin;
		}

		this.validateLogin = function() {
			invalidLogin = false;
		}

		this.login = function() {
			this.dataObject = {
				email: $scope.loginForm.email,
				password: $scope.loginForm.password
			};

			self.sendDataToServer(this.dataObject);
		};

		Tracking.track();
	}]);
})();
