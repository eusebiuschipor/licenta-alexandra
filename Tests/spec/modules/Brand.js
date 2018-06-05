describe('Brand', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        $routeParams = null,
        brandsListController = null,
        GetAllBrands = null,
        addBrandController = null,
        Form = null;

    beforeEach(module('Brand'));
    beforeEach(module('Form'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $routeParams = {brandId: 1};
        GetAllBrands = $injector.get('GetAllBrands');
        Form = {};

        brandsListController = $controller(
                                    'BrandsListController', 
                                    {
                                        '$rootScope' : $rootScope, 
                                        '$scope' : $scope,
                                        'GetAllBrands' : GetAllBrands
                                    }
                                );

        addBrandController = $controller(
                                    'AddBrandController', 
                                    {
                                        '$rootScope' : $rootScope, 
                                        '$scope' : $scope,
                                        '$routeParams' : $routeParams,
                                        'Form' : Form
                                    }
                                );
    }));

    it('GetAllBrands service should exist',
        inject(function(GetAllBrands) {
            expect(GetAllBrands).toBeDefined();
        })
    );

    it('BrandsListController should exist', function() {
        expect(brandsListController).toBeDefined();
    });

    it('AddBrandController should exist', function() {
        expect(addBrandController).toBeDefined();
    });
});