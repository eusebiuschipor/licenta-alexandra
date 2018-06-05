describe('Department', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        $routeParams = null,
        departmentsListController = null,
        GetAllDepartments = null,
        addDepartmentController = null;

    beforeEach(module('Department'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $routeParams = {departmentId: 1};
        GetAllDepartments = $injector.get('GetAllDepartments');
        Form = {};

        departmentsListController = $controller(
                                        'DepartmentsListController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope,
                                            'GetAllDepartments' : GetAllDepartments
                                        }
                                    );

        addDepartmentController = $controller(
                                        'AddDepartmentController', 
                                        {
                                            '$rootScope' : $rootScope, 
                                            '$scope' : $scope,
                                            '$routeParams' : $routeParams,
                                            'Form' : Form
                                        }
                                    );
    }));

    it('GetAllDepartments service should exist',
        inject(function(GetAllDepartments) {
            expect(GetAllDepartments).toBeDefined();
        })
    );

    it('DepartmentsListControllere should exist', function() {
        expect(departmentsListController).toBeDefined();
    });

    it('AddDepartmentController should exist', function() {
        expect(addDepartmentController).toBeDefined();
    });
});