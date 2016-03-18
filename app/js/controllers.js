'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', '$rootScope', AccountController]);
app.controller('DashboardCrtl', ['$location', '$routeParams', DashboardController]);
app.controller('ProfileCrtl', ['$routeParams', '$location', 'ProfileService', ProfileController]);
app.controller('FamilyCrtl', ['$routeParams', '$location', 'FamilyService', FamilyController]);

// ---------- Account --------------

function AccountController(AuthService, $location, $rootScope) {
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
  vm.dashboardLoad = function() {
    $location.path('/dashboard');
    // console.log(vm.isSignedIn);
  };


  function signup(user) {
    AuthService.signUp(user).then(function(res) {
      $location.path('/signin');
    });
  }

  function signin(user) {
    AuthService.signIn(user).then(function(res) {
      //set username for dashboard
      $rootScope.signedInUser = res.data.email;
      //set token in localStorage
      localStorage.setItem('Authorization', 'Bearer ' + res.data.token);
      $location.path('/dashboard');
      $rootScope.isSignedIn = true;
    });
  }

  function signout() {
    localStorage.removeItem('Authorization', null);
    $location.path('/');
    $rootScope.isSignedIn = false;
  }
}

// ---------- Dashboard --------------

function DashboardController($location, $routeParams) {
  var vm = this;
  vm.title = 'Welcome username!';
  // var id = parseInt($routeParams.id);
  //TODO get user id from JWT?????

  vm.newProfileLoad = function() {
    var id = 56;
    $location.path('/profile/new/' + id);
  };
  vm.profileLoad = function() {
    var id = 56;
    $location.path('/profile/' + id);
  };
  vm.familyTreeLoad = function() {
    var id = 56;
    $location.path('/family/' + id);
  };
  vm.newFamilyMemberLoad = function() {
    var id = 56;
    $location.path('/family/new/' + id);
  };


}

// ---------- Profile --------------

function ProfileController($routeParams, $location, ProfileService) {
  var vm = this;
  vm.title = 'Your health profile';
  vm.id = parseInt($routeParams.id);
  vm.submitProfile = submitProfile;

  var id = parseInt($routeParams.id);
  var healthEventsArray = [];
  var healthCategoriesArray = [];
  vm.addToEventsArray = addToEventsArray;
  vm.addToCategoriesArray = addToCategoriesArray;


  function addToEventsArray(obj) {
    // console.log(obj);
    var newObj = {
      user_id: id,
      type: obj.type,
      name: obj.name,
      description: obj.description,
      date: obj.date
    };
    // healthEventsArray.push(newObj);
    //reset form
    var master = {
      name: ''
    };
    vm.temp = angular.copy(master);
    // vm.temp.$setPristine();
    // console.log(newObj);
    submitHealthEvents(newObj);
  }



  function addToCategoriesArray(obj) {
    // console.log(typeof obj.date);
    var newObj = {
      user_id: id,
      type: obj.type,
      name: obj.name,
      description: obj.description,
      date: obj.date
    };
    // healthCategoriesArray.push(newObj);
    //reset form
    var master = {
      name: ''
    };
    vm.temp = angular.copy(master);
    submitHealthCategories(newObj);

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

    Date.prototype.yyyymmdd = function() {
      var yyyy = this.getFullYear().toString();
      var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = this.getDate().toString();
      return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
    };

    var d = new Date();
    d.yyyymmdd();

    var data = {
      user_id: id,
      height: height,
      weight: weight,
      date: d.yyyymmdd()
    };
    ProfileService.submitHeightWeight(id, data).then(function(res, err) {
      //TODO add pop to let user know about filling in below info
    });
  }

  function submitHealthEvents(arr) {
    ProfileService.submitHealthEvents(id, arr).then(function(res) {
      console.log(res);
    });
  }

  function submitHealthCategories(arr) {
    ProfileService.submitHealthCategories(id, arr).then(function(res) {
      // $location.path('/dashboard');
      // console.log(res);
    });
  }

  function convertToInches(ft, n) {
    var total = (ft * 12);
    return total + parseInt(n);
  }

  ProfileService.getProfile(id).then(function(data) {
    // console.log(data.data[0]);
    vm.profileData = data.data[0];
  });

  ProfileService.getHeightWeight(id).then(function(data) {
    //TODO return most recent height and date
    var objArray = data.data;
    var dates = [];
    for (var i = 0; i < objArray.length; i++) {
      dates.push(new Date(objArray[i].date));
    }
    var maxDate = new Date(Math.max.apply(null, dates));

    //loop through array of objects to get most recent entry
    for (var j = 0; j < objArray.length; j++) {
      var date = Date.parse(new Date(objArray[j].date));
      var parsedMaxDate = Date.parse(maxDate);
      //find object where the value of key date is maxDate
      if (date === parsedMaxDate) {
        var recentRecord = objArray[j];
        vm.hwData = recentRecord;
      }
    }
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

// ---------- Family --------------

function FamilyController($routeParams, $location, FamilyService) {
  var vm = this;
  var id = parseInt($routeParams.id);

  vm.title = 'Your family';
  vm.submitMothersSide = submitMothersSide;
  vm.submitFathersSide = submitFathersSide;

  function submitMothersSide() {
    var data = {
      user_id: id,
      name: vm.mName,
      relationship: 'mothers ' + vm.relations
    };
    // console.log(data);
    FamilyService.submitFamilyMember(id, data).then(function(data) {
      // console.log(data);
    });
  }

  function submitFathersSide() {
    var data = {
      user_id: id,
      name: vm.fName,
      relationship: 'fathers ' + vm.relations
    };
    // console.log(data);
    FamilyService.submitFamilyMember(id, data).then(function(data) {
      // console.log(data);
    });
  }


  FamilyService.getMothersSide(id).then(function(data) {
    // console.log(data);
    vm.mothersSideArray = data.data;
  });

  FamilyService.getFathersSide(id).then(function(data) {
    console.log(data);
    vm.fathersSideArray = data.data;
  });

  vm.relationsOptions = ('mother father sister brother').split(' ').map(function(m) {
    return {
      abbrev: m
    };
  });

}
