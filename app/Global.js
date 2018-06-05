function Global() { }

/*
	HOST:
*/

// qa.app.loopevo:
//Global.host = 'http://qa.app.loopevo.com/';

// localhost:
Global.host = 'http://localhost/';

// app.loopevo:
//Global.host = 'http://app.loopevo.com/';

/*
	APPLICATION
*/

// localhost:
Global.application = 'loopevo-application/';

/*
	BACKEND
*/

// localhost:
Global.backend = 'loopevo-application/backend/';

// qa.app.loopevo, app.loopevo:
//Global.backend = 'backend/';

/*
	!!! Every time when we make a build from local machine, depending on the server where we make the release,
	or the server where we want to test the application, we must to activate the coresponding option from above!
*/

// Templates url
Global.templatesUrl = 'templates/';

// Modules url
Global.viewsUrl = 'app/View/';

// Scripts url
Global.scripts = 'scripts/';

// Images
Global.imagessrc = Global.host + Global.application + 'assets/img/';

/* */
// API

// People Module
Global.peopleImageSrc = Global.host + Global.application + 'assets/img/peoples/';
Global.peopleDefaultImageName = 'default.png';
Global.getAllPeoplesUrl = Global.host + Global.backend + 'peoples/';
Global.getPeopleDescriptionUrl = Global.host + Global.backend + 'peoples/view/';
Global.addPeople = Global.host + Global.backend + 'peoples/register';
Global.getAllJobs = Global.host + Global.backend + 'jobs/';
Global.getAllCountries = Global.host + Global.backend + 'countries/getAllCountries/';
Global.getAllDepartments = Global.host + Global.backend + 'departments/';
Global.getAllBrands = Global.host + Global.backend + 'brands/';
Global.login = Global.host + Global.backend + 'peoples/login';
Global.deletePeople = Global.host + Global.backend + 'peoples/delete';
Global.getEditPeopleInformation = Global.host + Global.backend + 'peoples/edit/';
Global.getPeopleNameById = Global.host + Global.backend + 'peoples/getPeopleNameById/';
Global.getPeopleBrand = Global.host + Global.backend + 'peoples/getPeopleBrand/';
Global.getPeopleCountry = Global.host + Global.backend + 'peoples/getPeopleCountry/';
Global.getPeopleDepartment = Global.host + Global.backend + 'peoples/getPeopleDepartment/';
Global.getPeopleLocation = Global.host + Global.backend + 'peoples/getPeopleLocation/';
Global.getPeopleWorkTimes = Global.host + Global.backend + 'peoples/getPeopleWorkTimes/';
Global.getPeopleWorkPlace = Global.host + Global.backend + 'peoples/getPeopleWorkPlace/';
Global.getPeopleMaritalStatus = Global.host + Global.backend + 'peoples/getPeopleMaritalStatus/';
Global.getPeopleTeam = Global.host + Global.backend + 'peoples/getPeopleTeam/';
Global.getPeopleBloodGroup = Global.host + Global.backend + 'peoples/getPeopleBloodGroup/';
Global.getPeopleGender = Global.host + Global.backend + 'peoples/getPeopleGender/';
Global.getPeopleFromASpecificTeam = Global.host + Global.backend + 'peoples/getPeopleFromASpecificTeam/';
Global.getPeopleFromASpecificCategory = Global.host + Global.backend + 'peoples/getPeopleFromCategory/';
Global.getPeopleCategory = Global.host + Global.backend + 'peoples/getPeopleCategory/';
Global.getPeopleFromDepartment = Global.host + Global.backend + 'peoples/getPeopleFromDepartment/';
Global.getPeopleFromJob = Global.host + Global.backend + 'peoples/getPeopleFromJob/';
Global.getPeopleWhoLikedAPost = Global.host + Global.backend + 'peoples/getPeopleWhoLikedAPost/';

// Templates from 'People' module
Global.searchPeopleTemplate = Global.viewsUrl + 'search-people.html';

// Job Module
Global.getOrganizationJobs = Global.host + Global.backend + 'jobs/getOrganizationJobs/';
Global.addJob = Global.host + Global.backend + 'jobs/add/';
Global.deleteJob = Global.host + Global.backend + 'jobs/delete/';
Global.getJobInformation = Global.host + Global.backend + 'jobs/view/';

// Organization Module
Global.addOrganization = Global.host + Global.backend + 'organizations/register';
Global.organizationLogin = Global.host + Global.backend + 'organizations/login/';

// Department Module
Global.getOrganizationDepartments = Global.host + Global.backend + 'departments/getOrganizationDepartments/';
Global.addDepartment = Global.host + Global.backend + 'departments/add';
Global.deleteDepartment = Global.host + Global.backend + 'departments/delete';
Global.getDepartmentInformation = Global.host + Global.backend + 'departments/view/';

// Brand Module
Global.getOrganizationBrands = Global.host + Global.backend + 'brands/getOrganizationBrands/';
Global.addBrand = Global.host + Global.backend + 'brands/add';
Global.deleteBrand = Global.host + Global.backend + 'brands/delete';
Global.getBrandInformation = Global.host + Global.backend + 'brands/view/';

// Location Module
Global.getOrganizationLocations = Global.host + Global.backend + 'locations/getOrganizationLocations/';
Global.addLocation = Global.host + Global.backend + 'locations/add';
Global.deleteLocation = Global.host + Global.backend + 'locations/delete';
Global.getLocationInformation = Global.host + Global.backend + 'locations/view/';

// WorkTime Module
Global.getOrganizationWorkTimes = Global.host + Global.backend + 'work_times/getOrganizationWorkTimes/';
Global.addWorkTime = Global.host + Global.backend + 'work_times/add/';
Global.deleteWorkTime = Global.host + Global.backend + 'work_times/delete/';
Global.getWorkTimeInformation = Global.host + Global.backend + 'work_times/view/';

// Work Place Module
Global.getOrganizationWorkPlaces = Global.host + Global.backend + 'work_places/getOrganizationWorkPlaces/';
Global.addWorkPlace = Global.host + Global.backend + 'work_places/add/';
Global.getWorkPlaceInformation = Global.host + Global.backend + 'work_places/view/';
Global.deleteWorkPlace = Global.host + Global.backend + 'work_places/delete/';

// Marital Status Module
Global.getMaritalStatus = Global.host + Global.backend + 'marital_status/getMaritalStatus/';

// Team Module
Global.getOrganizationTeams = Global.host + Global.backend + 'teams/getOrganizationTeams/';
Global.addTeam = Global.host + Global.backend + 'teams/add/';
Global.getTeamInformation = Global.host + Global.backend + 'teams/view/';
Global.deleteTeam = Global.host + Global.backend + 'teams/delete/';

// Document Module
Global.addDocument = Global.host + Global.backend + 'documents/add/';
Global.getOrganizationDocuments = Global.host + Global.backend + 'documents/getOrganizationDocuments/';
Global.getDocumentInformation = Global.host + Global.backend + 'documents/view/';
Global.getDocumentContent = Global.host + Global.backend + 'documents/getDocumentContent/';
Global.deleteDocument = Global.host + Global.backend + 'documents/delete/';

// Payroll Module
Global.addPayroll = Global.host + Global.backend + 'payrolls/add/';
Global.getUserPayrolls = Global.host + Global.backend + 'payrolls/view/';
Global.getPayrollInformation = Global.host + Global.backend + 'payrolls/viewPayroll/';
Global.deletePayroll = Global.host + Global.backend + 'payrolls/delete/';

// Holiday Module
Global.getPeopleHolidayInformations = Global.host + Global.backend + 'peoples/getHolidayDaysInformations/';
Global.addHoliday = Global.host + Global.backend + 'holidays/add/';
Global.getPeoplePlannedHolidays = Global.host + Global.backend + 'holidays/peoplePlannedHolidays/';
Global.getUnseenHolidays = Global.host + Global.backend + 'holidays/getUnseenHolidays/';
Global.acceptHoliday = Global.host + Global.backend + 'holidays/acceptHoliday/';
Global.rejectHoliday = Global.host + Global.backend + 'holidays/rejectHoliday/';
Global.getPeopleHistoryHolidays = Global.host + Global.backend + 'holidays/holidaysHistory/';
Global.getAvailableHolidayDays = Global.host + Global.backend + 'holidays/getAvailableHolidayDays/';

// PeopleCategory Module
Global.addPeopleCategory = Global.host + Global.backend + 'people_categories/add/';
Global.getPeopleCategories = Global.host + Global.backend + 'people_categories/';
Global.getPeopleCategoryInformation = Global.host + Global.backend + 'people_categories/view/';
Global.deletePeopleCategory = Global.host + Global.backend + 'people_categories/delete/';

// Tracking Module
Global.track = Global.host + Global.backend + 'app_tracks/track/';

// Post Module
Global.addPost = Global.host + Global.backend + 'posts/add/';
Global.getOrganizationPosts = Global.host + Global.backend + 'posts/getOrganizationPosts/';
Global.postImageSrc = Global.host + Global.application + 'assets/posts/files/';
Global.getPostInformation = Global.host + Global.backend + 'posts/view/';
Global.deletePost = Global.host + Global.backend + 'posts/delete/';
Global.likePost = Global.host + Global.backend + 'posts/like/';
Global.dislikePost = Global.host + Global.backend + 'posts/dislike/';
Global.unlikePost = Global.host + Global.backend + 'posts/unlike/';

// Blog Module
Global.addBlogArticle = Global.host + Global.backend + 'blogs/add/';
Global.getOrganizationBlogs = Global.host + Global.backend + 'blogs/';
Global.getBlogInformation = Global.host + Global.backend + 'blogs/view/';
Global.getBlogContent = Global.host + Global.backend + 'blogs/getBlogContent/';
Global.deleteBlog = Global.host + Global.backend + 'blogs/delete/';

// Food Menu Module
Global.addFoodMenu = Global.host + Global.backend + 'food_menus/add/';
Global.getTodayFoodMenu = Global.host + Global.backend + 'food_menus/today/';
Global.getFoodMenuCurrency = Global.host + Global.backend + 'currencies/currency/';
Global.updateFoodMenuCurrency = Global.host + Global.backend + 'organizations/updateFoodMenuCurrency/';
Global.getFoodMenuInformation = Global.host + Global.backend + 'food_menus/view/';
Global.deleteFoodMenu = Global.host + Global.backend + 'food_menus/delete/';

// Country Module
Global.addCountry = Global.host + Global.backend + 'countries/add/';
Global.getAvailableCountries = Global.host + Global.backend + 'countries/getAvailableCountries/';
Global.deleteCountry = Global.host + Global.backend + 'countries/delete/';

// Currency
Global.getAllCurrencies = Global.host + Global.backend + 'currencies/';

// Upload files
Global.uploadPeoplePhoto = Global.host + Global.application + Global.scripts + 'upload-people-photo.php';
Global.uploadPostFile = Global.host + Global.application + Global.scripts + 'upload-post-file.php';

/* */

// HTTP status codes
Global.httpBadRequest = 400;
Global.httpUnauthorized = 401;
Global.httpOk = 200;
Global.mustHavePremiumAccount = 002;
Global.errorMessages = {
	3: 'This email address is already used. Please use another email address!',
	4: 'This organization name is already used. Please use another organization name!'
}

// Routes
Global.homeRoute = '/posts';
Global.afterLoginRedirectRoute = Global.homeRoute;
Global.showPeopleRoute = '/peoples';
Global.showJobsRoute = '/jobs';
Global.showDepartmentsRoute = '/departments';
Global.showBrandsRoute = '/brands';
Global.showTeamsRoute = '/teams';
Global.showDocumentsRoute = '/documents';
Global.peoplePayrollsRoute = '/people-payrolls';
Global.payrollsListRoute = '/payrolls/';
Global.reviewUserHolidaysRoute = '/review-user-holidays';
Global.peopleListHolidayRoute = '/people-list-holiday';
Global.peopleListHolidaysPlannedRoute = '/people-list-holidays-planned';
Global.peopleListHolidaysHistory = '/people-list-holidays-history';
Global.holidaysHistoryRoute = '/holidays-history/';
Global.peopleCategoriesRoute = '/people-categories';
Global.peopleCategoryRoute = '/people-category/';
Global.editPeopleListRoute = '/edit-people-list';

// Change password
Global.changeOrganizationPassword = Global.host + Global.backend + '/organizations/changePassword';
Global.changePeoplePassword = Global.host + Global.backend + '/peoples/changePassword';

// Limits and offsets
Global.infiniteScrollLimit = 15;

// Accounts
Global.basicAccount = 'Basic';
Global.revertToBasicAccount = Global.host + Global.backend + 'organizations/revertToBasicAccount/';
Global.userRevertToBasicAccount = Global.host + Global.backend + 'organizations/userRevertToBasicAccount/';
Global.basicAccountMaxPeople = 20;
Global.basicAccountMaxDepartments = 5;
Global.basicAccountMaxBrands = 2;
Global.basicAccountMaxTeams = 5;
Global.basicAccountMaxDocuments = 30;
Global.premium1Account = sessionStorage.accountType !== 'Basic';
Global.basicAccountMaxPeopleCategories = 5;

// Notifications
Global.notifyRevertToBasicAccount = false;

// URLs
Global.peopleDescription = Global.host + Global.application + '#/people-description/';
