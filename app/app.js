(function() {
    var dependencies = [
        'ui.bootstrap',
        'ngRoute',
        'Home',
        'People',
        'Login',
        'Organization',
        'Navigation',
        'Job',
        'Department',
        'Brand',
        'Delete',
        'Country',
        'Auth',
        'Form',
        'Http',
        'ChangePassword',
        'Location',
        'WorkTime',
        'WorkPlace',
        'MaritalStatus',
        'Team',
        'Get',
        'Document',
        'Payroll',
        'Holiday',
        'PeopleCategory',
        'Payment',
        'Settings',
        'PopupMessage',
        'Post',
        'GrayBox',
        'Blog',
        'FoodMenu',
        'Currency'
   ];

    var app = angular.module('Loopevo', dependencies);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/peoples', {
                templateUrl: Global.viewsUrl + 'peoples.html',
                controller: 'PeoplesController'
            })
            .when('/peoples/department/:categoryId', {
                templateUrl: Global.viewsUrl + 'peoples.html',
                controller: 'PeoplesController'
            })
            .when('/peoples/job/:categoryId', {
                templateUrl: Global.viewsUrl + 'peoples.html',
                controller: 'PeoplesController'
            })
            .when('/teams', {
                templateUrl: Global.viewsUrl + 'teams.html',
                controller: 'TeamsListController'
            })
            .when('/team/:teamId', {
                templateUrl: Global.viewsUrl + 'team.html',
                controller: 'PeoplesController'
            })
            .when('/people-description/:peopleId', {
                templateUrl: Global.viewsUrl + 'people-description.html',
                controller: 'PeopleDescriptionController'
            })
            .when('/edit-people/:peopleId', {
                templateUrl: Global.viewsUrl + 'edit-people.html',
                controller: 'AddPeopleController'
            })
            .when('/add-people', {
                templateUrl: Global.viewsUrl + 'add-people.html',
                controller: 'AddPeopleController'
            })
            .when('/add-organization', {
                templateUrl: Global.viewsUrl + 'add-organization.html',
                controller: 'AddOrganizationController'
            })
            .when('/add-team', {
                templateUrl: Global.viewsUrl + 'add-team.html',
                controller: 'AddTeamController'
            })
            .when('/login', {
                templateUrl: Global.viewsUrl + 'login.html',
                controller: 'LoginController'
            })
            .when('/organization-login', {
                templateUrl: Global.viewsUrl + 'organization-login.html',
                controller: 'OrganizationLoginController'
            })
            .when('/jobs', {
                templateUrl: Global.viewsUrl + 'jobs.html',
                controller: 'JobsListController'
            })
            .when('/add-job', {
                templateUrl: Global.viewsUrl + 'add-job.html',
                controller: 'AddJobController'
            })
             .when('/edit-job/:jobId', {
                templateUrl: Global.viewsUrl + 'edit-job.html',
                controller: 'AddJobController'
            })
            .when('/job-description/:jobId', {
                templateUrl: Global.viewsUrl + 'job-description.html',
                controller: 'JobDescriptionController'
            })
            .when('/department-description/:departmentId', {
                templateUrl: Global.viewsUrl + 'department-description.html',
                controller: 'DepartmentDescriptionController'
            })
            .when('/departments', {
                templateUrl: Global.viewsUrl + 'departments.html',
                controller: 'DepartmentsListController'
            })
            .when('/add-department', {
                templateUrl: Global.viewsUrl + 'add-department.html',
                controller: 'AddDepartmentController'
            })
            .when('/edit-department/:departmentId', {
                templateUrl: Global.viewsUrl + 'edit-department.html',
                controller: 'DepartmentsListController'
            })
            .when('/brands', {
                templateUrl: Global.viewsUrl + 'brands.html',
                controller: 'BrandsListController'
            })
            .when('/add-brand', {
                templateUrl: Global.viewsUrl + 'add-brand.html',
                controller: 'AddBrandController'
            })
            .when('/edit-team/:teamId', {
                templateUrl: Global.viewsUrl + 'edit-team.html',
                controller: 'AddTeamController'
            })
            .when('/edit-brand/:brandId', {
                templateUrl: Global.viewsUrl + 'edit-brand.html',
                controller: 'AddBrandController'
            })
            .when('/change-password', {
                templateUrl: Global.viewsUrl + 'change-password.html',
                controller: 'ChangePasswordController'
            })
            .when('/edit-profile/:peopleId', {
                templateUrl: Global.viewsUrl + 'edit-profile.html',
                controller: 'AddPeopleController'
            })
            .when('/add-document', {
                templateUrl: Global.viewsUrl + 'add-document.html',
                controller: 'AddDocumentController'
            })
            .when('/documents', {
                templateUrl: Global.viewsUrl + 'documents.html',
                controller: 'DocumentsListController'
            })
            .when('/blogs', {
                templateUrl: Global.viewsUrl + 'blogs.html',
                controller: 'BlogsListController'
            })
            .when('/document/:documentId', {
                templateUrl: Global.viewsUrl + 'document.html',
                controller: 'DocumentInformationController'
            })
            .when('/blog/:blogId', {
                templateUrl: Global.viewsUrl + 'blog.html',
                controller: 'BlogInformationController'
            })
            .when('/edit-document/:documentId', {
                templateUrl: Global.viewsUrl + 'edit-document.html',
                controller: 'AddDocumentController'
            })
            .when('/edit-blog/:blogId', {
                templateUrl: Global.viewsUrl + 'edit-blog.html',
                controller: 'AddBlogArticleController'
            })
            .when('/add-payroll', {
                templateUrl: Global.viewsUrl + 'add-payroll.html',
                controller: 'AddPayrollController'
            })
            .when('/payrolls', {
                templateUrl: Global.viewsUrl + 'payrolls.html',
                controller: 'PayrollsListController'
            })
            .when('/people-payrolls', {
                templateUrl: Global.viewsUrl + 'people-payrolls.html',
                controller: 'PeoplesController'
            })
            .when('/payrolls/:peopleId', {
                templateUrl: Global.viewsUrl + 'user-payrolls.html',
                controller: 'PeoplesController'
            })
            .when('/edit-payroll/:payrollId', {
                templateUrl: Global.viewsUrl + 'edit-payroll.html',
                controller: 'AddPayrollController'
            })
            .when('/holiday', {
                templateUrl: Global.viewsUrl + 'holiday.html',
                controller: 'HolidaysController'
            })
            .when('/holiday/:peopleId', {
                templateUrl: Global.viewsUrl + 'holiday.html',
                controller: 'HolidaysController'
            })
            .when('/add-holiday', {
                templateUrl: Global.viewsUrl + 'add-holiday.html',
                controller: 'AddHolidayController'
            })
            .when('/planned-holidays', {
                templateUrl: Global.viewsUrl + 'planned-holidays.html',
                controller: 'PlannedHolidaysController'
            })
            .when('/planned-holidays/:peopleId', {
                templateUrl: Global.viewsUrl + 'planned-holidays.html',
                controller: 'PlannedHolidaysController'
            })
            .when('/holidays-history', {
                templateUrl: Global.viewsUrl + 'holidays-history.html',
                controller: 'HolidaysHistoryController'
            })
            .when('/holidays-history/:peopleId', {
                templateUrl: Global.viewsUrl + 'holidays-history.html',
                controller: 'HolidaysHistoryController'
            })
            .when('/review-user-holidays', {
                templateUrl: Global.viewsUrl + 'review-user-holidays.html',
                controller: 'ReviewUserHolidaysController'
            })
            .when('/people-list-holiday', {
                templateUrl: Global.viewsUrl + 'people-list-holiday.html',
                controller: 'PeoplesController'
            })
            .when('/people-list-holidays-planned', {
                templateUrl: Global.viewsUrl + 'people-list-holidays-planned.html',
                controller: 'PeoplesController'
            })
            .when('/people-list-holidays-history', {
                templateUrl: Global.viewsUrl + 'people-list-holidays-history.html',
                controller: 'PeoplesController'
            })
            .when('/add-people-category', {
                templateUrl: Global.viewsUrl + 'add-people-category.html',
                controller: 'AddPeopleCategoryController'
            })
            .when('/people-categories', {
                templateUrl: Global.viewsUrl + 'people-categories.html',
                controller: 'PeopleCategoriesListController'
            })
            .when('/people-category/:categoryId', {
                templateUrl: Global.viewsUrl + 'people-category.html',
                controller: 'PeopleCategoryInformationController'
            })
            .when('/edit-people-category/:peopleCategoryId', {
                templateUrl: Global.viewsUrl + 'edit-people-category.html',
                controller: 'AddPeopleCategoryController'
            })
            .when('/buy-premium', {
                templateUrl: Global.viewsUrl + 'buy-premium.html',
                controller: 'AddPaymentController'
            })
            .when('/buy-premium-1', {
                templateUrl: Global.viewsUrl + 'buy-premium-1.html',
                controller: 'AddPaymentController'
            })
            .when('/buy-premium-1-1-month', {
                templateUrl: Global.viewsUrl + 'buy-premium-1-1-month.html',
                controller: 'AddPaymentController'
            })
            .when('/buy-premium-1-3-months', {
                templateUrl: Global.viewsUrl + 'buy-premium-1-3-months.html',
                controller: 'AddPaymentController'
            })
            .when('/buy-premium-1-6-months', {
                templateUrl: Global.viewsUrl + 'buy-premium-1-6-months.html',
                controller: 'AddPaymentController'
            })
            .when('/buy-premium-1-12-months', {
                templateUrl: Global.viewsUrl + 'buy-premium-1-12-months.html',
                controller: 'AddPaymentController'
            })
            .when('/settings', {
                templateUrl: Global.viewsUrl + 'settings.html',
                controller: 'SettingsController'
            })
            .when('/posts', {
                templateUrl: Global.viewsUrl + 'posts.html',
                controller: 'AddPostController'
            })
            .when('/post/:postId', {
                templateUrl: Global.viewsUrl + 'post.html',
                controller: 'PostDescription'
            })
            .when('/edit-post/:postId', {
                templateUrl: Global.viewsUrl + 'edit-post.html',
                controller: 'AddPostController'
            })
            .when('/add-blog-article', {
                templateUrl: Global.viewsUrl + 'add-blog-article.html',
                controller: 'AddBlogArticleController'
            })
            .when('/add-food-menu', {
                templateUrl: Global.viewsUrl + 'add-food-menu.html',
                controller: 'AddFoodMenuController'
            })
            .when('/today-food-menu', {
                templateUrl: Global.viewsUrl + 'today-food-menu.html',
                controller: 'TodayFoodMenuController'
            })
            .when('/food-menu-currency', {
                templateUrl: Global.viewsUrl + 'food-currency.html',
                controller: 'CurrencyFoodMenuController'
            })
            .when('/edit-food-menu/:foodMenuId', {
                templateUrl: Global.viewsUrl + 'edit-food-menu.html',
                controller: 'AddFoodMenuController'
            })
            .when('/add-location', {
                templateUrl: Global.viewsUrl + 'add-location.html',
                controller: 'AddLocationController'
            })
            .when('/add-country', {
                templateUrl: Global.viewsUrl + 'add-country.html',
                controller: 'AddCountryController'
            })
            .when('/locations', {
                templateUrl: Global.viewsUrl + 'locations.html',
                controller: 'LocationsListController'
            })
            .when('/edit-location/:locationId', {
                templateUrl: Global.viewsUrl + 'edit-location.html',
                controller: 'AddLocationController'
            })
            .when('/countries', {
                templateUrl: Global.viewsUrl + 'countries.html',
                controller: 'CountriesListController'
            })
            .when('/add-work-time', {
                templateUrl: Global.viewsUrl + 'add-work-time.html',
                controller: 'AddWorkTimeController'
            })
            .when('/work-times', {
                templateUrl: Global.viewsUrl + 'work-time.html',
                controller: 'WorkTimesListController'
            })
            .when('/edit-work-time/:workTimeId', {
                templateUrl: Global.viewsUrl + 'edit-work-time.html',
                controller: 'AddWorkTimeController'
            })
            .when('/add-work-place', {
                templateUrl: Global.viewsUrl + 'add-work-place.html',
                controller: 'AddWorkPlaceController'
            })
            .when('/work-places', {
                templateUrl: Global.viewsUrl + 'work-places.html',
                controller: 'WorkPlacesListController'
            })
            .when('/edit-work-place/:workPlaceId', {
                templateUrl: Global.viewsUrl + 'edit-work-place.html',
                controller: 'AddWorkPlaceController'
            })
            .when('/404', {
                templateUrl: Global.viewsUrl + '404.html',
            })
            .otherwise({
                redirectTo: '/404'
            });
    });

    app.directive('navigation', function() {
        return {
            restrict: 'E',
            templateUrl: Global.templatesUrl + 'navigation.html'
        }
    });

    app.directive('topnavigation', function() {
        return {
            restrict: 'E',
            templateUrl: Global.templatesUrl + 'top-navigation.html'
        }
    });

    app.directive('login', function() {
        return {
            restrict: 'E',
            scope: {
              type: '@',
              login: '=',
              loginForm: '='
            },
            templateUrl: Global.templatesUrl + 'login.html'
        }
    });

    app.directive('popupmessage', function() {
        return {
            restrict: 'E',
            templateUrl: Global.templatesUrl + 'popup-message.html'
        }
    });

    app.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

    app.run(['$rootScope', '$location', 'Auth', 'RouteLocation', function ($rootScope, $location, Auth, RouteLocation) {
        $rootScope.$on('$routeChangeStart', function (event) {
            if (RouteLocation.organizationRoute($location.path()) && Auth.isLoggedInAsOrganization() === 'false') {
                $location.path('/organization-login');
            } else if (!Auth.isLoggedIn() && !RouteLocation.freeRoute($location.path())) {
                $location.path('/login');
            }
        });
    }]);

    app.factory('RouteLocation', function() {
        return {
            freeRoute : function(locationPath) {
                switch (locationPath) {
                    case '/add-organization':
                        return true;
                    case '/organization-login':
                        return true;
                    default:
                        return false;
                }
            },
            organizationRoute: function(locationPath) {
                switch (locationPath) {
                    case '/add-people':
                        return true;
                    case '/add-job':
                        return true;
                    case '/add-department':
                        return true;
                    case '/add-brand':
                        return true;
                    case '/edit-people/:peopleId':
                        return true;
                    case '/add-organization':
                        return true;
                    case '/add-job':
                        return true;
                    case '/edit-job-list':
                        return true;
                    case '/edit-job/:jobId':
                        return true;
                    case '/edit-department/:departmentId':
                        return true;
                    case '/add-brand':
                        return true;
                    case '/edit-brand/:brandId':
                        return true;
                    case '/food-menu-currency':
                        return true;
                    default:
                        return false;
                }
            }
        }
    });
})();
