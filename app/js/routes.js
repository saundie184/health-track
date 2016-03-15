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
  })
  .when('/dashboard', {
    templateUrl: 'views/dashboard.html',
    controller: 'DashboardCrtl as dash'
  })
  .when('/profile/:id', {
    templateUrl: 'views/newProfile.html',
    controller: 'ProfileCrtl as profile'
  });
});
