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
  .when('/dashboard/:id', {
    templateUrl: 'views/dashboard.html',
    controller: 'AccountCtrl as account'
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
  .when('/family/:id/profile/:relation_id', {
    templateUrl: 'views/viewRelationProfile.html',
    controller: 'ProfileCrtl as profile'
  })
  .when('/family/:id/events/:relation_id', {
    templateUrl: 'views/newRelationHealthEvents.html',
    controller: 'ProfileCrtl as profile'
  });
  // .otherwise({
  //   redirectTo: '/'
  // });
  $httpProvider.interceptors.push("AuthInterceptor");
});
