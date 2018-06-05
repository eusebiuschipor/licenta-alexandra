(function() {
    var app = angular.module('People', []);

    app.service('GetAllPeoples', ['$http', '$window', function ($http, $window) {
        var peopleList = null,
            responsePromise = null;

        this.get = function(callback, categoryId, limit, offset, requestURL) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId'],
                categoryId: categoryId,
                offset: offset || 0,
                limit: limit || 99999
            };

            responsePromise = $http.post(requestURL ? requestURL : Global.getAllPeoplesUrl, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                peopleList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var people = new Object();
                    people.id = data[i]['people']['id'];
                    people.firstName = data[i]['people']['first_name'];
                    people.lastName = data[i]['people']['last_name'];
                    people.photo = data[i]['people']['photo'] != '' ? data[i]['people']['photo'] : Global.peopleDefaultImageName;
                    people.jobTitle = data[i]['jobs']['title'];
                    people.country = data[i]['people']['country'];
                    people.department = data[i]['people']['department'];
                    people.departmentName = data[i]['departments']['name'];
                    people.brand = data[i]['people']['brand'];
                    people.jobAvailability = data[i]['jobs']['availability'];
                    people.departmentAvailability =  data[i]['departments']['availability'];
                    peopleList.push(people);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getPeopleList = function() {
            return peopleList;
        }
    }]);

    app.controller('PeoplesController', ['$scope', '$http', '$window', '$routeParams', '$location', 'GetAllPeoples', 'GetAllCountries', 'GetAllDepartments', 'GetAllBrands', 'Form', 'PopupMessage', 'GrayBox', 'Auth', function($scope, $http, $window, $routeParams, $location, GetAllPeoples, GetAllCountries, GetAllDepartments, GetAllBrands, Form, PopupMessage, GrayBox, Auth) {
        var peoples = new Array(),
            successRequest = false,
            countries = null,
            departments = null,
            brands = null,
            categoryId = $routeParams.categoryId,
            offset = 0,
            self = this,
            okRoute = false,
            translate = new Translate('english'),
            accessibleRoutes = [
                Global.showPeopleRoute,
                Global.peoplePayrollsRoute,
                Global.peopleListHolidayRoute,
                Global.peopleListHolidaysPlannedRoute,
                Global.peopleListHolidaysHistory,
                Global.editPeopleListRoute
            ],
            requestURL = null;

        this.strings = {
            noJobAvailable: translate.noJobAvailable,
            departmentNotAvailable: translate.departmentNotAvailable
        };
        this.isLoggedInAsOrganization = Auth.isLoggedInAsOrganization();

        $scope.successRequestGetPeopleList = false;

        if ($location.path().indexOf('peoples/department') > -1) {
            requestURL = Global.getPeopleFromDepartment;
        } else if ($location.path().indexOf('peoples/job') > -1) {
            requestURL = Global.getPeopleFromJob;
        }

        this.notifyRevertToBasicAccount = function() {
            if (Global.notifyRevertToBasicAccount) {
                PopupMessage.showPopupMessage('Important:', 'Your account "Premium 1" has expired. If you want to continue with a premium account, please buy a new subscription.');
            }
        }

        this.callbackGetPeoplelist = function() {
            var newPeopleList = null;

            if (peoples.length == 0) {
                peoples = GetAllPeoples.getPeopleList();
                self.notifyRevertToBasicAccount();
            } else {
                newPeopleList = GetAllPeoples.getPeopleList();

                for (var i = 0; i < newPeopleList.length; i++) {
                    peoples.push(newPeopleList[i]);
                }
            }

            $scope.successRequestGetPeopleList = true;
        }

        this.callbackGetAllCountries = function() {
            countries = GetAllCountries.getCountriesList();
        }

        this.callbackGetAllDepartments = function() {
            departments = GetAllDepartments.getDepartmentsList();
        }

        this.callbackGetAllBrands = function() {
            brands = GetAllBrands.getBrandsList();
        }

        this.getPeopleImageSrc = function() {
            return Global.peopleImageSrc;
        }

        this.getAllPeoples = function() {
            return peoples;
        }

        this.getAllDepartments = function() {
            return departments;
        }

        this.getSuccessRequest = function() {
            return successRequest;
        }

        this.getAllCountries = function() {
            return countries;
        }

        this.getAllBrands = function() {
            return brands;
        }


        this.deletePeople = function() {
            var dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deletePeople, dataObject);
        }

        this.showDeletePeoplePopup = function(peopleId, peopleFirstName, peopleLastName) {
            PopupMessage.showDeletePopup(peopleId, 'Are you sure you want to delete this people ' + peopleFirstName + ' ' + peopleLastName + '?', 'delete-people');
        }

        this.getSearchPeopleTemplate = function() {
            return Global.searchPeopleTemplate;
        }

        this.goEditPeople = function(id) {
            $location.path('edit-people/' + id);
        }

        this.goPeopleDescription = function(id) {
            $location.path('people-description/' + id);
        }

        this.showGrayBox = GrayBox.show;

        for (var i = 0; i < accessibleRoutes.length; i++) {
            if ($location.path() == accessibleRoutes[i]) {
                okRoute = true;
            }
        }

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && okRoute) {
                GetAllPeoples.get(self.callbackGetPeoplelist, categoryId, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit, requestURL);
            }
        };

        GetAllPeoples.get(this.callbackGetPeoplelist, categoryId, Global.infiniteScrollLimit, offset, requestURL);
        GetAllCountries.get(this.callbackGetAllCountries);
        GetAllDepartments.get(this.callbackGetAllDepartments);
        GetAllBrands.get(this.callbackGetAllBrands);
    }]);

    app.controller('PeopleDescriptionController', ['$scope', '$http', '$routeParams', '$location', 'GetAllJobs', 'GetAllCountries', 'GetAllDepartments', 'GetAllBrands', 'GetOrganizationLocations', 'Form', 'Get', function($scope, $http, $routeParams, $location, GetAllJobs, GetAllCountries, GetAllDepartments, GetAllBrands, GetOrganizationLocations, Form, Get) {
        var peopleId = $routeParams.peopleId,
            successRequest = false,
            peopleImageSrc = Global.peopleImageSrc,
            imagesSrc = Global.imagesSrc,
            translate = new Translate('english'),
            brandText = translate.brand,
            countryText = translate.country,
            departmentText = translate.department,
            jobTitleText = translate.jobTitle,
            addressText = translate.address,
            birthdayText = translate.birthday,
            locationText = translate.location,
            telephoneText = translate.telephone,
            workTimeText = translate.workTime,
            mentorText = translate.mentor,
            monthsText = translate.months,
            hobbiesText = translate.hobbies,
            workPlaceText = translate.workPlace,
            maritalStatusText = translate.maritalStatus,
            educationText = translate.education,
            teamText = translate.team,
            bloodGroupText = translate.bloodGroup,
            alternateEmailText = translate.alternateEmail,
            partnerBirthdayText = translate.partnerBirthday,
            maidenNameText = translate.maidenName,
            partnerText = translate.partner,
            genderText = translate.gender,
            nicknameText = translate.nickname,
            emailText = translate.email,
            usernameText = translate.username,
            joinDateText = translate.joinDate,
            timeInThisOrganisationText = translate.timeInThisOrganisation,
            categoryText = translate.category,
            self = this,
            jobs = new Array(),
            countries = new Array(),
            departments = new Array(),
            brands = new Array(),
            personalInformationsShown = true,
            employeeInformationsShown = false,
            data = null,
            locations = null,
            translate = new Translate('english');

        this.strings = {
            noJobAvailable: translate.noJobAvailable,
            departmentNotAvailable: translate.departmentNotAvailable
        };

        this.peopleInformation = new Object();

        Get.getData(Global.getPeopleCategory, peopleId, function() {
            self.peopleInformation.category = Get.getReceivedData()[0]['people_categories']['title'];
        });

        Get.getData(Global.getPeopleBrand, peopleId, function() {
            self.peopleInformation.brand = Get.getReceivedData()[0]['brands']['name'];
        });

        Get.getData(Global.getPeopleCountry, peopleId, function() {
            self.peopleInformation.country = Get.getReceivedData()[0]['available_countries']['name'];
        });

        Get.getData(Global.getPeopleDepartment, peopleId, function() {
            self.peopleInformation.department = Get.getReceivedData()[0]['departments']['name'];
            self.peopleInformation.departmentAvailability = Get.getReceivedData()[0]['departments']['availability'];
        });

        Get.getData(Global.getPeopleLocation, peopleId, function() {
            self.peopleInformation.location = Get.getReceivedData()[0]['locations']['name'];
        });

        Get.getData(Global.getPeopleWorkTimes, peopleId, function() {
            self.peopleInformation.workTime = Get.getReceivedData()[0]['work_times']['interval'];
        });

        Get.getData(Global.getPeopleWorkPlace, peopleId, function() {
            self.peopleInformation.workPlace = Get.getReceivedData()[0]['work_places']['name'];
        });

        Get.getData(Global.getPeopleMaritalStatus, peopleId, function() {
            self.peopleInformation.maritalStatus = Get.getReceivedData()[0]['marital_statuses']['name'];
        });

        Get.getData(Global.getPeopleTeam, peopleId, function() {
            self.peopleInformation.team = Get.getReceivedData()[0]['teams']['name'];
        });

        Get.getData(Global.getPeopleBloodGroup, peopleId, function() {
            self.peopleInformation.bloodGroup = Get.getReceivedData()[0]['blood_group']['name'];
        });

        Get.getData(Global.getPeopleGender, peopleId, function() {
            self.peopleInformation.gender = Get.getReceivedData()[0]['gender']['name'];
        });

        this.getPeopleInformation = function() {
            $http.get(Global.getPeopleDescriptionUrl + peopleId)
                .success(function(data, status, headers, config) {
                    self.peopleInformation.firstName = data[0]['people']['first_name'];
                    self.peopleInformation.lastName = data[0]['people']['last_name'];
                    self.peopleInformation.photo = data[0]['people']['photo'] !== '' ? data[0]['people']['photo'] : Global.peopleDefaultImageName;
                    self.peopleInformation.username = data[0]['people']['username'];
                    self.peopleInformation.email = data[0]['people']['email'];
                    self.peopleInformation.jobTitle = data[0]['jobs']['title'];
                    self.peopleInformation.address = data[0]['people']['address'];
                    self.peopleInformation.birthday = data[0]['people']['birthday'] !== '0000-00-00' ? data[0]['people']['birthday'] : '';
                    self.peopleInformation.telephone = data[0]['people']['telephone'];
                    self.peopleInformation.mentorId = data[0]['people']['mentor'];
                    self.peopleInformation.hobbies = data[0]['people']['hobbies'];
                    self.peopleInformation.education = data[0]['people']['education'];
                    self.peopleInformation.alternateEmail = data[0]['people']['alternate_email'];
                    self.peopleInformation.partnerBirthday = data[0]['people']['partner_birthday'] !== '0000-00-00' ? data[0]['people']['partner_birthday'] : '';
                    self.peopleInformation.maidenName = data[0]['people']['maiden_name'];
                    self.peopleInformation.partner = data[0]['people']['partner'];
                    self.peopleInformation.nickname = data[0]['people']['nickname'];
                    self.peopleInformation.joinDate = data[0]['people']['join_date'] !== '0000-00-00' ? data[0]['people']['join_date'] : '';
                    self.peopleInformation.jobAvailability = data[0]['jobs']['availability'];

                    successRequest = true;

                    if (self.peopleInformation.mentorId != 0) {
                        $http.get(Global.getPeopleNameById + self.peopleInformation.mentorId)
                            .success(function(data, status, headers, config) {
                                self.peopleInformation.mentorFirstName = data[0]['people']['first_name'];
                                self.peopleInformation.mentorLastName = data[0]['people']['last_name'];
                            })
                            .error(function(data, status, headers, config) {
                                console.log('error');
                            });
                    } else {
                        self.peopleInformation.mentorFirstName = '';
                        self.peopleInformation.mentorLastName = '';
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getEditPeopleInformation = function() {
            $http.get(Global.getEditPeopleInformation + peopleId)
                .success(function(data, status, headers, config) {
                    self.peopleInformation.firstName = data[0]['people']['first_name'];
                    self.peopleInformation.lastName = data[0]['people']['last_name'];
                    self.peopleInformation.photo = data[0]['people']['photo'];
                    self.peopleInformation.username = data[0]['people']['username'];
                    self.peopleInformation.email = data[0]['people']['email'];
                    self.peopleInformation.brand = data[0]['people']['brand'];
                    self.peopleInformation.country = data[0]['people']['country'];
                    self.peopleInformation.department = data[0]['people']['department'];
                    self.peopleInformation.jobTitle = data[0]['people']['jobTitle'];
                    successRequest = true;
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getImageSrc = function() {
            return imagesSrc;
        };

        this.getPeopleImageSrc = function() {
            return peopleImageSrc;
        }

        this.getBrandText = function() {
            return brandText;
        }

        this.getCountryText = function() {
            return countryText;
        }

        this.getDepartmentText = function() {
            return departmentText;
        }

        this.getJobTitleText = function() {
            return jobTitleText;
        }

        this.getAddressText = function() {
            return addressText;
        }

        this.getBirthdayText = function() {
            return birthdayText;
        }

        this.getLocationText = function() {
            return locationText;
        }

        this.getWorkTimeText = function() {
            return workTimeText;
        }

        this.getTelephoneText = function() {
            return telephoneText;
        }

        this.getMentorText = function() {
            return mentorText;
        }

        this.getMonthsText = function() {
            return monthsText;
        }

        this.getWorkPlaceText = function() {
            return workPlaceText;
        }

        this.getHobbiesText = function() {
            return hobbiesText;
        }

        this.getMaritalStatusText = function() {
            return maritalStatusText;
        }

        this.getEducationText = function() {
            return educationText;
        }

        this.getTeamText = function() {
            return teamText;
        }

        this.getBloodGroupText = function() {
            return bloodGroupText;
        }

        this.getAlternateEmailText = function() {
            return alternateEmailText;
        }

        this.getPartnerBirthdayText = function() {
            return partnerBirthdayText;
        }

        this.getMaidenNameText = function() {
            return maidenNameText;
        }

        this.getPartnerText = function() {
            return partnerText;
        }

        this.getNicknameText = function() {
            return nicknameText;
        }

        this.getGenderText = function() {
            return genderText;
        }

        this.getEmailText = function() {
            return emailText;
        }

        this.getUsernameText = function() {
            return usernameText;
        }

        this.getJoinDateText = function() {
            return joinDateText;
        }

        this.getTimeInThisOrganisationText = function() {
            return timeInThisOrganisationText;
        }

        this.getPeopleCategoryText = function() {
            return categoryText;
        }

        this.getSuccessRequest = function() {
            return successRequest;
        }

        this.callbackGetJobsList = function() {
            jobs = GetAllJobs.getJobsList();
        }

        this.callbackGetAllCountries = function() {
            countries = GetAllCountries.getCountriesList();
        }

        this.callbackGetAllDepartments = function() {
            departments = GetAllDepartments.getDepartmentsList();
        }

        this.callbackGetAllBrands = function() {
            brands = GetAllBrands.getBrandsList();
        }

        this.callbackGetOrganizationLocations = function() {
            locations = GetOrganizationLocations.getLocationsList();
        }

        this.getAllJobs = function() {
            return jobs;
        }

        this.getAllCountries = function() {
            return countries;
        }

        this.getAllDepartments = function() {
            return departments;
        }

        this.getAllBrands = function() {
            return brands;
        }

        this.personalInformations = function() {
            return personalInformationsShown;
        }

        this.employeeInformations = function() {
            return employeeInformationsShown;
        }

        this.showEmployeeInformations = function() {
            employeeInformationsShown = true;
            personalInformationsShown = false;
        }

        this.showPersonalInformations = function() {
            employeeInformationsShown = false;
            personalInformationsShown = true;
        }

        this.submitTheForm = function() {
            dataObject = {
                id: peopleId,
                first_name: self.peopleInformation.firstName,
                photo: Form.uploadPhoto(self.peopleInformation.photo),
                jobTitle: self.peopleInformation.jobTitle,
                country: self.peopleInformation.country,
                department: self.peopleInformation.department,
                brand: self.peopleInformation.brand,
                username: self.peopleInformation.username,
                email: self.peopleInformation.email,
                password: self.peopleInformation.password,
                organizationId: sessionStorage.organizationId
            };

            Form.sendDataToServer(Global.addPeople, dataObject);
            self.peopleInformation = {};
            $location.path('/peoples');
            PopupMessage.showPopupMessage('Success', 'The people was registered!');
        }

        this.getTotalTimeInCurrentOrganisation = function(_joinDate) {
            var currentDate = new Date(),
                joinDate = new Date(_joinDate),
                diff = Math.floor(currentDate.getTime() - joinDate.getTime()),
                day = 1000 * 60 * 60 * 24,
                days = Math.floor(diff/day),
                months = Math.floor(days/31),
                years = Math.floor(months/12),
                message = '';

            if (years) {
                message += years + ' years, ';
            }

            if ((months % 12) > 0) {
                message += (months % 12) + ' months, ';
            }

            days = days % 365;
            days = days % 31;

            message += days + ' days';

            if (years || (months % 12) > 0) {
                return message;
            } else {
                return translate.lessThanOneMonth;
            }
        }

        GetAllJobs.get(self.callbackGetJobsList);
        GetAllCountries.get(self.callbackGetAllCountries);
        GetAllDepartments.get(self.callbackGetAllDepartments);
        GetAllBrands.get(this.callbackGetAllBrands);
        GetOrganizationLocations.get(this.callbackGetOrganizationLocations);
    }]);

    app.controller('AddPeopleController', ['$scope', '$http', '$location', '$routeParams', '$window', 'GetAllCountries', 'GetAllJobs', 'GetAllDepartments', 'GetAllBrands', 'GetOrganizationLocations', 'GetOrganizationWorkTimes', 'GetOrganizationWorkPlaces', 'GetAllPeoples', 'GetMaritalStatus', 'GetOrganizationTeams', 'Form', 'GetAllPeopleCategories', 'PopupMessage', 'Auth', function($scope, $http, $location, $routeParams, $window, GetAllCountries, GetAllJobs, GetAllDepartments, GetAllBrands, GetOrganizationLocations, GetOrganizationWorkTimes, GetOrganizationWorkPlaces, GetAllPeoples, GetMaritalStatus, GetOrganizationTeams, Form, GetAllPeopleCategories, PopupMessage, Auth) {
        this.addPeopleForm = {};
        this.errorMessage = '';

        var departments = null,
            brands = null,
            jobs = null,
            countries = null,
            dataObject = null,
            locations = null,
            workTimes = null,
            workPlaces = null,
            maritalStatus = null,
            peoples = null,
            teams = null,
            categories = null,
            years = new Array(),
            months = new Array(),
            days = new Array(),
            currentYear = new Date().getFullYear(),
            self = this,
            peopleId = $routeParams.peopleId,
            responsePromise = null,
            responseCode = null,
            initialEmail = null;

        this.isLoggedInAsOrganization = Auth.isLoggedInAsOrganization();
        this.currentYear = currentYear;

        for (var i = currentYear - 100; i <= currentYear; i++) {
            years.push(i);
        }

        for (var i = 1; i <= 12; i++) {
            months.push(i);
        }

        for (var i = 1; i <= 31; i++) {
            days.push(i);
        }

        this.getEditPeopleInformation = function() {
            $http.get(Global.getEditPeopleInformation + peopleId)
                .success(function(data, status, headers, config) {
                    self.addPeopleForm.firstName = data[0]['people']['first_name'];
                    self.addPeopleForm.lastName = data[0]['people']['last_name'];
                    self.addPeopleForm.photo = data[0]['people']['photo'];
                    self.addPeopleForm.username = data[0]['people']['username'];
                    self.addPeopleForm.email = data[0]['people']['email'];
                    self.addPeopleForm.brand = data[0]['people']['brand'];
                    self.addPeopleForm.country = data[0]['people']['country'];
                    self.addPeopleForm.department = data[0]['people']['department'];
                    self.addPeopleForm.jobTitle = data[0]['people']['jobTitle'];
                    self.addPeopleForm.location = data[0]['people']['location'];
                    self.addPeopleForm.workTime = data[0]['people']['work_time'];
                    self.addPeopleForm.mentor = data[0]['people']['mentor'];
                    self.addPeopleForm.hobbies = data[0]['people']['hobbies'];
                    self.addPeopleForm.workPlace = data[0]['people']['working_place'];
                    self.addPeopleForm.maritalStatus = data[0]['people']['marital_status'];
                    self.addPeopleForm.birthdayYear = data[0]['people']['birthday'].substr(0, 4);
                    self.addPeopleForm.birthdayMonth = data[0]['people']['birthday'].substr(5, 2);
                    self.addPeopleForm.birthdayDay = data[0]['people']['birthday'].substr(8, 2);
                    self.addPeopleForm.telephone = data[0]['people']['telephone'];
                    self.addPeopleForm.education = data[0]['people']['education'];
                    self.addPeopleForm.address = data[0]['people']['address'];
                    self.addPeopleForm.gender = data[0]['people']['gender'];
                    self.addPeopleForm.partner = data[0]['people']['partner'];
                    self.addPeopleForm.partnerBirthdayYear = data[0]['people']['partner_birthday'].substr(0, 4);
                    self.addPeopleForm.partnerBirthdayMonth = data[0]['people']['partner_birthday'].substr(5, 2);
                    self.addPeopleForm.partnerBirthdayDay = data[0]['people']['partner_birthday'].substr(8, 2);
                    self.addPeopleForm.maidenName = data[0]['people']['maiden_name'];
                    self.addPeopleForm.bloodGroup = data[0]['people']['blood_group'];
                    self.addPeopleForm.joinYear = data[0]['people']['join_date'].substr(0, 4);
                    self.addPeopleForm.joinMonth = data[0]['people']['join_date'].substr(5, 2);
                    self.addPeopleForm.joinDay = data[0]['people']['join_date'].substr(8, 2);
                    self.addPeopleForm.alternateEmail = data[0]['people']['alternate_email'];
                    self.addPeopleForm.team = data[0]['people']['team_id'];
                    self.addPeopleForm.category = data[0]['people']['categoryId'];
                    self.initialEmail = self.addPeopleForm.email;
                    successRequest = true;
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getCurrentYear = function() {
            return currentYear;
        }

        this.getYears = function() {
            return years;
        }

        this.getMonths = function() {
            return months;
        }

        this.getDays = function() {
            return days;
        }

        this.getAllDepartments = function() {
            return departments;
        }

        this.getAllBrands = function() {
            return brands;
        }

        this.getAllLocations = function() {
            return locations;
        }

        this.getAllJobs = function() {
            return jobs;
        }

        this.getAllCountries = function() {
            return countries;
        }

        this.getAllWorkTimes = function() {
            return workTimes;
        }

        this.getAllPeoples = function() {
            return peoples;
        }

        this.getMaritalStatus = function() {
            return maritalStatus;
        }

        this.getWorkPlaces = function() {
            return workPlaces;
        }

        this.getAllTeams = function() {
            return teams;
        }

        this.getAllCategories = function() {
            return categories;
        }

        this.callbackGetAllCountries = function() {
            countries = GetAllCountries.getCountriesList();
        }

        this.callbackGetAllJobs = function() {
            jobs = GetAllJobs.getJobsList();
        }

        this.callbackGetAllDepartments = function() {
            departments = GetAllDepartments.getDepartmentsList();
        }

        this.callbackGetAllBrands = function() {
            brands = GetAllBrands.getBrandsList();
        }

        this.callbackGetOrganizationLocations = function() {
            locations = GetOrganizationLocations.getLocationsList();
        }

        this.callbackGetWorkTimes = function() {
            workTimes = GetOrganizationWorkTimes.getWorkTimesList();
        }

        this.callbackGetPeoplelist = function() {
            peoples = GetAllPeoples.getPeopleList();
        }

        this.callbackGetOrganizationWorkPlaces = function() {
            workPlaces = GetOrganizationWorkPlaces.getWorkPlacesList();
        }

        this.callbackGetMaritalStatus = function() {
            maritalStatus = GetMaritalStatus.getMaritalStatusList();
        }

        this.callbackGetOrganizationTeams = function() {
            teams = GetOrganizationTeams.getTeamsList();
        }

        this.callbackGetPeopleCategoriesList = function() {
            categories = GetAllPeopleCategories.getPeopleCategoriesList();
        }

        this.submitTheForm = function(edit) {
            dataObject = {
                id: peopleId,
                first_name: self.addPeopleForm.firstName,
                last_name: self.addPeopleForm.lastName,
                photo: typeof self.addPeopleForm.photo === 'object' ? Form.uploadPhoto(self.addPeopleForm.photo, Global.uploadPeoplePhoto, new Date().getTime()) : '',
                jobTitle: self.addPeopleForm.jobTitle,
                country: self.addPeopleForm.country,
                department: self.addPeopleForm.department,
                brand: self.addPeopleForm.brand,
                username: self.addPeopleForm.username,
                email: self.addPeopleForm.email,
                password: self.addPeopleForm.password,
                telephone: self.addPeopleForm.telephone,
                location: self.addPeopleForm.location,
                work_time: self.addPeopleForm.workTime,
                mentor: self.addPeopleForm.mentor,
                hobbies: self.addPeopleForm.hobbies,
                working_place: self.addPeopleForm.workPlace,
                marital_status: self.addPeopleForm.maritalStatus,
                birthday: self.addPeopleForm.birthdayYear + '-' + self.addPeopleForm.birthdayMonth + '-' + self.addPeopleForm.birthdayDay,
                education: self.addPeopleForm.education,
                address: self.addPeopleForm.address,
                nickname: self.addPeopleForm.nickname,
                gender: self.addPeopleForm.gender,
                partner: self.addPeopleForm.partner,
                maiden_name: self.addPeopleForm.maidenName,
                partner_birthday: self.addPeopleForm.birthdayPartnerYear + '-' + self.addPeopleForm.birthdayPartnerMonth + '-' + self.addPeopleForm.birthdayPartnerDay,
                alternate_email: self.addPeopleForm.alternateEmail,
                join_date: self.addPeopleForm.joinYear + '-' + self.addPeopleForm.joinMonth + '-' + self.addPeopleForm.joinDay,
                team_id: self.addPeopleForm.team,
                blood_group: self.addPeopleForm.bloodGroup,
                organizationId: sessionStorage.organizationId,
                categoryId: self.addPeopleForm.category,
                holiday_year_days: self.addPeopleForm.holidayDays,
                available_holiday_days: self.addPeopleForm.holidayDays,
                accountType: $window.sessionStorage['accountType']
            };

            if (edit) {
                delete dataObject.password;

                if (dataObject.email == self.initialEmail) {
                  delete dataObject.email;
                }

                if (dataObject.photo == '') {
                  delete dataObject.photo;
                }
            }

            responsePromise = $http.post(Global.addPeople, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (responseCode == Global.httpBadRequest) {
                    self.errorMessage = 'This email address is already used. Please use another email address!';
                } else if (responseCode == Global.mustHavePremiumAccount) {
                    PopupMessage.showPopupMessage('You need a Premium account for adding more than ' + Global.basicAccountMaxPeople + ' people!');
                } else {
                    self.addPeopleForm = {};
                    $location.path('/peoples');
                    PopupMessage.showPopupMessage(
                      'Congrats!',
                      edit ? 'Your personal informations was updated!' : 'The new user was added!'
                    );
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        GetAllCountries.get(this.callbackGetAllCountries);
        GetAllJobs.get(this.callbackGetAllJobs);
        GetAllDepartments.get(this.callbackGetAllDepartments);
        GetAllBrands.get(this.callbackGetAllBrands);
        GetOrganizationLocations.get(this.callbackGetOrganizationLocations);
        GetOrganizationWorkTimes.get(this.callbackGetWorkTimes);
        GetAllPeoples.get(this.callbackGetPeoplelist);
        GetOrganizationWorkPlaces.get(this.callbackGetOrganizationWorkPlaces);
        GetMaritalStatus.get(this.callbackGetMaritalStatus);
        GetOrganizationTeams.get(this.callbackGetOrganizationTeams);
        GetAllPeopleCategories.get(this.callbackGetPeopleCategoriesList);
    }]);
})();
