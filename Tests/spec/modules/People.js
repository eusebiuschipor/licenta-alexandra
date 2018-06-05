describe('People', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        $routeParams = null,
        peoplesController = null,
        GetAllJobs = null,
        GetAllCountries = null,
        GetAllDepartments = null,
        GetAllBrands = null,
        Form = null,
        peopleDescriptionController = null,
        addPeopleController = null;

    beforeEach(module('People'));
    beforeEach(module('Job'));
    beforeEach(module('Country'));
    beforeEach(module('Department'));
    beforeEach(module('Brand'));
    beforeEach(module('Form'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $routeParams = {peopleId: 1};
        GetAllJobs = $injector.get('GetAllJobs');
        GetAllCountries = $injector.get('GetAllCountries');
        GetAllDepartments = $injector.get('GetAllDepartments');
        GetAllBrands = $injector.get('GetAllBrands');
        Form = {};

        peoplesController = $controller(
                                'PeoplesController', 
                                {
                                    '$rootScope' : $rootScope, 
                                    '$scope': $scope
                                }
                            );

        peopleDescriptionController = $controller(
                                        'PeopleDescriptionController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope, 
                                            '$routeParams' : $routeParams, 
                                            'GetAllJobs' : GetAllJobs,
                                            'GetAllCountries' : GetAllCountries,
                                            'GetAllDepartments' : GetAllDepartments,
                                            'GetAllBrands' : GetAllBrands,
                                            'Form' : Form
                                        }
                                    );

        addPeopleController = $controller(
                                        'AddPeopleController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope, 
                                            '$routeParams' : $routeParams, 
                                            'GetAllJobs' : GetAllJobs,
                                            'GetAllCountries' : GetAllCountries,
                                            'GetAllDepartments' : GetAllDepartments,
                                            'GetAllBrands' : GetAllBrands,
                                            'Form' : Form
                                        }
                                    );
    }));

    it('GetAllPeoples service should exist',
        inject(function(GetAllPeoples) {
            expect(GetAllPeoples).toBeDefined();
        })
    );

    it('PeoplesController should exist', function() {
        expect(peoplesController).toBeDefined();
    });

    it('PeopleDescriptionController should exist', function() {
        expect(peopleDescriptionController).toBeDefined();
    });

    it('AddPeopleController should exist', function() {
        expect(addPeopleController).toBeDefined();
    });
});