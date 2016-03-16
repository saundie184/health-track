'use strict';

app.config(function($routeProvider, $httpProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'AccountCtrl as account'
  })
  .when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'AccountCtrl as account'
  })
  .when('/signin', {
    templateUrl: 'views/signin.html',
    controller: 'AccountCtrl as account'
  })
  .when('/dashboard', {
    templateUrl: 'views/dashboard.html',
    controller: 'DashboardCrtl as dash'
  })
  .when('/profile/new', {
    templateUrl: 'views/newProfile.html',
    controller: 'ProfileCrtl as profile'
  })
  .when('/profile/:id', {
    templateUrl: 'views/viewProfile.html',
    controller: 'ProfileCrtl as profile'
  });
  $httpProvider.interceptors.push("AuthInterceptor");
});
