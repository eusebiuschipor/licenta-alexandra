(function() {
    var app = angular.module('Location', []);

    app.service('GetOrganizationLocations', ['$http', '$window', function($http, $window) {
        var locationsList = null,
            self = this;

        this.get = function(callback) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId']
            }

            responsePromise = $http.post(Global.getOrganizationLocations, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                locationsList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var location = new Object();
                    location.nr = i + 1;
                    location.id = data[i]['locations']['id'];
                    location.name = data[i]['locations']['name'];
                    locationsList.push(location);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getLocationsList = function() {
            return locationsList;
        }
    }]);

    app.controller('AddLocationController', ['$scope', '$http', '$location', '$routeParams', '$window', 'GetAllPeoples', 'PopupMessage', function($scope, $http, $location, $routeParams, $window, GetAllPeoples, PopupMessage) {
        var self = this,
            dataObject = null,
            locationId = $routeParams.locationId;

        this.addLocationForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: locationId,
                name: self.addLocationForm.name,
                organizationId: sessionStorage.organizationId
            };

            responsePromise = $http.post(Global.addLocation, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
              self.addLocationForm = {};
              $location.path('/locations');
              PopupMessage.showPopupMessage('Success', 'The location was added with succes!');
            });
            responsePromise.error(function(data, status, headers, config) {
              console.log('error');
            });
        }

        this.getLocationInformation = function() {
            $http.get(Global.getLocationInformation + locationId)
                .success(function(data, status, headers, config) {
                    self.addLocationForm.name = data[0]['locations']['name'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);

    app.controller('LocationsListController', ['$scope', '$http', '$window', '$location', 'GetOrganizationLocations', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetOrganizationLocations, Form, GrayBox, PopupMessage) {
        var locations = new Array(),
            offset = 0,
            self = this,
            dataObject = null,
            newLocationsList = null;

        this.getLocationsList = function() {
            return locations;
        }

        this.callbackGetLocationsList = function() {
            newLocationsList = null;

            if (locations.length == 0) {
                locations = GetOrganizationLocations.getLocationsList();
            } else {
                newLocationsList = GetOrganizationLocations.getLocationsList();

                for (var i = 0; i < newLocationsList.length; i++) {
                    locations.push(newLocationsList[i]);
                }
            }
        }

        this.deleteLocation = function(locationId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteLocation, dataObject);
        }

        this.showDeleteLocationPopup = function(locationId, locationName) {
            PopupMessage.showDeletePopup(locationId, 'Are you sure that you want to delete the location ' + locationName + '?', 'delete-location');
        }

        this.goEditLocation = function(id) {
            $location.path('edit-location/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.showLocationsRoute) {
                GetOrganizationLocations.get(self.callbackGetLocationsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetOrganizationLocations.get(this.callbackGetLocationsList, Global.infiniteScrollLimit, offset);
    }]);
})();
