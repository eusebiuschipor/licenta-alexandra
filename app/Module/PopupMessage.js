(function() {
    var app = angular.module('PopupMessage', []);

    app.service('PopupMessage', function($window) {
        return {
            showPopupMessage : function(title, message) {
                $('.modalDialog .content h2').text(title);
                $('.modalDialog .content p').html(message);
                $('.modalDialog').css('opacity', '1');
                $('.modalDialog .content .close').css('opacity', '1');
                $('.modalDialog').css('pointer-events', 'auto');
            },
            showDeletePopup : function(id, text, popupClass) {
                $('.modalDialog.' + popupClass).css('opacity', '1');
                $('.modalDialog.' + popupClass).css('pointer-events', 'auto');
                $('.modalDialog.' + popupClass + ' .content h2').text(text);
                ActionVariable.itemToBeDeleted = id;
            }
        }
    });

    app.controller('PopupMessageController', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
  		this.hidePopupMessage = function() {
  			$('.modalDialog').css('opacity', '0');
  			$('.modalDialog').css('pointer-events', 'none');
  			Global.notifyRevertToBasicAccount = false;
  		}
	 }]);
})();
