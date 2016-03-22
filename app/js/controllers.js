'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', '$rootScope', AccountController]);
app.controller('ProfileCrtl', ['$routeParams', '$location', '$mdDialog', '$route', 'ProfileService', ProfileController]);
app.controller('FamilyCrtl', ['$routeParams', '$location', 'FamilyService', FamilyController]);

// ---------- Account --------------

function AccountController(AuthService, $location, $rootScope) {
  var vm = this;
  vm.signup = signup;
  vm.signin = signin;
  vm.signout = signout;

  vm.homePageLoad = function() {
    $location.path('/');
  };

  vm.signUpLoad = function() {
    $location.path('/signup');
  };
  vm.signInLoad = function() {
    $location.path('/signin');
  };
  vm.dashboardLoad = function() {
    $location.path('/dashboard');
  };

  vm.profileLoad = function() {
    $location.path('/profile/' + $rootScope.signedInUserID);
  };
  vm.newProfileLoad = function() {
    $location.path('/profile/new/' + $rootScope.signedInUserID);
  };
  vm.familyTreeLoad = function() {
    $location.path('/family/' + $rootScope.signedInUserID);
  };
  vm.newFamilyMemberLoad = function() {
    $location.path('/family/new/' + $rootScope.signedInUserID);
  };
  vm.newRelationProfileLoad = function(relation_id) {
    // console.log('id is: ' +relation_id);
    $location.path('/family/' + $rootScope.signedInUserID + '/profile/' + relation_id);
  };


  function signup(user) {
    AuthService.signUp(user).then(function(res) {
      $location.path('/signin');
    });
  }
  // var signedInUser;
  function signin(user) {
    AuthService.signIn(user).then(function(res) {
      // console.log(res);
      if (res.data === 'error') {
        // console.log('Wrong username and password.');
        vm.wrongPassword = 'Username and password do not match.';
      } else {
        //set signedInUserID
        $rootScope.signedInUserID = res.data.id;
        //set username for dashboard
        $rootScope.signedInUser = res.data.email;
        //set token in localStorage
        localStorage.setItem('Authorization', 'Bearer ' + res.data.token);
        $location.path('/dashboard');
        $rootScope.isSignedIn = true;
      }

    });
  }



  function signout() {
    localStorage.removeItem('Authorization', null);
    $location.path('/');
    $rootScope.isSignedIn = false;
  }
}


// ---------- Profile --------------

function ProfileController($routeParams, $location, $mdDialog, $route, ProfileService) {
  var vm = this;
  vm.title = 'Your health profile';
  vm.id = parseInt($routeParams.id);
  vm.submitProfile = submitProfile;
  vm.submitRelationProfile = submitRelationProfile;
  vm.updateRelationProfile = updateRelationProfile;
  vm.submitRelationHWProfile = submitRelationHWProfile;

  var id = parseInt($routeParams.id);
  var relation_id = parseInt($routeParams.relation_id);
  // var healthEventsArray = [];
  // var healthCategoriesArray = [];
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
      console.log(res);
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
    var objArray = data.data;
    var hw = data.data;
    for (var i = 0; i < hw.length; i++) {
      //TODO determine if I want hw in timeline
      // vm.healthDataArray.push(hw[i]);
    }
    var dates = makeDatesArray(objArray);
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

  vm.healthDataArray = [];
  // console.log(vm.healthDataArray);
  ProfileService.getHealthEvents(id).then(function(data) {
    var events = data.data;
    for (var i = 0; i < events.length; i++) {
      vm.healthDataArray.push(events[i]);
    }
  });

  ProfileService.getHealthCategories(id).then(function(data) {
    vm.healthCategoriesArray = data.data;
    var categories = data.data;
    for (var i = 0; i < categories.length; i++) {
      vm.healthDataArray.push(categories[i]);
    }
  });
  // ---Timeline buttons----
  // vm.showDetails = function(ev) {
  //   // Appending dialog to document.body to cover sidenav in docs app
  //   // Modal dialogs should fully cover application
  //   // to prevent interaction outside of dialog
  //   $mdDialog.show(
  //     $mdDialog.alert()
  //       .parent(angular.element(document.querySelector('#popupContainer')))
  //       .clickOutsideToClose(true)
  //       .title('This is an alert title')
  //       .textContent('You can specify some description text in here.')
  //       .ariaLabel('Alert Dialog Demo')
  //       .ok('Got it!')
  //       .targetEvent(ev)
  //   );
  // };
  vm.showDetailsToggle = function(details) {
    // vm.detailsObj = details;
    // var name = '<h3>' + details.name + '</h3>';
    // var des = '<p>' + details.description + '</p>';
    // var data = name + des;
    // var data = '<p>HEllo!!!</p>';
    // var dets = angular.element(document.getElementById(details.id));
    // $(dets).append(data);
    console.log(details);

    // $( '.md-icon-button' ).click(function() {
      $( "#"+ details.id ).toggle( "slow", function() {
        // Animation complete.
      });
    // });
  };

  function makeDatesArray(objArray) {
    var dates = [];
    for (var i = 0; i < objArray.length; i++) {
      dates.push(new Date(objArray[i].date));
    }
    return dates;
  }

  //TODO put these in a custom directive instead
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

  // ---Relations Profile--
  function submitRelationProfile() {
    var user = {
      relation_id: 54,
      name: 'chickenpox',
      type: 'illness',
      description: 'Chickenpox',
      date: '2000-04-01'
    };
    ProfileService.submitRelationProfile(id, user).then(function(res) {
      console.log(res);
    });
  }


  ProfileService.getRelationProfile(id, relation_id).then(function(data, err) {
    vm.relationProfileData = data.data;
    // console.log(data);
    ProfileService.getRelationship(id, relation_id).then(function(data) {
      // console.log(data.data[0]);
      vm.relationship = data.data[0];
      ProfileService.getRelationHeightWeight(id, relation_id).then(function(data) {
        // console.log(data.data);
        var objArray = data.data;
        // var hw = data.data;
        // for (var i = 0; i < hw.length; i++) {
        //   //TODO determine if I want hw in timeline
        //   // vm.healthDataArray.push(hw[i]);
        // }
        var dates = makeDatesArray(objArray);
        var maxDate = new Date(Math.max.apply(null, dates));

        //loop through array of objects to get most recent entry
        for (var j = 0; j < objArray.length; j++) {
          var date = Date.parse(new Date(objArray[j].date));
          var parsedMaxDate = Date.parse(maxDate);
          //find object where the value of key date is maxDate
          if (date === parsedMaxDate) {
            var recentRecord = objArray[j];
            vm.relationHWData = recentRecord;
          }
        }
      });
    });
  });


  function updateRelationProfile(relation_id, data) {
    // console.log(data.name);
    // vm.relationProfileData.name = data.name;
    ProfileService.updateRelationProfile(id, relation_id, data).then(function(res) {
      console.log(res);
      //TODO is there a better solution to reload page so the db updates???
      $route.reload();
    });
  }

  function submitRelationHWProfile(relation_id, data) {
    var height = convertToInches(data.feet, data.inches);
    var d = new Date();
    var user = {
      height: height,
      weight: data.weight,
      date: d
    };
    ProfileService.submitRelationHWProfile(id, relation_id, user).then(function(res) {
      console.log(res);
      //TODO is there a better solution to reload page so the db updates???
      $route.reload();
    });
  }



}









// ---------- Family --------------

function FamilyController($routeParams, $location, FamilyService) {
  var vm = this;
  var id = parseInt($routeParams.id);


  vm.title = 'Your family';
  vm.submitMothersSide = submitMothersSide;
  vm.submitFathersSide = submitFathersSide;
  vm.submitYourFamily = submitYourFamily;
  // vm.updateRelationProfile = updateRelationProfile;

  function submitYourFamily(data) {
    console.log(data);
    FamilyService.submitFamilyMember(id, data).then(function(data) {
      // console.log(data);
      vm.name = '';
      vm.relations = '';
      vm.dob = '';
      vm.dod = '';
    });
  }

  function submitMothersSide() {
    var data = {
      user_id: id,
      name: vm.mName,
      relationship: 'mothers ' + vm.mRelations,
      dob: vm.mDob,
      dod: vm.mDod
    };
    // console.log(data);
    FamilyService.submitFamilyMember(id, data).then(function(data) {
      // console.log(data);
      //reset form
      vm.mName = '';
      vm.mRelations = '';
      vm.mDob = '';
      vm.mDod = '';
    });
  }

  function submitFathersSide() {
    var data = {
      user_id: id,
      name: vm.fName,
      relationship: 'fathers ' + vm.fRelations,
      dob: vm.fDob,
      dod: vm.fDod
    };
    // console.log(data);
    FamilyService.submitFamilyMember(id, data).then(function(data) {
      // console.log(data);
      //reset form
      vm.fName = '';
      vm.fRelations = '';
      vm.fDob = '';
      vm.fDod = '';
    });
  }

  FamilyService.getImmediateFamily(id).then(function(data) {
    // console.log(data.data);
    vm.familyArray = data.data;
  });

  FamilyService.getMothersSide(id).then(function(data) {
    // console.log(data);
    vm.mothersSideArray = data.data;
  });

  FamilyService.getFathersSide(id).then(function(data) {
    // console.log(data);
    vm.fathersSideArray = data.data;
  });


  // function updateRelationProfile(relation_id, data) {
  //   console.log(data);
  //   vm.newName = data.name;
  //   FamilyService.updateRelationProfile(id, relation_id, data).then(function(res) {
  //     console.log(res);
  //   });
  // }

  vm.relationsOptions = ('mother father sister brother').split(' ').map(function(m) {
    return {
      abbrev: m
    };
  });
}
