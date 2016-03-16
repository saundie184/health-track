'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', AccountController]);
app.controller('DashboardCrtl', ['$location', DashboardController]);
app.controller('ProfileCrtl', ['$routeParams', '$location', 'ProfileService', ProfileController]);

// function mainController($mdDialog) {
//   var vm = this;
//   vm.title = "Hello World";
//
//   // vm.signin = function() {
//   //   $mdDialog.show($mdDialog.alert({
//   //     title: 'Sign in',
//   //     textContent: 'This is a dialog box',
//   //     ok: 'Okay'
//   //   }));
//   // };
//
// }

function AccountController(AuthService, $location) {
  var vm = this;
  vm.signup = signup;
  vm.signin = signin;
  vm.signout = signout;


  function signup(user) {
    AuthService.signUp(user).then(function(res) {
      $location.path('/signin');
    });
  }

  function signin(user) {
    AuthService.signIn(user).then(function(res) {
      // console.log(res);
      localStorage.setItem('Authorization', 'Bearer ' + res.data.token);
      // console.log(localStorage.Authorization);
      vm.signedIn = true;
      $location.path('/dashboard');

    });
  }

  function signout() {
    localStorage.removeItem('Authorization', null);
    $location.path('/');
    vm.signedIn = false;
  }
}

function ProfileController($routeParams, $location, ProfileService) {
  var vm = this;
  vm.title = 'Your health profile';
  vm.id = parseInt($routeParams.id);
  vm.submitProfile = submitProfile;
  // vm.submitHeightWeight = submitHeightWeight;


  function submitProfile(user) {
    ProfileService.submitProfile(id,user).then(function(res) {
      console.log(res);
      var data = {
       user_id : id,
       height: 65,
       weight: 200
     };
      ProfileService.submitHeightWeight(id,data).then(function(res) {
        console.log(res);
        $location.path('/dashboard');
      });
      // $location.path('/dashboard');
    });
  }


  var id = parseInt($routeParams.id);
  ProfileService.getProfile(id).then(function(data) {
    // console.log(data);
    vm.profileData = data;
  });
  vm.dob = new Date();
  vm.gender = ('F M').split(' ').map(function(gen) {
    return {
      abbrev: gen
    };
  });
  vm.blood = ('O+ O- A+ A- B+ B- AB+ AB-').split(' ').map(function(type) {
    return {
      abbrev: type
    };
  });
  vm.foot = ('7 6 5 4 3 2 1 0').split(' ').map(function(ft) {
    return {
      abbrev: ft
    };
  });
  vm.inch = ('0 1 2 3 4 5 6 7 8 9 10 11 12').split(' ').map(function(n) {
    return {
      abbrev: n
    };
  });

}

function DashboardController($location) {
  var vm = this;
  vm.title = 'Welcome username!';

  vm.newProfileLoad = function() {
    // console.log(id);
    var id = '56';
    $location.path('/profile/new/' + id);
  };
  vm.profileLoad = function() {
    // console.log(id);
    var id = '56';
    $location.path('/profile/' + id);
  };


}
