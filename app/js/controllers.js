'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', AccountController]);
app.controller('DashboardCrtl', [DashboardController]);
app.controller('ProfileCrtl', ['ProfileService', ProfileController]);

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

function ProfileController(ProfileService) {
  var vm = this;
  vm.title = 'Your health profile';
  vm.getprofile = getprofile;

  vm.gender = ('F M').split(' ').map(function(gen) {
       return {abbrev: gen};
     });

  function getprofile(id){
    ProfileService.getProfile(id).then(function(data){
      console.log(data);
    });
  }
}

function DashboardController() {
  var vm = this;
  vm.title = 'Welcome username!';

}
