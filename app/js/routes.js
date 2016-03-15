'use strict';

app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainController as main'
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'AccountCtrl as account'
  });
});
