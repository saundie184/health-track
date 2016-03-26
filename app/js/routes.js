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
    controller: 'ProfileCrtl as profile'
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

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('cyan',  {
      'default': '500', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '800', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': '900' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('red', {
      'default': '600'
    });
});
