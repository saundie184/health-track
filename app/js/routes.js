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
  .when('/signout', {
    templateUrl: 'views/main.html',
    controller: 'AccountCtrl as account'
  })
  .when('/dashboard', {
    templateUrl: 'views/dashboard.html',
    controller: 'DashboardCrtl as dash'
  })
  .when('/profile/new/:id', {
    templateUrl: 'views/newProfile.html',
    controller: 'ProfileCrtl as profile'
  })
  .when('/profile/:id', {
    templateUrl: 'views/viewProfile.html',
    controller: 'ProfileCrtl as profile'
  })
  .when('/family/new/:id', {
    templateUrl: 'views/newFamily.html',
    controller: 'FamilyCrtl as family'
  })
  .when('/family/:id', {
    templateUrl: 'views/viewFamily.html',
    controller: 'FamilyCrtl as family'
  })
  .otherwise({
    redirectTo: '/'
  });
  $httpProvider.interceptors.push("AuthInterceptor");
});
