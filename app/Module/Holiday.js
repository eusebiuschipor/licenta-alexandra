(function() {
    var app = angular.module('Holiday', []);

    app.service('GetUserHolidays', ['$http', '$window', function ($http, $window) {
        var holidaysList = null,
            self = this;

        this.get = function(url, callback, peopleId, limit, offset) {
            $http.get(
                url + peopleId, {
                    params: {
                        limit: limit,
                        offset: offset
                    }
                })
                .success(function(data, status, headers, config) {
                    holidaysList = new Array();

                    for (var i = 0; i < data.length; i++) {
                        var holiday = new Object();
                        holiday.nr = i + 1;
                        holiday.days = data[i]['holidays']['days'];
                        holiday.startDate = data[i]['holidays']['start_date'];
                        holiday.endDate = data[i]['holidays']['end_date'];

                        if (data[i]['holidays']['status'] == 0) {
                            holiday.status = 'Unseen';
                        } else if (data[i]['holidays']['status'] == 1) {
                            holiday.status = 'Rejected';
                        } else {
                            holiday.status = 'Accepted';
                        }

                        holidaysList.push(holiday);
                    }

                    callback();
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getPlannedHolidays = function(callback, peopleId) {
            self.get(Global.getPeoplePlannedHolidays, callback, peopleId);
        }

        this.getHolidayHistory = function(callback, peopleId, limit, offset) {
            self.get(Global.getPeopleHistoryHolidays, callback, peopleId, limit, offset);
        }

        this.getHolidaysList = function() {
            return holidaysList;
        }
    }]);

    app.controller('HolidaysController', ['$scope', '$http', '$window', '$routeParams', 'GrayBox', function($scope, $http, $window, $routeParams, GrayBox) {
        var holidayInformations = {},
            peopleId = $routeParams.peopleId || window.sessionStorage['peopleId'];

        $http.get(Global.getPeopleHolidayInformations + peopleId)
            .success(function(data, status, headers, config) {
                holidayInformations.holidayDaysPerYear = data[0]['people']['holiday_year_days'];
                holidayInformations.availableHolidayDays = data[0]['people']['available_holiday_days'];
            })
            .error(function(data, status, headers, config) {
                console.log('error');
            });

        this.getHolidayDaysPerYear = function() {
            return holidayInformations.holidayDaysPerYear;
        }

        this.getAvailableHolidayDays = function() {
            return holidayInformations.availableHolidayDays;
        }

        this.showGrayBox = GrayBox.show;
    }]);

    app.controller('AddHolidayController', ['$scope', '$http', '$window', '$location', '$routeParams', 'Form', function($scope, $http, $window, $location, $routeParams, Form) {
        var self = this,
            dataObject = null,
            months = new Array(),
            days = new Array(),
            pendingStatus = 0,
            currentYear = new Date().getFullYear();

        this.availableHolidayDays = 0;
        this.addHolidayForm = {};

        this.submitTheForm = function() {
            dataObject = {
                people_id: window.sessionStorage['peopleId'],
                start_date: self.addHolidayForm.startYear + '-' + self.addHolidayForm.startMonth + '-' + self.addHolidayForm.startDay,
                end_date: self.addHolidayForm.endYear + '-' + self.addHolidayForm.endMonth + '-' + self.addHolidayForm.endDay,
                days: self.addHolidayForm.days,
                status: pendingStatus,
                remainingHolidayDays: self.availableHolidayDays - self.addHolidayForm.days,
                organizationId: sessionStorage.organizationId
            };

            Form.sendDataToServer(Global.addHoliday, dataObject);
            self.addHolidayForm = {};
            $location.path('/review-user-holiday');
            PopupMessage.showPopupMessage('Success', 'The vacantion was added with succes!');
        }

        for (var i = 1; i <= 12; i++) {
            months.push(i);
        }

        for (var i = 1; i <= 31; i++) {
            days.push(i);
        }

        this.getMonths = function() {
            return months;
        }

        this.getDays = function() {
            return days;
        }

        this.getCurrentYear = function() {
            return currentYear;
        }

        this.getAvailableHolidayDays = function() {
            $http.get(Global.getAvailableHolidayDays + window.sessionStorage['peopleId'])
                .success(function(data, status, headers, config) {
                    self.availableHolidayDays = parseInt(data[0]['people']['available_holiday_days']);
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getAvailableHolidayDays();
    }]);

    app.controller('PlannedHolidaysController', ['$scope', '$http', '$window', '$routeParams', 'GetUserHolidays', 'GrayBox', function($scope, $http, $window, $routeParams, GetUserHolidays, GrayBox) {
        var peopleId = $routeParams.peopleId || window.sessionStorage['peopleId'],
            holidays = new Array();

        this.getPlannedHolidaysList = function() {
            return holidays;
        }

        this.callbackGetHolidaysList = function() {
            holidays = GetUserHolidays.getHolidaysList();
        }

        this.showGrayBox = GrayBox.show;

        GetUserHolidays.getPlannedHolidays(this.callbackGetHolidaysList, peopleId);
    }]);

    app.controller('HolidaysHistoryController', ['$scope', '$http', '$window', '$routeParams', '$location', 'GetUserHolidays', 'PopupMessage', function($scope, $http, $window, $routeParams, $location, GetUserHolidays, PopupMessage) {
        var peopleId = $routeParams.peopleId || window.sessionStorage['peopleId'],
            holidays = new Array(),
            self = this,
            offset = 0;

        this.checkPremium = function() {
            if (!Global.premium1Account) {
                PopupMessage.showPopupMessage('Youn need a Premium account to see the Holidays History!');
                $location.path(Global.homeRoute);
            } else {
                $('.premium-1').show();
            }
        }

        this.getHolidayHistoryList = function() {
            return holidays;
        }

        this.callbackGetHolidaysList = function() {
            newHolidaysList = new Array();

            if (holidays.length == 0) {
                holidays = GetUserHolidays.getHolidaysList();
            } else {
                newHolidaysList = GetUserHolidays.getHolidaysList();

                for (var i = 0; i < newHolidaysList.length; i++) {
                    holidays.push(newHolidaysList[i]);
                }
            }
        }

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == (Global.holidaysHistoryRoute + peopleId)) {
                GetUserHolidays.getHolidayHistory(self.callbackGetHolidaysList, peopleId, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetUserHolidays.getHolidayHistory(this.callbackGetHolidaysList, peopleId, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('ReviewUserHolidaysController', ['$scope', '$http', '$window', '$location', 'GetUserHolidays', 'Form', 'GrayBox', function($scope, $http, $window, $location, GetUserHolidays, Form, GrayBox) {
        var organizationId = $window.sessionStorage['organizationId'],
            holidaysList = new Array(),
            dataObject = {},
            offset = 0,
            self = this;

        this.getData = function(limit, offset) {
            $http.get(
                Global.getUnseenHolidays + organizationId, {
                    params: {
                        limit: limit,
                        offset: offset
                    }
                })
                .success(function(data, status, headers, config) {
                    for (var i = 0; i < data.length; i++) {
                        var holiday = new Object();
                        holiday.nr = offset + i + 1;
                        holiday.id = data[i]['holidays']['id'];
                        holiday.days = data[i]['holidays']['days'];
                        holiday.startDate = data[i]['holidays']['start_date'];
                        holiday.endDate = data[i]['holidays']['end_date'];
                        holiday.peopleFirstName = data[i]['people']['first_name'];
                        holiday.peopleLastName = data[i]['people']['last_name'];

                        holidaysList.push(holiday);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getUnseenHolidays = function() {
            return holidaysList;
        }

        this.acceptHoliday = function(holidayId) {
            dataObject = {
                id: holidayId
            }

            Form.sendDataToServer(Global.acceptHoliday, dataObject);
        }

        this.rejectHoliday = function(holidayId) {
            dataObject = {
                id: holidayId
            }

            Form.sendDataToServer(Global.rejectHoliday, dataObject);
        }

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.reviewUserHolidaysRoute) {
                self.getData(Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        this.getData(Global.infiniteScrollLimit, offset);
        this.showGrayBox = GrayBox.show;
    }]);
})();
