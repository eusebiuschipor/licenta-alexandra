(function() {
	var app = angular.module('Navigation', []);

	app.controller('NavigationController', ['$scope', '$http', '$location', '$window', 'Auth', function($scope, $http, $location, $window, Auth) {
		$scope.userLoggedEmail = $window.sessionStorage['email'];

		this.logOut = function() {
			$window.sessionStorage.removeItem('token');
      $window.sessionStorage.removeItem('email');
      $window.sessionStorage.removeItem('organizationId');
      $window.sessionStorage.removeItem('isLoggedInAsOrganization');
			$window.sessionStorage.removeItem('menuItemActive');
			$window.sessionStorage.removeItem('peopleId');
			$window.sessionStorage.removeItem('teamId');
			$window.sessionStorage.removeItem('accountType');
			$window.sessionStorage.removeItem('firstName');
			$window.sessionStorage.removeItem('lastName');

      $location.path('/login');
		}

		this.isLoggedIn = function() {
			return Auth.isLoggedIn();
		}

		this.getUserLoggedEmail = function() {
			return $window.sessionStorage['email'];
		}

		this.isLoggedInAsOrganization = function() {
			return Auth.isLoggedInAsOrganization();
		}

		this.isLoggedInAsUser = function() {
			return Auth.isLoggedInAsUser();
		}

		this.activateItem = function(item) {
			if (item) {
				$location.hash('nav');
				$window.sessionStorage['menuItemActive'] = item;
			} else {
				$window.sessionStorage['menuItemActive'] = null;
			}
		}

		this.isActive = function(item) {
			return $window.sessionStorage['menuItemActive'] == item;
		}

		this.getPeopleId = function() {
			return $window.sessionStorage['peopleId'];
		}

		this.getUserTeamId = function() {
			return $window.sessionStorage['teamId'];
		}

		this.isBasicAccount = function() {
			return !Global.premium1Account;
		}

		this.dropdownToggle = function(id) {
			if (!$(id).hasClass('dropdown-active')) {
				$(id).addClass('dropdown-active');
			} else {
				$(id).removeClass('dropdown-active');
			}
		}

		this.homeRoute = function() {
			return Global.homeRoute;
		}
	}]);
})();
