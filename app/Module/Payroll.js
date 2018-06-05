(function() {
    var app = angular.module('Payroll', []);

    app.service('GetAllPayrolls', ['$http', '$window', function ($http, $window) {
        var payrollsList = null,
            responsePromise = null;

        this.get = function(callback, peopleId, limit, offset) {
            $http.get(Global.getUserPayrolls + peopleId, {
                    params: {
                        limit: limit,
                        offset: offset,
                        accountType: $window.sessionStorage['accountType']
                    }
                })
                .success(function(data, status, headers, config) {
                    payrollsList = new Array();

                    for (var i = 0; i < data.length; i++) {
                        var payroll = new Object();
                        payroll.nr = i + 1;
                        payroll.id = data[i]['payrolls']['id'];
                        payroll.month = data[i]['payrolls']['month'];
                        payroll.year = data[i]['payrolls']['year'];
                        payroll.dateCreated = data[i]['payrolls']['created'];
                        payroll.workedDays = data[i]['payrolls']['worked_days'] != 0 ? data[i]['payrolls']['worked_days'] : '-';
                        payroll.totalDays = data[i]['payrolls']['total_days'] != 0 ? data[i]['payrolls']['total_days'] : '-';
                        payroll.totalPayroll = data[i]['payrolls']['total_payroll'] ? data[i]['payrolls']['total_payroll'] : '-';
                        payrollsList.push(payroll);
                    }

                    callback();
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }

        this.getPayrollsList = function() {
            return payrollsList;
        }
    }]);

    app.controller('PayrollsListController', ['$scope', '$http', '$window', '$routeParams', '$location', 'GetAllPayrolls', 'Form', 'GrayBox', function($scope, $http, $window, $routeParams, $location, GetAllPayrolls, Form, GrayBox) {
        var payrolls = new Array(),
            peopleId = $routeParams.peopleId || window.sessionStorage['peopleId'],
            offset = 0,
            self = this,
            newPayrollsList = null;

        this.showGrayBox = GrayBox.show;

        this.getPayrollsList = function() {
            return payrolls;
        }

        this.callbackGetPayrollsList = function() {
            payrolls = GetAllPayrolls.getPayrollsList();
        }

        this.deletePayroll = function(payrollId) {
            dataObject = {
                id: payrollId
            }

            Form.sendDataToServer(Global.deletePayroll, dataObject);
        };

        this.callbackGetPayrollsList = function() {
            newPayrollsList = null;

            if (payrolls.length == 0) {
                payrolls = GetAllPayrolls.getPayrollsList();
            } else {
                newPayrollsList = GetAllPayrolls.getPayrollsList();

                for (var i = 0; i < newPayrollsList.length; i++) {
                    payrolls.push(newPayrollsList[i]);
                }
            }
        }

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10) && $location.path() == (Global.payrollsListRoute + peopleId)) {
                GetAllPayrolls.get(self.callbackGetPayrollsList, peopleId, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetAllPayrolls.get(this.callbackGetPayrollsList, peopleId, Global.infiniteScrollLimit, offset);
    }]);

    app.controller('AddPayrollController', ['$scope', '$http', '$window', '$location', '$routeParams', 'Form', 'GetAllPeoples', 'PopupMessage', function($scope, $http, $window, $location, $routeParams, Form, GetAllPeoples, PopupMessage) {
        var self = this,
            dataObject = null,
            payrollId = $routeParams.payrollId,
            peoples = new Array(),
            currentMonth = new Date().getMonth(),
            currentYear = new Date().getFullYear()
            months = new Array(),
            years = new Array(),
            i = 0;

        this.addPayrollForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: payrollId,
                organizationId: sessionStorage.organizationId,
                employee: self.addPayrollForm.employee,
                month: self.addPayrollForm.month,
                year: self.addPayrollForm.year,
                worked_days: self.addPayrollForm.workedDays,
                total_days: self.addPayrollForm.totalDays
            };

            Form.sendDataToServer(Global.addPayroll, dataObject);
            self.addPayrollForm = {};
            $location.path('/success-added-payroll');
            PopupMessage.showPopupMessage('Success', 'The payroll was added with success!');
        }

        this.callbackGetPeopleList = function() {
            peoples = GetAllPeoples.getPeopleList();
        }

        this.getAllEmployees = function() {
            return peoples;
        }

        this.getCurrentMonth = function() {
            return currentMonth;
        }

        this.getCurrentYear = function() {
            return currentYear;
        }

        GetAllPeoples.get(this.callbackGetPeopleList);

        this.getPayrollInformation= function() {
            $http.get(Global.getPayrollInformation + payrollId)
                .success(function(data, status, headers, config) {
                    self.addPayrollForm.employee = data[i]['payrolls']['employee'];
                    self.addPayrollForm.month = data[i]['payrolls']['month'];
                    self.addPayrollForm.year = data[i]['payrolls']['year'];
                    self.addPayrollForm.workedDays = data[i]['payrolls']['worked_days'] != 0 ? data[i]['payrolls']['worked_days'] : '-';
                    self.addPayrollForm.totalDays = data[i]['payrolls']['total_days'] != 0 ? data[i]['payrolls']['total_days'] : '-';
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);
})();
