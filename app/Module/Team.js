(function() {
    var app = angular.module('Team', []);

    app.service('GetOrganizationTeams', ['$http', '$window', function($http, $window) {
        var teamsList = null,
            self = this;

        this.get = function(callback, limit, offset) {
            var dataObject = {
                organizationId: $window.sessionStorage['organizationId'],
                limit: limit || 99999,
                offset: offset || 0
            }

            responsePromise = $http.post(Global.getOrganizationTeams, dataObject, {});
            responsePromise.success(function(data, status, headers, config) {
                teamsList = new Array();

                for (var i = 0; i < data.length; i++) {
                    var team = new Object();
                    team.nr = i + 1;
                    team.id = data[i]['teams']['id'];
                    team.name = data[i]['teams']['name'];
                    team.description = data[i]['teams']['description'];
                    team.managerFirstName = data[i]['people']['first_name'];
                    team.managerLastName = data[i]['people']['last_name'];
                    teamsList.push(team);
                }

                callback();
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getTeamsList = function() {
            return teamsList;
        }
    }]);

    app.controller('AddTeamController', ['$scope', '$http', '$location', '$routeParams', '$window', 'GetAllPeoples', 'PopupMessage', function($scope, $http, $location, $routeParams, $window, GetAllPeoples, Form, PopupMessage) {
        var self = this,
            dataObject = null,
            peoples = null,
            teamId = $routeParams.teamId;

        this.addTeamForm = {};

        this.submitTheForm = function() {
            dataObject = {
                id: teamId,
                name: self.addTeamForm.name,
                description: self.addTeamForm.description,
                manager: self.addTeamForm.manager,
                organizationId: sessionStorage.organizationId,
                accountType: $window.sessionStorage['accountType']
            };

            responsePromise = $http.post(Global.addTeam, dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                responseCode = parseInt(dataFromServer);

                if (responseCode == Global.mustHavePremiumAccount) {
                    PopupMessage.showPopupMessage('You need a Premium account for adding more than ' + Global.basicAccountMaxTeams + ' teams!');
                } else {
                    self.addTeamForm = {};
                    $location.path('/teams');
                    PopupMessage.showPopupMessage('Success', 'The team was registered!');
                }
            });
            responsePromise.error(function(data, status, headers, config) {
                console.log('error');
            });
        }

        this.getAllPeoples = function() {
            return peoples;
        }

        this.callbackGetPeoplelist = function() {
            peoples = GetAllPeoples.getPeopleList();
        }

        GetAllPeoples.get(this.callbackGetPeoplelist);

        this.getTeamInformation = function() {
            $http.get(Global.getTeamInformation + teamId)
                .success(function(data, status, headers, config) {
                    self.addTeamForm.name = data[0]['teams']['name'];
                    self.addTeamForm.description = data[0]['teams']['description'];
                    self.addTeamForm.manager = data[0]['teams']['manager'];
                })
                .error(function(data, status, headers, config) {
                    console.log('error');
                });
        }
    }]);

    app.controller('TeamsListController', ['$scope', '$http', '$window', '$location', 'GetOrganizationTeams', 'Form', 'GrayBox', 'PopupMessage', function($scope, $http, $window, $location, GetOrganizationTeams, Form, GrayBox, PopupMessage) {
        var teams = new Array(),
            offset = 0,
            self = this,
            dataObject = null;

        this.getTeamsList = function() {
            return teams;
        }

        this.callbackGetTeamsList = function() {
            newTeamsList = null;

            if (teams.length == 0) {
                teams = GetOrganizationTeams.getTeamsList();
            } else {
                newTeamsList = GetOrganizationTeams.getTeamsList();

                for (var i = 0; i < newTeamsList.length; i++) {
                    teams.push(newTeamsList[i]);
                }
            }
        }

        this.deleteTeam = function(teamId) {
            dataObject = {
                id: ActionVariable.itemToBeDeleted
            }

            Form.sendDataToServer(Global.deleteTeam, dataObject);
        }

        this.showDeleteTeamPopup = function(teamId, teamName) {
            PopupMessage.showDeletePopup(teamId, 'Are you sure that you want to delete the team ' + teamName + '?', 'delete-team');
        }

        this.goEditTeam = function(id) {
            $location.path('edit-team/' + id);
        }

        this.showGrayBox = GrayBox.show;

        $window.onscroll = function() {
            if (($(window).scrollTop() + $(window).height() >= $(document).height() - 10 ) && $location.path() == Global.showTeamsRoute) {
                GetOrganizationTeams.get(self.callbackGetTeamsList, Global.infiniteScrollLimit, offset += Global.infiniteScrollLimit);
            }
        };

        GetOrganizationTeams.get(this.callbackGetTeamsList, Global.infiniteScrollLimit, offset);
    }]);
})();
