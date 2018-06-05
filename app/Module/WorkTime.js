(function() {
    var app = angular.module('WorkTime', []);

    app.service('GetOrganizationWorkTimes', ['$http', '$window', function($http, $window) {
        var workTimesList = null,
            self = this;

        this.get = function(callback) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId']
            }

            responsePromise = $http.post(Global.getOrganizationWorkTimes, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                workTimesList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var workTime = new Object();
                    workTime.id = data[i]['work_times']['id'];
                    workTime.name = data[i]['work_times']['name'];
                    workTimesList.push(workTime);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getWorkTimesList = function() {
            return workTimesList;
        }
    }]);

    app.controller('AddWorkTimeController', ['$scope', '$http', '$location', '$routeParams', '$window', 'PopupMessage', function($scope, $http, $location, $routeParams, $window, Form, PopupMessage) {
        var self = this,
            dataObject = null,
            workTimeId = $routeParams.workTimeId;

        this.addWorkTimeForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: workTimeId,
                name: self.addWorkTimeForm.name,
                interval: self.addWorkTimeForm.interval,
                organizationId: $window.sessionStorage['organizationId']
            };

            responsePromise = $http.post(Global.addWorkTime, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                self.addWorkTimeForm = {};
                $location.path('/work-times');
                PopupMessage.showPopupMessage('Success', 'The work time was registered!');
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getWorkTimeInformation = function() {
            $http.get(Global.getWorkTimeInformation + workTimeId)
                .success(function(data, status, headers, config) {
                    self.addWorkTimeForm.name = data[0]['work_times']['name'];
                    self.addWorkTimeForm.interval = data[0]['work_times']['interval'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);

    app.controller('WorkTimesListController', ['$scope', '$http', '$window', '$location', 'GetOrganizationWorkTimes', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetOrganizationWorkTimes, Form, GrayBox, PopupMessage) {
        var workTimes = new Array(),
            offset = 0,
            self = this,
            dataObject = null,
            newWorkTimesList = null;

        this.getWorkTimesList = function() {
            return workTimes;
        }

        this.callbackGetWorkTimesList = function() {
            newWorkTimesList = null;

            if (workTimes.length == 0) {
                workTimes = GetOrganizationWorkTimes.getWorkTimesList();
            } else {
                newWorkTimesList = GetOrganizationWorkTimes.getWorkTimesList();

                for (var i = 0; i < newWorkTimesList.length; i++) {
                    workTimes.push(newWorkTimesList[i]);
                }
            }
        }

        this.deleteWorkTime = function(workTimeId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteWorkTime, dataObject);
        }

        this.showDeleteWorkTimePopup = function(workTimeId, workTimeName) {
            console.log(workTimeId);
            PopupMessage.showDeletePopup(workTimeId, 'Are you sure that you want to delete the work time ' + workTimeName + '?', 'delete-work-time');
        }

        this.goEditWorkTime = function(id) {
            $location.path('edit-work-time/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && $location.path() == Global.showWorkTimeRoute) {
                GetOrganizationWorkTimes.get(self.callbackGetWorkTimesList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetOrganizationWorkTimes.get(this.callbackGetWorkTimesList, Global.infiniteScrollLimit, offset);
    }]);
})();
