(function() {
    var app = angular.module('WorkPlace', []);

    app.service('GetOrganizationWorkPlaces', ['$http', '$window', function($http, $window) {
        var workPlacesList = null,
            self = this;

        this.get = function(callback) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId']
            }

            responsePromise = $http.post(Global.getOrganizationWorkPlaces, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                workPlacesList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var workPlace = new Object();
                    workPlace.nr = i + 1;
                    workPlace.id = data[i]['work_places']['id'];
                    workPlace.name = data[i]['work_places']['name'];
                    workPlacesList.push(workPlace);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getWorkPlacesList = function() {
            return workPlacesList;
        }
    }]);

    app.controller('AddWorkPlaceController', ['$scope', '$http', '$location', '$routeParams', '$window', 'PopupMessage', function($scope, $http, $location, $routeParams, $window, PopupMessage) {
        var self = this,
            dataObject = null,
            workPlaceId = $routeParams.workPlaceId;

        this.addWorkPlaceForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: workPlaceId,
                name: self.addWorkPlaceForm.name,
                address: self.addWorkPlaceForm.address,
                organizationId: $window.sessionStorage['organizationId']
            };

            responsePromise = $http.post(Global.addWorkPlace, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                self.addWorkPlaceForm = {};
                $location.path('/work-places');
                PopupMessage.showPopupMessage('Success', 'The work place was registered!');
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getWorkPlaceInformation = function() {
            $http.get(Global.getWorkPlaceInformation + workPlaceId)
                .success(function(data, status, headers, config) {
                    self.addWorkPlaceForm.name = data[0]['work_places']['name'];
                    self.addWorkPlaceForm.address = data[0]['work_places']['address'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);

    app.controller('WorkPlacesListController', ['$scope', '$http', '$window', '$location', 'GetOrganizationWorkPlaces', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetOrganizationWorkPlaces, Form, GrayBox, PopupMessage) {
        var workPlaces = new Array(),
            offset = 0,
            self = this,
            dataObject = null,
            newWorkPlacesList = null;

        this.getWorkPlacesList = function() {
            return workPlaces;
        }

        this.callbackGetWorkPlacesList = function() {
            newWorkPlacesList = null;

            if (workPlaces.length == 0) {
                workPlaces = GetOrganizationWorkPlaces.getWorkPlacesList();
            } else {
                newWorkPlacesList = GetOrganizationWorkPlaces.getWorkPLacesList();

                for (var i = 0; i < newWorkPlacesList.length; i++) {
                    workPlaces.push(newWorkPlacesList[i]);
                }
            }
        }

        this.deleteWorkPlace = function(workPlaceId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteWorkPlace, dataObject);
        }

        this.showDeleteWorkPlacePopup = function(workPlaceId, workPlaceName) {
            PopupMessage.showDeletePopup(workPlaceId, 'Are you sure that you want to delete the work place ' + workPlaceName + '?', 'delete-work-place');
        }

        this.goEditWorkPlace = function(id) {
            $location.path('edit-work-place/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && $location.path() == Global.showWorkPlaceRoute) {
                GetOrganizationWorkPlaces.get(self.callbackGetWorkPlacesList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetOrganizationWorkPlaces.get(this.callbackGetWorkPlacesList, Global.infiniteScrollLimit, offset);
    }]);
})();
