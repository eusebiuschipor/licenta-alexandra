(function() {
    var app = angular.module('Country', []);

    app.service('GetAvailableCountries', ['$http', '$window', function($http, $window) {
        var countries = null,
            self = this,
            organizationId = $window.sessionStorage['organizationId'];

        this.get = function(callback) {
            $http.get(Global.getAvailableCountries)
                .success(function(data, status, headers, config) {
                    countries = new Array();

                    for (var i = 0; i < data.length; i++) {
                        var country = new Object();
                        country.id = data[i]['available_countries']['id'];
                        country.name = data[i]['available_countries']['name'];
                        countries.push(country);
                    }

                    callback();
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getAvailableCountriesList = function() {
            return countries;
        }

        this.callbackGetAvailableCountries = function(object) {
            object.countries = self.getAvailableCountriesList();
        }
    }]);

    app.service('GetAllCountries', ['$http', '$window', function($http, $window) {
        var countries = null,
            self = this,
            organizationId = $window.sessionStorage['organizationId'];

        this.get = function(callback) {
            $http.get(Global.getAllCountries + organizationId)
                .success(function(data, status, headers, config) {
                    countries = new Array();

                    for (var i = 0; i < data.length; i++) {
                        var country = new Object();
                        country.itemId = data[i]['countries']['id'];
                        country.id = data[i]['countries']['countryId'];
                        country.name = data[i]['available_countries']['name'];
                        countries.push(country);
                    }

                    callback();
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getCountriesList = function() {
            return countries;
        }

        this.callbackGetAllCountries = function(object) {
            object.countries = self.getCountriesList();
        }
    }]);

    app.controller('AddCountryController', ['$scope', '$http', '$location', '$routeParams', '$window', 'PopupMessage', 'GetAllCountries', 'GetAvailableCountries', function($scope, $http, $location, $routeParams, $window, PopupMessage, GetAllCountries, GetAvailableCountries) {
        var self = this,
            dataObject = null,
            countryId = $routeParams.countryId,
            availableCountries = null;

        this.addCountryForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: countryId,
                countryId: self.addCountryForm.countryId,
                organizationId: sessionStorage.organizationId
            };

            responsePromise = $http.post(Global.addCountry, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
              self.addCountryForm = {};
              $location.path('/countries');
              PopupMessage.showPopupMessage('Success', 'The country was added with succes!');
            });
            responsePromise.error(function(data, status, headers, config) {
              console.log('error');
            });
        }

        this.getCountryInformation = function() {
            $http.get(Global.getCountryInformation + countryId)
                .success(function(data, status, headers, config) {
                    self.addCountryForm.name = data[0]['countries']['name'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getAvailableCountries = function() {
            return availableCountries;
        }

        this.callbackGetAvailableCountries = function() {
            availableCountries = GetAvailableCountries.getAvailableCountriesList();
        }

        GetAvailableCountries.get(self.callbackGetAvailableCountries);
    }]);

    app.controller('CountriesListController', ['$scope', '$http', '$window', '$location', 'GetAllCountries', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetAllCountries, Form, GrayBox, PopupMessage) {
        var countries = new Array(),
            offset = 0,
            self = this,
            dataObject = null,
            newCountriesList = null;

        this.getCountriesList = function() {
            return countries;
        }

        this.callbackGetCountriesList = function() {
            newCountriesList = null;

            if (countries.length == 0) {
                countries = GetAllCountries.getCountriesList();
            } else {
                newCountriesList = GetAllCountries.getCountriesList();

                for (var i = 0; i < newCountrieList.length; i++) {
                    countries.push(newCountriesList[i]);
                }
            }
        }

        this.deleteCountry = function(countryId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteCountry, dataObject);
        }

        this.showDeleteCountryPopup = function(countryId, countryName) {
            PopupMessage.showDeletePopup(countryId, 'Are you sure that you want to delete the country ' + countryName + '?', 'delete-country');
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.showCountriesRoute) {
                GetAllCountries.get(self.callbackGetCountriesList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetAllCountries.get(this.callbackGetCountriesList, Global.infiniteScrollLimit, offset);
    }]);
})();
