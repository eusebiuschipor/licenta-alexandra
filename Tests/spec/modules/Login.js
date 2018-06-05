describe('Login', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        loginController = null,
        organizationLoginController = null,
        Auth = null;

    beforeEach(module('Login'));
    beforeEach(module('Auth'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        Auth = $injector.get('Auth');

        loginController = $controller(
                                'LoginController', 
                                {
                                    '$rootScope' : $rootScope, 
                                    '$scope' : $scope,
                                    'Auth' : Auth
                                }
                            );

        organizationLoginController = $controller(
                                        'OrganizationLoginController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope,
                                            'Auth' : Auth
                                        }
                                    );
    }));

    it('LoginControllere should exist', function() {
        expect(loginController).toBeDefined();
    });

    it('OrganizationLoginController should exist', function() {
        expect(organizationLoginController).toBeDefined();
    });
});