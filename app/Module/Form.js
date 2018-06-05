(function() {
    var app = angular.module('Form', []);

    app.service('Form', ['$http', '$window', '$route', function ($http, $window, $route) {
        var self = this,
            responsePromise = null;

        this.sendDataToServer = function(url, dataObject) {
            if (dataObject.id === undefined) {
                delete dataObject.id;
            }

            responsePromise = $http.post(url, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                $route.reload();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.uploadPhoto = function(file, uploadUrl, timestamp) {
            if (!uploadUrl) {
                var uploadUrl = Global.uploadPeoplePhoto;
            }

            self.uploadFileToUrl(file, uploadUrl, timestamp);

            if (file) {
                return timestamp + file.name;
            } else {
                return '';
            }
        }

        this.uploadFileToUrl = function(file, uploadUrl, timestamp) {
            var formData = new FormData();
            formData.append('file', file);
            formData.append('timestamp', timestamp);

            $http.post(uploadUrl, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function() {
              //console.log('success upload file');
            })
            .error(function() {
              console.log('error upload file');
            });
        }

        this.isImage = function(fileName) {
            var imageExtension = ['jpg', 'png', 'JPG', 'PNG'],
                fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();

            if (!fileName) {
                return false;
            }

            for (var i = 0; i < imageExtension.length; i++) {
                if (fileExtension == imageExtension[i]) {
                    return true;
                }
            }

            return false;
        }

        this.isAttachement = function(fileName) {
            if (!fileName || self.isImage(fileName)) {
                return false;
            }

            return true;
        }
    }]);
})();
