(function() {
  var app = angular.module('FoodMenu', []);

  app.service('GetFoodMenuCurrency', ['$http', '$window', function ($http, $window) {
    var currency = {};

    this.get = function(callback) {
      $http.get(Global.getFoodMenuCurrency + $window.sessionStorage['organizationId'])
           .success(function(data, status, headers, config) {
             currency.html = data[0]['currencies']['currency_html'];
             currency.id = data[0]['currencies']['id'];

             callback();
           })
           .error(function(data, status, headers, config) {
             console.log('error');
           });
    };

    this.getCurrency = function() {
      return currency;
    };
  }]);

  app.controller('AddFoodMenuController', ['$scope', '$http', '$window', '$location', '$routeParams', '$window', 'PopupMessage', 'Form', function($scope, $http, $window, $location, $routeParams, $window, PopupMessage, Form) {
    var self = this,
        dataObject = null,
        responsePromise = null,
        foodMenuId = $routeParams.foodMenuId,
        dateArray = null,
        dateString = null,
        foodMenuCurrencyHtml = null;

    this.addFoodMenuForm = {};

    // Activate date picker for menu
    $("#menu-datepicker").datepicker();

    this.submitTheForm = function() {
      dateString = self.addFoodMenuForm.date.toString();
      dateArray = dateString.split('/');

      dataObject = {
        id: foodMenuId,
        menu: self.addFoodMenuForm.menu,
        price: self.addFoodMenuForm.price,
        date: dateArray[2] + '-' + dateArray[0] + '-' + dateArray[1]
      };

      Form.sendDataToServer(Global.addFoodMenu, dataObject);
      self.addFoodMenuForm = {};
      $location.path('/today-food-menu');
      PopupMessage.showPopupMessage('Success', 'The food menu was added with succes!');
    };

    this.getFoodMenuInformation = function() {
      $http.get(Global.getFoodMenuInformation + foodMenuId)
           .success(function(data, status, headers, config) {
             self.addFoodMenuForm.menu = data[0]['food_menus']['menu'];
             self.addFoodMenuForm.price = data[0]['food_menus']['price'];
             self.addFoodMenuForm.date = data[0]['food_menus']['date'];

             dateString = self.addFoodMenuForm.date.toString();
             dateArray = dateString.split('-');
             self.addFoodMenuForm.date = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];
           })
           .error(function(data, status, headers, config) {
             console.log('error');
           });
    };
  }]);

  app.controller('CurrencyFoodMenuController', ['$scope', '$http', '$window', '$routeParams', '$location', 'GetAllCurrencies', 'GetFoodMenuCurrency', 'PopupMessage', function($scope, $http, $window, $routeParams, $location, GetAllCurrencies, GetFoodMenuCurrency, PopupMessage) {
    this.currency = {};
    this.currencies = null;

    var self = this;

    this.callbackGetAllCurrencies = function() {
      self.currencies = GetAllCurrencies.getCurrenciesList();
    }

    this.callbackGetFoodMenuCurrency = function() {
      self.currency = GetFoodMenuCurrency.getCurrency();
    };

    GetFoodMenuCurrency.get(this.callbackGetFoodMenuCurrency);

    this.changeFoodMenuCurrency = function() {
      dataObject = {
          id: $window.sessionStorage['organizationId'],
          food_menu_currency: self.currency.id
      };

      responsePromise = $http.post(Global.updateFoodMenuCurrency, dataObject, {});
      responsePromise.success(function(dataFromServer, status, headers, config) {
          $location.path('/food-menu-currency');
          PopupMessage.showPopupMessage('Success', 'The food menu currency was changed with succes!');
      });
      responsePromise.error(function(data, status, headers, config) {
          console.log('error');
      });
    }

    GetAllCurrencies.get(this.callbackGetAllCurrencies);
  }]);

  app.controller('TodayFoodMenuController', ['$scope', '$http', '$window', '$routeParams', '$sce', '$location', 'GetFoodMenuCurrency', 'PopupMessage', 'Form', 'GrayBox', 'Auth', function($scope, $http, $window, $routeParams, $sce, $location, GetFoodMenuCurrency, PopupMessage, Form, GrayBox, Auth) {
    var todayFoodMenu = {},
        dataLength = null,
        menuList = null,
        menu = null,
        self = this,
        countMenu = 0;

    this.currencyHtml = null;

 	  this.getTodayFoodMenu = function() {
      $http.get(Global.getTodayFoodMenu)
           .success(function(data, status, headers, config) {
              menuList = new Array();
              dataLength = data.length;

              for (var i = 0; i < dataLength; i++) {
                menu = new Object();
                menu.id = data[i]['food_menus']['id'];
                menu.menu = data[i]['food_menus']['menu'];
                menu.price = data[i]['food_menus']['price'];
                menu.count = ++countMenu;
                menuList.push(menu);
              }
           })
           .error(function(data, status, headers, config) {
             console.log('error');
           });
   };

   this.getMenuList = function() {
     return menuList;
   };

   this.callbackGetFoodMenuCurrency = function() {
     self.currencyHtml = $sce.trustAsHtml(GetFoodMenuCurrency.getCurrency().html);
   };

   this.goEditFoodMenu = function(id) {
       $location.path('edit-food-menu/' + id);
   }

   this.goEditFoodMenu = function(id) {
       $location.path('edit-food-menu/' + id);
   }

   this.showDeleteFoodMenuPopup = function(foodMenuId, foodMenu) {
       PopupMessage.showDeletePopup(foodMenuId, 'Are you sure that you want to delete the menu ' + foodMenu + '?', 'delete-food-menu');
   }

   this.deleteFoodMenu = function(foodMenuId) {
       var dataObject = {
           id: ActionVariable.itemToBeDeleted
       }

       Form.sendDataToServer(Global.deleteFoodMenu, dataObject);
   }

   this.showGrayBox = GrayBox.show;
   this.isLoggedInAsOrganization = Auth.isLoggedInAsOrganization;

   GetFoodMenuCurrency.get(this.callbackGetFoodMenuCurrency);
 }]);
})();
