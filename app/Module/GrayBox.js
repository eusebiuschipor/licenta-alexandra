(function() {
    var app = angular.module('GrayBox', []);

    app.service('GrayBox', function($window, $sce) {
        return {
            show : function() {
                var textContent = '',
                    grayBoxContent = null;

                for (var i = 0; i < arguments.length; i++) {
                    textContent += arguments[i];
                }

                grayBoxContent = '<div class="center-box">' +
                                    textContent + 
                                 '</div>';

                return $sce.trustAsHtml(grayBoxContent);
            }
        };
    });
})();