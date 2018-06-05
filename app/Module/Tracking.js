(function(app) {
    'use strict';

    app.service('Tracking', ['$http', '$window', function ($http, $window) {
        

        this.track = function(callback) {
            var browser = null,
                browserVersion = null;

            // For preventing the service two run twice and save twice the record in the database,
            // we set a cookie for 1 minute, and block the application in this time to save another record
            // in the database. When the cookie will expire the service will be able again to save a new
            // record in the database
            
            if (!Cookie.readCookie('app_track')) {
                if ($.browser) {
                    browserVersion = $.browser.version;

                    if ($.browser.chrome) {
                        browser = 'Chrome';
                    } else if ($.browser.mozilla) {
                        browser = 'Mozzila';
                    } else if ($.browser.msie) {
                        browser = 'MSIe';
                    } else {
                        browser = JSON.stringify($.browser);
                    }
                } else {
                    browser = navigator.userAgent;
                    browserVersion = navigator.userAgent;
                }
             
                var postTracking = $.post(Global.track, {
                    browser: browser,
                    browser_version: browserVersion
                });

                postTracking.success(function(data) { 
                    Cookie.setCookie('app_track', 'true', 60);
                });

                postTracking.error(function(data) {
                    console.log('error tracking');
                });

                postTracking.done(function(data) { });
            }
        }
    }]);
})(angular.module('Loopevo'));