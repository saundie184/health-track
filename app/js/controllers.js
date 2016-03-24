'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', '$rootScope', '$mdDialog', 'CheckSignedIn', AccountController]);
app.controller('ProfileCrtl', ['$routeParams', '$location', '$mdDialog', '$route', '$rootScope', 'ProfileService', 'CheckSignedIn', ProfileController]);
app.controller('FamilyCrtl', ['$routeParams', '$location', '$rootScope', 'FamilyService', 'CheckSignedIn', 'FamilyTree', FamilyController]);

// ---------- Account --------------

function AccountController(AuthService, $location, $rootScope, $mdDialog, CheckSignedIn) {
  var vm = this;
  vm.signup = signup;
  vm.signin = signin;
  vm.signout = signout;
  vm.viewTree = false;

  vm.user_id = $rootScope.signedInUserID;
  CheckSignedIn.check();

  vm.signedInUser = localStorage.signedInUser;
  var id = localStorage.signedInUserID;

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
    // console.log(id);
    $location.path('/dashboard/' + id);
  };

  vm.profileLoad = function() {
    $location.path('/profile/' + id);
  };
  vm.newProfileLoad = function() {
    $location.path('/profile/new/' + id);
  };
  vm.familyTreeLoad = function() {
    // console.log(id);
    $location.path('/family/' + id);
    // $location.path('/family/' + id);
  };
  vm.newFamilyMemberLoad = function() {
    $location.path('/family/new/' + id);
  };
  vm.newRelationProfileLoad = function(relation_id) {
    // console.log('id is: ' +relation_id);
    $location.path('/family/' + id + '/profile/' + relation_id);
  };
  vm.newRelationEventLoad = function(relation_id) {
    $location.path('/family/' + id + '/events/' + relation_id);
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
        localStorage.signedInUserID = res.data.id;
        //set username for dashboard
        localStorage.signedInUser = res.data.email;
        //set token in localStorage
        localStorage.setItem('Authorization', 'Bearer ' + res.data.token);
        $location.path('/dashboard/' + id);
        $rootScope.isSignedIn = true;
      }
    });
  }

  function signout() {
    localStorage.removeItem('Authorization', null);
    $location.path('/');
    $rootScope.isSignedIn = false;
  }

  // --- Search Dialog ---
  // var self = this;
  vm.openDialog = function($event) {
    $mdDialog.show({
      controller: SearchCtrl,
      controllerAs: 'search',
      templateUrl: 'views/search.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true
    });
  };
}


// ---------- Profile --------------

function ProfileController($routeParams, $location, $mdDialog, $route, $rootScope, ProfileService, CheckSignedIn) {
  var vm = this;
  vm.title = 'Your health profile';
  vm.id = parseInt($routeParams.id);
  // var id = parseInt($routeParams.id);
  var id = localStorage.signedInUserID;
  var relation_id = parseInt($routeParams.relation_id);
  //User profile
  vm.submitProfile = submitProfile;
  vm.addToEventsArray = addToEventsArray;
  vm.addToCategoriesArray = addToCategoriesArray;
  vm.showTimeline = showTimeline;
  vm.filterTimeline = filterTimeline;
  //Relations profile
  vm.submitRelationProfile = submitRelationProfile;
  vm.updateRelationProfile = updateRelationProfile;
  vm.submitRelationHWProfile = submitRelationHWProfile;
  vm.submitRelationEvents = submitRelationEvents;
  vm.addToRelationsCategories = addToRelationsCategories;
  vm.addToRelationsEvents = addToRelationsEvents;
  //Verify that user is signed in
  CheckSignedIn.check();

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
    submitHealthEvents(newObj);
  }



  function addToCategoriesArray(obj) {
    console.log(obj.date);
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

  function showTimeline() {
    ProfileService.getHealthEvents(id, arr).then(function(data) {
      var events = data.data;
      // console.log(events);
      for (var i = 0; i < events.length; i++) {
        vm.healthDataArray.push(events[i]);
      }
    });

    ProfileService.getHealthCategories(id, arr).then(function(data) {
      vm.healthCategoriesArray = data.data;
      var categories = data.data;
      for (var i = 0; i < categories.length; i++) {
        vm.healthDataArray.push(categories[i]);
      }
    });
  }

  var arr = [];

  function filterTimeline(min, max) {
    vm.healthDataArray = [];
    // console.log(min);
    //get profile of user
    ProfileService.getProfile(id).then(function(data) {
      //get birth year from user's profile
      var year = parseDate(data.data[0].dob);
      // set input years for filter
      var start = parseInt(year) + parseInt(min);
      var end = parseInt(year) + parseInt(max);
      arr.push(start, end);
      // console.log(arr);
      ProfileService.getHealthEvents(id, arr).then(function(data) {
        var events = data.data;
        // console.log(events);
        for (var i = 0; i < events.length; i++) {
          vm.healthDataArray.push(events[i]);
        }
        ProfileService.getHealthCategories(id, arr).then(function(data) {
          vm.healthCategoriesArray = data.data;
          var categories = data.data;
          for (var i = 0; i < categories.length; i++) {
            vm.healthDataArray.push(categories[i]);
          }
          arr = [];
        });
      });
    });

  }

  function parseDate(str) {
    for (var i = 0; i < str.length; i++) {
      if (str[i] === '-') {
        var yr = str.substr(0, 4);
        return yr;
      }
    }
  }

  // ProfileService.getHealthEvents(id, arr).then(function(data) {
  //   var events = data.data;
  //   // console.log(events);
  //   for (var i = 0; i < events.length; i++) {
  //     vm.healthDataArray.push(events[i]);
  //   }
  // });
  //
  // ProfileService.getHealthCategories(id, arr).then(function(data) {
  //   vm.healthCategoriesArray = data.data;
  //   var categories = data.data;
  //   for (var i = 0; i < categories.length; i++) {
  //     vm.healthDataArray.push(categories[i]);
  //   }
  // });


  // ---Timeline buttons----
  vm.showDetailsToggle = function(details) {
    // console.log(details);
    $("#" + details.id).toggle("slow", function() {
      // Animation complete.
    });
  };

  function makeDatesArray(objArray) {
    var dates = [];
    for (var i = 0; i < objArray.length; i++) {
      dates.push(new Date(objArray[i].date));
    }
    return dates;
  }


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
    ProfileService.submitRelationProfile(id, user).then(function(res) {
      // console.log(res);
    });
  }

  //Only get relation profiles if relation_id exists and is NaN
  if (!isNaN(relation_id)) {
    //run profile code
    vm.relationHealthEventsArray = [];
    // console.log(id);
    // console.log(relation_id);
    ProfileService.getRelationProfile(id, relation_id).then(function(data) {
      var events = data.data;
      for (var i = 0; i < events.length; i++) {
        vm.relationHealthEventsArray.push(events[i]);
      }
      ProfileService.getRelationCategories(id, relation_id).then(function(data) {
        // console.log(data);
        var categories = data.data;
        for (var i = 0; i < categories.length; i++) {
          vm.relationHealthEventsArray.push(categories[i]);
        }
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
    });
  }
  // else {
  //   console.log('it is NaN');
  //   //skip it
  // }



  function updateRelationProfile(relation_id, data) {
    console.log(data);
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


  function addToRelationsEvents(obj) {
    // console.log(obj);
    var newObj = {
      // user_id: id,
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
    submitRelationEvents(newObj);
  }



  function addToRelationsCategories(obj) {
    // console.log(typeof obj.date);
    var newObj = {
      // user_id: id,
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
    submitRelationsCategories(newObj);
  }


  function submitRelationEvents(data) {
    ProfileService.submitRelationEvents(id, relation_id, data).then(function(res) {
      console.log(res);
      submitRelationsCategories();
    });
  }

  function submitRelationsCategories(data) {
    ProfileService.submitRelationsCategories(id, relation_id, data).then(function(res) {
      console.log(res);
    });
  }

}









// ---------- Family --------------

function FamilyController($routeParams, $location, $rootScope, FamilyService, CheckSignedIn, FamilyTree) {
  var vm = this;
  // var id = parseInt($routeParams.id);
  var id = localStorage.signedInUserID;

  vm.title = 'Your family';
  vm.submitMothersSide = submitMothersSide;
  vm.submitFathersSide = submitFathersSide;
  vm.submitYourFamily = submitYourFamily;
  // vm.updateRelationProfile = updateRelationProfile;

  CheckSignedIn.check();

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
  //
  // var testObj ={
  //   "name": "Clifford Shanks",
  //   "relationship": 1862,
  //   "parents": [{
  //     "name": "James Shanks",
  //     "relationship": 1831,
  //     "parents": [{
  //       "name": "Robert Shanks",
  //       "relationshipship": 1781
  //     }, {
  //       "name": "Elizabeth Shanks",
  //       "relationship": 1795
  //     }]
  //   }, {
  //     "name": "Ann Emily Brown",
  //     "relationship": 1826,
  //     "parents": [{
  //       "name": "Henry Brown",
  //       "relationship": 1792
  //     }, {
  //       "name": "Sarah Houchins",
  //       "relationship": 1793
  //     }]
  //   },
  // {
  //   "name": "Saundie",
  //   "relationship": 1999
  //   }]
  // };


  var fullFamilyArray = [];

  FamilyService.getImmediateFamily(id).then(function(data) {
    // console.log(data.data);
    vm.familyArray = data.data;
    fullFamilyArray.push(data.data);

  }).then(function() {
    FamilyService.getMothersSide(id).then(function(data) {
      // console.log(data);
      vm.mothersSideArray = data.data;
      fullFamilyArray.push(data.data);
    });
  }).then(function() {
    FamilyService.getFathersSide(id).then(function(data) {
        // console.log(data);
        vm.fathersSideArray = data.data;
        fullFamilyArray.push(data.data);
        // console.log(fullFamilyArray);
      })
      // })
      .then(function() {
        //TODO call service to get user_id name
        var user = "You";
        // console.log(fullFamilyArray);
        var newObj = FamilyTree.createFamilyObj(user, fullFamilyArray);
        // console.log(newObj);
        //TODO remove this if removing family tree
        // FamilyTree.draw(newObj);
      });
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

// ---Search bar on family view page---
function SearchCtrl($mdDialog, $timeout, $q, ProfileService) {
  var vm = this;
  var id = localStorage.getItem('signedInUserID');
  // list of `state` value/display objects
  vm.states = loadAll();
  vm.querySearch = querySearch;
  // ******************************
  // Template methods
  // ******************************
  vm.cancel = function($event) {
    $mdDialog.cancel();
  };
  vm.finish = function($event) {
    $mdDialog.hide();
  };
  // ******************************
  // Internal methods
  // ******************************
  /**
   * Search for states... use $timeout to simulate
   * remote dataservice call.
   */
  function querySearch(query) {
    return query ? vm.states.filter(createFilterFor(query)) : vm.states;
  }

  /**
   * Build `states` list of key/value pairs
   */
  function loadAll() {
  //TODO set up service to get names of health events and health categories  
    // ProfileService.getHealthEvents(id, arr).then(function(data){
    //   console.log(data);
    // });
    var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
    return allStates.split(/, +/g).map(function(state) {
      return {
        value: state.toLowerCase(),
        display: state
      };
    });
  }
  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }
}
