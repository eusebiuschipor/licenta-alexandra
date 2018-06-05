(function() {
    var app = angular.module('PeopleCategory', []);

	app.service('GetAllPeopleCategories', ['$http', '$window', function ($http, $window) {
        var peopleCategoriesList = null,
            responsePromise = null;

        this.get = function(callback, limit, offset) {
            peopleCategoriesList = new Array();
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId'],
                limit: limit || 99999,
                offset: offset || 0
            }

            responsePromise = $http.post(Global.getPeopleCategories, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                peopleCategoriesList = new Array();
                for (var i = 0; i < data.length; i++) {
                    var peopleCategory = new Object();
					peopleCategory.nr = i + 1;
					peopleCategory.id = data[i]['people_categories']['id'];
					peopleCategory.title = data[i]['people_categories']['title'];
					peopleCategory.description = data[i]['people_categories']['description'];
					peopleCategoriesList.push(peopleCategory);
                }
                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getPeopleCategoriesList = function() {
            return peopleCategoriesList;
        }
    }]);

    app.controller('PeopleCategoryInformationController', ['$scope', '$http', '$window', '$routeParams', '$location', function($scope, $http, $window, $routeParams, $location, GetAllPeopleCategories) {
        var categoryId = $routeParams.categoryId,
            self = this,
            responsePromise = null,
            peoples = new Array(),
            offset = 0;

        this.getData = function(limit, offset) {
            var dataObject = {
                organizationId: window.sessionStorage['organizationId'],
                category: categoryId,
                limit: limit || 99999,
                offset: offset || 0
            };

            responsePromise = $http.post(Global.getPeopleFromASpecificCategory, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    var people = new Object();
                    people.jobTitle = data[i]['jobs']['title'];
                    people.firstName = data[i]['people']['first_name'];
                    people.lastName = data[i]['people']['last_name'];
                    people.id = data[i]['people']['id'];
                    people.photo = data[i]['people']['photo'];
                    peoples.push(people);
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }


        this.getPeoples = function() {
            return peoples;
        }

        this.getPeopleImageSrc = function() {
            return Global.peopleImageSrc;
        }

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == (Global.peopleCategoryRoute + categoryId)) {
                self.getData(Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        this.getData(Global.infiniteScrollLimit, offset);
    }]);

    app.controller('PeopleCategoriesListController', ['$scope', '$http', '$window', '$location', 'GetAllPeopleCategories', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetAllPeopleCategories, Form, GrayBox, PopupMessage) {
        var peopleCategories = new Array(),
            newPeopleCategoriesList = new Array(),
            offset = 0,
            self = this;

        this.callbackGetPeopleCategoriesList = function() {
            newPeopleCategoriesList = new Array();

            if (peopleCategories.length == 0) {
                peopleCategories =  GetAllPeopleCategories.getPeopleCategoriesList();
            } else {
                newPeopleCategoriesList = GetAllPeopleCategories.getPeopleCategoriesList();

                for (var i = 0; i < newPeopleCategoriesList.length; i++) {
                    peopleCategories.push(newPeopleCategoriesList[i]);
                }
            }
        }

        this.getPeopleCategoriesList = function() {
            return peopleCategories;
        }

        this.deletePeopleCategory = function(peopleCategoryId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deletePeopleCategory, dataObject);
        }

        this.showDeletePeopleCategoryPopup = function(peopleCategoryId, peopleCategoryName) {
            PopupMessage.showDeletePopup(peopleCategoryId, 'Are you sure that you want to delete the people category ' + peopleCategoryName + '?', 'delete-people-category');
        }

        this.goEditPeopleCategory = function(id) {
            $location.path('edit-people-category/' + id);
        }

        this.goPeopleCategoryDescription = function(id) {
            $location.path('people-category/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.peopleCategoriesRoute) {
                GetAllPeopleCategories.get(self.callbackGetPeopleCategoriesList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetAllPeopleCategories.get(this.callbackGetPeopleCategoriesList, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('AddPeopleCategoryController', ['$scope', '$http', '$window', '$location', '$routeParams', 'Form', 'PopupMessage', function($scope, $http, $window, $location, $routeParams, Form, PopupMessage) {
        var dataObject = null,
            self = this,
            peopleCategoryId = $routeParams.peopleCategoryId;

        this.addPeopleCategoryForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: peopleCategoryId,
                title: self.addPeopleCategoryForm.title,
                description: self.addPeopleCategoryForm.description,
                organizationId: sessionStorage.organizationId,
                accountType: $window.sessionStorage['accountType']
            };

            responsePromise = $http.post(Global.addPeopleCategory, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (responseCode == Global.mustHavePremiumAccount) {
                    PopupMessage.showPopupMessage('You need a Premium account for adding more than ' + Global.basicAccountMaxPeopleCategories + ' people categories!');
                } else {
                    self.addPeopleCategoryForm = {};
                    $location.path('/people-categories');
                    PopupMessage.showPopupMessage('Success', 'The people category was registered!');
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getPeopleCategoryInformation = function() {
            $http.get(Global.getPeopleCategoryInformation + peopleCategoryId)
                .success(function(data, status, headers, config) {
                    self.addPeopleCategoryForm.id = data[0]['people_categories']['id'];
                    self.addPeopleCategoryForm.title = data[0]['people_categories']['title'];
                    self.addPeopleCategoryForm.description = data[0]['people_categories']['description'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();
