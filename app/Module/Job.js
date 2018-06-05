(function() {
    var app = angular.module('Job', []);

	app.service('GetAllJobs', ['$http', '$window', function ($http, $window) {
        var jobsList = null,
            responsePromise = null;

        this.get = function(callback, limit, offset) {
            jobsList = new Array();
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId'],
                limit: limit || 99999,
                offset: offset || 0
            }

            responsePromise = $http.post(Global.getOrganizationJobs, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                jobsList = new Array();
                for (var i = 0; i < data.length; i++) {
                    var job = new Object();
          					job.nr = i + 1;
          					job.id = data[i]['jobs']['id'];
          					job.title = data[i]['jobs']['title'];
          					job.department = data[i]['departments']['name'];
                    job.departmentAvailability = data[i]['departments']['availability'];
					          jobsList.push(job);
                }
                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getJobsList = function() {
            return jobsList;
        }
    }]);

    app.controller('JobsListController', ['$scope', '$http', '$window', '$location', 'GetAllJobs', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetAllJobs, Form, GrayBox, PopupMessage) {
        var jobs = new Array(),
            offset = 0,
            newJobsList = null,
            self = this,
            translate = new Translate('english');

        this.strings = {
            departmentNotAvailable: translate.departmentNotAvailable
        };

        this.callbackGetJobsList = function() {
            newJobsList = null;

            if (jobs.length == 0) {
                jobs = GetAllJobs.getJobsList();
            } else {
                newJobsList = GetAllJobs.getJobsList();

                for (var i = 0; i < newJobsList.length; i++) {
                    jobs.push(newJobsList[i]);
                }
            }
        }

        this.getJobsList = function() {
            return jobs;
        }

        this.deleteJob = function(jobId) {
            var dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteJob, dataObject);
        }

        this.showDeleteJobPopup = function(jobId, jobTitle) {
            PopupMessage.showDeletePopup(jobId, 'Are you sure that you want to delete the job ' + jobTitle + '?', 'delete-job');
        }

        this.goEditJob = function(id) {
            $location.path('edit-job/' + id);
        }

        this.goJobDescription = function(id) {
            $location.path('job-description/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && $location.path() == Global.showJobsRoute) {
                GetAllJobs.get(self.callbackGetJobsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetAllJobs.get(this.callbackGetJobsList, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('AddJobController', ['$scope', '$http', '$window', '$location', '$routeParams', 'GetAllDepartments', 'Form', 'PopupMessage', function($scope, $http, $window, $location, $routeParams, GetAllDepartments, Form, PopupMessage) {
        var dataObject = null,
            departments = null,
            self = this,
            jobId = $routeParams.jobId;

        this.addJobForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: jobId,
                title: self.addJobForm.title,
                department: self.addJobForm.department,
                open: self.addJobForm.open,
                organizationId: sessionStorage.organizationId
            };

            Form.sendDataToServer(Global.addJob, dataObject);
            self.addJobForm = {};
            $location.path('/jobs');
            PopupMessage.showPopupMessage('Success', 'The job was added with succes!');
        }

        this.callbackDepartmentsList = function() {
            departments = GetAllDepartments.getDepartmentsList();
        }

        this.getDepartmentsList = function() {
            return departments;
        }

        this.getJobInformation = function() {
            $http.get(Global.getJobInformation + jobId)
                .success(function(data, status, headers, config) {
                    self.addJobForm.department = data[0]['jobs']['department'];
                    self.addJobForm.title = data[0]['jobs']['title'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        GetAllDepartments.get(this.callbackDepartmentsList)
    }]);

    app.controller('JobDescriptionController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
        var jobId = $routeParams.jobId;

        $scope.jobInformation = new Object();

        this.getJobDescription = function() {
            $http.get(Global.getJobInformation + jobId)
                .success(function(data, status, headers, config) {
                    $scope.jobInformation.id = data[0]['jobs']['id'];
                    $scope.jobInformation.title = data[0]['jobs']['title'];
                    $scope.jobInformation.department = data[0]['departments']['name'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();
