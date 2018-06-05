describe('Navigation', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        navigationController = null,
        Auth = null;

    beforeEach(module('Navigation'));
    beforeEach(module('Auth'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        Auth = $injector.get('Auth');

        navigationController = $controller(
                                        'NavigationController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope,
                                            'Auth' : Auth
                                        }
                                    );
    }));

    it('NavigationControllere should exist', function() {
        expect(navigationController).toBeDefined();
    });
});