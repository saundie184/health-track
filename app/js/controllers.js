'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', AccountController]);
app.controller('DashboardCrtl', ['$location', DashboardController]);
app.controller('ProfileCrtl', ['$routeParams', '$location', 'ProfileService', ProfileController]);

function AccountController(AuthService, $location) {
  var vm = this;
  vm.signup = signup;
  vm.signin = signin;
  vm.signout = signout;
  vm.signUpLoad = function() {
    $location.path('/signup');
  };
  vm.signInLoad = function() {
    $location.path('/signin');
  };


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
  var id = parseInt($routeParams.id);


  var healthEventsArray = [];
  vm.addToEventsArray = addToEventsArray;

  function addToEventsArray(obj) {
    // console.log(obj);
    var newObj = {
      user_id: id,
      type: obj.type,
      name: obj.name,
      description: obj.description,
      date: obj.date
    };
    healthEventsArray.push(newObj);
  }

  var healthCategoriesArray = [];
  vm.addToCategoriesArray = addToCategoriesArray;

  function addToCategoriesArray(obj) {
    console.log(typeof obj.date);
    var newObj = {
      user_id: id,
      type: obj.type,
      name: obj.name,
      description: obj.description,
      date: obj.date
    };
    healthCategoriesArray.push(newObj);
  }


  function submitProfile(user) {
    ProfileService.submitProfile(id, user).then(function(res) {
      //TODO handle errors here
      // console.log(vm.dob);
      submitHeightWeight();
    });
  }

  function submitHeightWeight() {
    var height = convertToInches(vm.feet, vm.inches);
    var weight = vm.weight;
    //TODO Date is not inserting in db even though the type is the same
    // var utc = new Date();
    // console.log(utc);
    Date.prototype.yyyymmdd = function() {
      var yyyy = this.getFullYear().toString();
      var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = this.getDate().toString();
      return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + " 00:00:00-06"; // padding
    };

    var d = new Date();
    d.yyyymmdd();
    // console.log(d.yyyymmdd());
    var data = {
      user_id: id,
      height: height,
      weight: weight,
      date: d.yyyymmdd()
    };
    ProfileService.submitHeightWeight(id, data).then(function(res, err) {
      //call next function
      submitHealthEvents(healthEventsArray);
    });
  }

  function submitHealthEvents(arr) {
    ProfileService.submitHealthEvents(id, arr).then(function(res) {
      //call next function
      submitHealthCategories(healthCategoriesArray);
      // console.log(res);
    });
  }

  function submitHealthCategories(arr) {
    ProfileService.submitHealthCategories(id, arr).then(function(res) {
      $location.path('/dashboard');
      // console.log(res);
    });
  }

  function convertToInches(ft, n) {
    var total = (ft * 12);
    return total + parseInt(n);
  }

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
