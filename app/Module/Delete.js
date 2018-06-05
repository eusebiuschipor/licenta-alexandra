(function() {
	var app = angular.module('Delete', []);

	app.service('GetDeleteInformation', ['$http', '$window', function($http, $window) {
        var responsePromise = null,
            list = null;

        this.get = function(callback, informationName, getUrl, key) {
            list = new Array();
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId']
            }

            responsePromise = $http.post(getUrl, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    var item = new Object();
                    item.id = data[i][informationName]['id'];
                    item.name = data[i][informationName]['first_name'] ? data[i][informationName]['first_name'] + data[i][informationName]['last_name'] : data[i][informationName][key];
                    list.push(item);
                }
                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getList = function() {
            return list;
        }
    }]);

    app.controller('DeleteController', ['$scope', '$http', '$window', '$location', 'GetDeleteInformation', 'Form', 'GrayBox', function($scope, $http, $window, $location, GetDeleteInformation, Form, GrayBox) {
        this.deleteForm = {};

        var self = this,
            list = new Array(),
            responsePromise = null,
            dataObject = null,
            informationName = null,
            getUrl = null,
            deleteUrl = null,
            key = null;

        this.init = function(_informationName, _getUrl, _deleteUrl, _key) {
            key = _key;
            informationName = _informationName;
            getUrl = Global.host + Global.backend + _getUrl; 
            deleteUrl = Global.host + Global.backend + _deleteUrl;
            GetDeleteInformation.get(self.callbackGetList, informationName, getUrl, key);
        };

        this.callbackGetList = function() {
            list = GetDeleteInformation.getList();
        };

        this.getList = function() {
            return list;
        };

        this.submitTheForm = function() {
            dataObject = {
                id: self.deleteForm.id
            }

            Form.sendDataToServer(deleteUrl, dataObject);
        };

        this.showGrayBox = GrayBox.show;
    }]);
})();