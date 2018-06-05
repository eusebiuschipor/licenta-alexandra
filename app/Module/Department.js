(function() {
	var app = angular.module('Department', []);

	app.service('GetAllDepartments', ['$http', '$window', function($http, $window) {
		var responsePromise = null,
			departmentsList = null;

		this.get = function(callback, limit, offset) {
			var dataObject = {
				organizationId: $window.sessionStorage['organizationId'],
				limit: limit || 99999,
				offset: offset || 0
			}

			responsePromise = $http.post(Global.getOrganizationDepartments, dataObject, {});
			responsePromise.success(function(data, status, headers, config) {
				departmentsList = new Array();
				for (var i = 0; i < data.length; i++) {
					var department = new Object();
					department.nr = i + 1;
					department.id = data[i]['departments']['id'];
					department.name = data[i]['departments']['name'];
					departmentsList.push(department);
				}
				callback();
			});
			responsePromise.error(function(data, status, headers, config) {
				console.log('error');
			});
		}

		this.getDepartmentsList = function() {
			return departmentsList;
		}
	}]);

	app.controller('DepartmentsListController', ['$scope', '$http', '$window', '$location', 'GetAllDepartments', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetAllDepartments, Form, GrayBox, PopupMessage) {
		var departments = new Array(),
			newDepartmentsList = null,
			offset = 0,
			self = this,
			dataObject = null;

        $scope.successGetDepartmentsList = false;

		this.callbackDepartmentsList = function() {
            newDepartmentsList = null;

            if (departments.length == 0) {
            	departments = GetAllDepartments.getDepartmentsList();
            } else {
                newDepartmentsList = GetAllDepartments.getDepartmentsList();

                for (var i = 0; i < newDepartmentsList.length; i++) {
                    departments.push(newDepartmentsList[i]);
                }
            }

            $scope.successGetDepartmentsList = true;
        }

        this.deleteDepartment = function(departmentId) {
        	dataObject = {
        		id: ActionVariable.itemToBeDeleted
        	};

        	Form.sendDataToServer(Global.deleteDepartment, dataObject);
        }

        this.showDeleteDepartmentPopup = function(departmentId, departmentTitle) {
            PopupMessage.showDeletePopup(departmentId, 'Are you sure that you want to delete the department ' + departmentTitle + '?', 'delete-department');
        }

		this.getDepartmentsList = function() {
			return departments;
		}

		this.goEditDepartment = function(id) {
				$location.path('edit-department/' + id);
		}

		this.goDepartmentDescription = function(id) {
				$location.path('department-description/' + id);
		}

        this.showGrayBox = GrayBox.show;

		$window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.showDepartmentsRoute) {
                GetAllDepartments.get(self.callbackDepartmentsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

		GetAllDepartments.get(this.callbackDepartmentsList, Global.infiniteScrollLimit, offset);
	}]);

	app.controller('AddDepartmentController', ['$scope', '$http', '$window', '$location', '$routeParams', '$window', 'Form', 'PopupMessage', 'GetAllPeoples', function($scope, $http, $window, $location, $routeParams, $window, Form, PopupMessage, GetAllPeoples) {
		var self = this,
			dataObject = null,
			departmentId = $routeParams.departmentId,
			responsePromise = null,
			responseCode = null;

		this.addDepartmentForm = {};

		$scope.peoples = null;

        this.submitTheForm = function() {
            dataObject = {
            	id: departmentId,
                name: self.addDepartmentForm.name,
                organizationId: sessionStorage.organizationId,
                accountType: $window.sessionStorage['accountType'],
                description: self.addDepartmentForm.description,
                department_head: self.addDepartmentForm.departmentHead
            };

            responsePromise = $http.post(Global.addDepartment, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (responseCode == Global.mustHavePremiumAccount) {
                	PopupMessage.showPopupMessage('You need a Premium account for adding more than ' + Global.basicAccountMaxDepartments + ' departments!');
                } else {
		            	self.addDepartmentForm = {};
		            	$location.path('/departments');
									PopupMessage.showPopupMessage('Success', 'The department was added with succes!');
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getDepartmentInformation = function() {
        	$http.get(Global.getDepartmentInformation + departmentId)
                .success(function(data, status, headers, config) {
                    self.addDepartmentForm.name = data[0]['departments']['name'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.callbackGetPeopleList = function() {
            $scope.peoples = GetAllPeoples.getPeopleList();
        }

        GetAllPeoples.get(this.callbackGetPeopleList);
	}]);

	app.controller('DepartmentDescriptionController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
        var departmentId = $routeParams.departmentId;

       	$scope.departmentInformation = new Object();

        this.getDepartmentDescription = function() {
            $http.get(Global.getDepartmentInformation + departmentId)
                .success(function(data, status, headers, config) {
                	$scope.departmentInformation.id = data[0]['departments']['id'];
                	$scope.departmentInformation.name = data[0]['departments']['name'];
                	//$scope.departmentInformation.departmentHeadFirstName = data[0]['people']['first_name'];
                	//$scope.departmentInformation.departmentHeadLastName = data[0]['people']['last_name'];
                    $scope.departmentInformation.description = data[0]['departments']['description'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();
