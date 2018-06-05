describe('Organization', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        addOrganizationController = null,
        Form = null;

    beforeEach(module('Organization'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        Form = {};

        addOrganizationController = $controller(
                                        'AddOrganizationController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope,
                                            'Form' : Form
                                        }
                                    );
    }));

    it('AddOrganizationControllere should exist', function() {
        expect(addOrganizationController).toBeDefined();
    });
});