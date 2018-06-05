describe('Job', function() {
    var $rootScope = null, 
        $scope = null, 
        $controller = null,
        $routeParams = null,
        $routeParams = null,
        jobsListController = null,
        GetAllJobs = null,
        GetAllDepartments = null,
        addJobController = null;

    beforeEach(module('Job'));
    beforeEach(module('Department'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $injector) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $routeParams = {jobId: 1};
        GetAllJobs = $injector.get('GetAllJobs');
        GetAllDepartments = $injector.get('GetAllDepartments');
        Form = {};

        jobsListController = $controller(
                                'JobsListController', 
                                {
                                    '$rootScope' : $rootScope, 
                                    '$scope' : $scope,
                                    'GetAllJobs' : GetAllJobs
                                }
                            );

        addJobController = $controller(
                                'AddJobController', 
                                {
                                    '$rootScope' : $rootScope, 
                                    '$scope' : $scope,
                                    '$routeParams' : $routeParams,
                                    'GetAllDepartments' : GetAllDepartments,
                                    'Form' : Form
                                }
                            );
    }));

    it('GetAllJobs service should exist',
        inject(function(GetAllJobs) {
            expect(GetAllJobs).toBeDefined();
        })
    );

    it('JobsListControllere should exist', function() {
        expect(jobsListController).toBeDefined();
    });

    it('AddJobController should exist', function() {
        expect(addJobController).toBeDefined();
    });
});