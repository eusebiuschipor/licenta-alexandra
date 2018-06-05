(function() {
    var app = angular.module('Auth', []);

    app.service('Auth', function($window) {
        return {
            setUser : function(callback, token, email, organizationId, isLoggedInAsOrganization, peopleId, teamId, accountType, firstName, lastName) {
                $window.sessionStorage['token'] = token;
                $window.sessionStorage['email'] = email;
                $window.sessionStorage['organizationId'] = organizationId;
                $window.sessionStorage['isLoggedInAsOrganization'] = isLoggedInAsOrganization;
                $window.sessionStorage['menuItemActive'] = 0;
                $window.sessionStorage['peopleId'] = peopleId;
                $window.sessionStorage['teamId'] = teamId;
                $window.sessionStorage['accountType'] = accountType;
                $window.sessionStorage['firstName'] = firstName;
                $window.sessionStorage['lastName'] = lastName;

                callback();
            },
            isLoggedIn : function() {
                if ($window.sessionStorage['token'] !== undefined) {
                    return true;
                } else {
                    return false;
                }
            },
            isLoggedInAsOrganization : function() {
                return $window.sessionStorage['isLoggedInAsOrganization'];
            },
            isLoggedInAsUser : function() {
                if (window.sessionStorage['isLoggedInAsOrganization'] === 'true') {
                    return false;
                }

                return true;
            }
        }
    });
})();
