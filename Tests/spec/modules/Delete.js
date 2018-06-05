describe('Delete', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        Form = null,
        GetDeleteInformation = null,
        deleteController = null;

    beforeEach(module('Delete'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        GetDeleteInformation = $injector.get('GetDeleteInformation');
        Form = {};

        deleteController = $controller(
                                'DeleteController', 
                                {
                                    '$rootScope' : $rootScope, 
                                    '$scope' : $scope,
                                    'GetDeleteInformation' : GetDeleteInformation,
                                    'Form' : Form
                                }
                            );
    }));

    it('GetDeleteInformation service should exist',
        inject(function(GetDeleteInformation) {
            expect(GetDeleteInformation).toBeDefined();
        })
    );

    it('DeleteController should exist', function() {
        expect(deleteController).toBeDefined();
    });
});