(function() {
    var app = angular.module('Brand', []);

	app.service('GetAllBrands', ['$http', '$window', function ($http, $window) {
        var brandsList = null,
            responsePromise = null;

        this.get = function(callback, limit, offset) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId'],
                limit: limit || 99999,
                offset: offset || 0
            }

            responsePromise = $http.post(Global.getOrganizationBrands, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                brandsList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var brand = new Object();
					brand.nr = i + 1;
					brand.id = data[i]['brands']['id'];
					brand.name = data[i]['brands']['name'];
					brandsList.push(brand);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getBrandsList = function() {
            return brandsList;
        }
    }]);

    app.controller('BrandsListController', ['$scope', '$http', '$window', '$location', 'GetAllBrands', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetAllBrands, Form, GrayBox, PopupMessage) {
        var brands = new Array(),
            offset = 0,
            self = this,
            dataObject = null;

        this.getBrandsList = function() {
            return brands;
        }

        this.callbackGetBrandsList = function() {
            newBrandsList = null;

            if (brands.length == 0) {
                brands = GetAllBrands.getBrandsList();
            } else {
                newBrandsList = GetAllBrands.getBrandsList();

                for (var i = 0; i < newBrandsList.length; i++) {
                    brands.push(newBrandsList[i]);
                }
            }
        }

        this.deleteBrand = function(brandId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteBrand, dataObject);
        }

        this.showDeleteBrandPopup = function(brandId, brandTitle) {
            PopupMessage.showDeletePopup(brandId, 'Are you sure that you want to delete the brand ' + brandTitle + '?', 'delete-brand');
        }

        this.goEditBrand = function(id) {
    				$location.path('edit-brand/' + id);
    		}

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.showBrandsRoute) {
                GetAllBrands.get(self.callbackGetBrandsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetAllBrands.get(this.callbackGetBrandsList, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('AddBrandController', ['$scope', '$http', '$window', '$location', '$routeParams', 'Form', 'PopupMessage', function($scope, $http, $window, $location, $routeParams, Form, PopupMessage) {
        var self = this,
            dataObject = null,
            brandId = $routeParams.brandId;

        this.addBrandForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: brandId,
                name: self.addBrandForm.name,
                organizationId: sessionStorage.organizationId,
                accountType: $window.sessionStorage['accountType']
            };

            responsePromise = $http.post(Global.addBrand, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (responseCode == Global.mustHavePremiumAccount) {
                    PopupMessage.showPopupMessage('You need a Premium account for adding more than ' + Global.basicAccountMaxBrands + ' brands!');
                } else {
                    self.addBrandForm = {};
                    $location.path('/brands');
                    PopupMessage.showPopupMessage('Success', 'The brand was added with succes!');
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getBrandInformation = function() {
            $http.get(Global.getBrandInformation + brandId)
                .success(function(data, status, headers, config) {
                    self.addBrandForm.name = data[0]['brands']['name'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();
