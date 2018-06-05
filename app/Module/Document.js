(function() {
    var app = angular.module('Document', []);

    app.service('GetAllDocuments', ['$http', '$window', function ($http, $window) {
        var documentsList = null,
            responsePromise = null;

        this.get = function(callback, limit, offset) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId'],
                limit: limit || 99999,
                offset: offset || 0
            }

            responsePromise = $http.post(Global.getOrganizationDocuments, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                documentsList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var document = new Object();
					document.nr = offset + i + 1;
					document.id = data[i]['documents']['id'];
					document.title = data[i]['documents']['title'];
					document.content = data[i]['documents']['content'];
					documentsList.push(document);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getDocumentsList = function() {
            return documentsList;
        }
    }]);

	app.controller('DocumentDescription' ['$scope', '$http', '$window', '$location', '$routeParams', 'Form', function($scope, $http, $window, $location, $routeParams, Form) {
		var documentId = $routeParams.documentId,
			self = this,
			documentInformation = {};

		this.getDocumentInformation = function() {
            $http.get(Global.getDocumentInformation + documentId)
                .success(function(data, status, headers, config) {
                    documentInformation.title = data[0]['documents']['title'];
                    documentInformation.content = data[0]['documents']['content'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getTitle = function() {
        	return documentInformation.title;
        }

        this.getContent = function() {
        	return documentInformation.content;
        }
	}]);

	app.controller('DocumentInformationController', ['$scope', '$http', '$window', '$routeParams', function($scope, $http, $window, $routeParams) {
        var documentId = $routeParams.documentId,
			self = this,
			documentInformation = {};

        this.documentContent = null;

		this.getDocumentInformation = function() {
            $http.get(Global.getDocumentInformation + documentId)
                .success(function(data, status, headers, config) {
                    documentInformation.title = data[0]['documents']['title'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });

            $http.get(Global.getDocumentContent + documentId)
                .success(function(data, status, headers, config) {
                    $('#document-content').html(data);
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getTitle = function() {
        	return documentInformation.title;
        }
    }]);

	app.controller('DocumentsListController', ['$scope', '$http', '$window', '$location', 'GetAllDocuments', 'GrayBox', 'PopupMessage', 'Form', function($scope, $http, $window, $location, GetAllDocuments, GrayBox, PopupMessage, Form) {
        var documents = new Array(),
            offset = 0,
            self = this,
            newDocumentsList = null;

        $scope.documentIndex = 0;

        this.getDocumentsList = function() {
            return documents;
        }

        this.callbackGetDocumentsList = function() {
            newDocumentsList = null;

            if (documents.length == 0) {
                documents = GetAllDocuments.getDocumentsList();
            } else {
                newDocumentsList = GetAllDocuments.getDocumentsList();

                for (var i = 0; i < newDocumentsList.length; i++) {
                    documents.push(newDocumentsList[i]);
                }
            }
        }

        this.deleteDocument = function(teamId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteDocument, dataObject);
        }

        this.showDeleteDocumentPopup = function(documentId, documentTitle) {
            PopupMessage.showDeletePopup(documentId, 'Are you sure that you want to delete the documentId ' + documentTitle + '?', 'delete-document');
        }

        this.goEditDocument = function(id) {
            $location.path('edit-document/' + id);
        }

        this.goDocumentDescription = function(id) {
            $location.path('document/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.showDocumentsRoute) {
                GetAllDocuments.get(self.callbackGetDocumentsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        }

        GetAllDocuments.get(this.callbackGetDocumentsList, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('AddDocumentController', ['$scope', '$http', '$window', '$location', '$routeParams', '$window', 'PopupMessage', function($scope, $http, $window, $location, $routeParams, $window, PopupMessage) {
        var self = this,
            dataObject = null,
            documentId = $routeParams.documentId,
            responsePromise = null;

        this.addDocumentForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: documentId,
                title: self.addDocumentForm.title,
                content: self.addDocumentForm.content,
                organizationId: sessionStorage.organizationId,
                accountType: $window.sessionStorage['accountType']
            };

            responsePromise = $http.post(Global.addDocument, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (responseCode == Global.mustHavePremiumAccount) {
                    PopupMessage.showPopupMessage('You need a Premium account for adding more than ' + Global.basicAccountMaxDocuments + ' documents!');
                } else {
                    self.addDocumentForm = {};
                    $location.path('/documents');
                    PopupMessage.showPopupMessage('Success', 'The document was added with succes!');
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getDocumentInformation = function() {
            $http.get(Global.getDocumentInformation + documentId)
                .success(function(data, status, headers, config) {
                    self.addDocumentForm.title = data[0]['documents']['title'];
                    self.addDocumentForm.content = data[0]['documents']['content'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();
