'use strict';

// app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', '$location', '$rootScope', '$mdDialog', '$mdBottomSheet','$mdToast', 'CheckSignedIn', AccountController]);
app.controller('ProfileCrtl', ['$routeParams', '$location', '$mdDialog', '$route', '$rootScope', 'ProfileService', 'CheckSignedIn', 'FamilyService', ProfileController]);
app.controller('FamilyCrtl', ['$routeParams', '$location', '$rootScope', '$mdToast', 'FamilyService', 'CheckSignedIn', 'FamilyTree', FamilyController]);
app.controller('SearchCtrl', ['$mdDialog', '$timeout', '$q', 'RelationEventsCategories', 'FamilyService', SearchCtrl])
app.controller('FooterCtrl', ['$timeout', '$mdBottomSheet', '$location', FooterCtrl])

// ---------- Account --------------

function AccountController(AuthService, $location, $rootScope, $mdDialog, $mdBottomSheet, $mdToast, CheckSignedIn) {
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
    $mdDialog.hide();
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
    $location.path('/family/' + id + '/profile/' + relation_id);
    $mdDialog.hide();
  };
  vm.newRelationEventLoad = function(relation_id) {
    $location.path('/family/' + id + '/events/' + relation_id);
    $mdDialog.hide();
  };


  function signup(user) {
    AuthService.signUp(user).then(function(res) {
      $location.path('/signin');
    });
  }
  // var signedInUser;
  function signin(user) {
    // console.log(user)
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
        $location.path('/dashboard/' + res.data.id);
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
  // --- Add Health Event Dialog ---
  vm.openAddEventDialog = function($event) {
    $mdDialog.show({
      controller: FamilyController,
      controllerAs: 'family',
      templateUrl: 'views/addEvent.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true
    });
  };
  vm.cancel = function($event) {
    $mdDialog.cancel();
  };
  // --- Edit Health Vitals Profile---
  vm.editHealthProfile = function($event) {
    $mdDialog.show({
      controller: ProfileController,
      controllerAs: 'profile',
      templateUrl: 'views/editProfile.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true
    });
  };

  // --- Edit Relations Profile---
  vm.editRelationProfile = function($event) {
    $mdDialog.show({
      controller: ProfileController,
      controllerAs: 'profile',
      templateUrl: 'views/editRelationProfile.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true
    });
  };

  //--- Bottom Sheet with Login info ---
  vm.showListBottomSheet = function() {
    // var vm = this;
    // vm.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'views/footer.html',
      controller: 'FooterCtrl',
      controllerAs: 'footer'
    });
    // .then(function(clickedItem) {
    //   vm.alert = clickedItem['name'] + ' clicked!';
    // });
  };
  // --Toast to let user know family member was added --
    // var vm = this;
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    vm.toastPosition = angular.extend({}, last);
    vm.getToastPosition = function() {
      sanitizePosition();
      return Object.keys(vm.toastPosition)
        .filter(function(pos) {
          return vm.toastPosition[pos];
        })
        .join(' ');
    };

    function sanitizePosition() {
      var current = vm.toastPosition;
      if (current.bottom && last.top) current.top = false;
      if (current.top && last.bottom) current.bottom = false;
      if (current.right && last.left) current.left = false;
      if (current.left && last.right) current.right = false;
      last = angular.extend({}, current);
    }
    vm.showEventAddToast = function(name) {
      var pinTo = vm.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
        .textContent(name + ' has been added')
        .position(pinTo)
        .hideDelay(3000)
      );
    };

}

// Bottom Sheet Footer
function FooterCtrl($timeout, $mdBottomSheet, $location) {
  var vm = this;
  vm.signInLoad = function() {
    $location.path('/signin');
    $mdBottomSheet.hide();
  };
}
// ---------- Profile --------------

function ProfileController($routeParams, $location, $mdDialog, $route, $rootScope, ProfileService, CheckSignedIn, FamilyService) {
  var vm = this;
  vm.title = 'Your health profile';
  vm.id = parseInt($routeParams.id);
  // var id = parseInt($routeParams.id);
  var id = localStorage.signedInUserID;
  var relation_id = parseInt($routeParams.relation_id);
  //User profile
  vm.submitProfile = submitProfile;
  vm.submitHeightWeight = submitHeightWeight;
  vm.addToEventsArray = addToEventsArray;
  vm.addToCategoriesArray = addToCategoriesArray;
  vm.filterTimeline = filterTimeline;
  vm.filterRelationsTimeline = filterRelationsTimeline;
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
    // console.log(obj.date);
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
    // console.log(user);
    ProfileService.submitProfile(id, user).then(function(res) {
      //TODO handle errors here
      // submitHeightWeight();
    });
  }

  function submitHeightWeight(ft, n, w) {
    var height = convertToInches(ft, n);
    var weight = parseInt(w);

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
      height: height + 0.00,
      weight: weight + 0.00,
      date: d.yyyymmdd()
    };
    ProfileService.submitHeightWeight(id, data).then(function(res, err) {
      $mdDialog.hide()
        //TODO is there a better solution to reload page so the db updates???
      $route.reload();
    });
  }

  function submitHealthEvents(arr) {
    ProfileService.submitHealthEvents(id, arr).then(function(res) {
      // console.log(res);
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

  function convertToFeet(n) {
    var decimal = n / 12;
    var feet = Math.floor(decimal);
    var inches = Math.round((decimal - feet) * 12);
    return [feet, inches];
  }

  ProfileService.getProfile(id).then(function(data) {
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
        vm.heightFeet = convertToFeet(vm.hwData.height)[0];
        vm.heightInches = convertToFeet(vm.hwData.height)[1];
      }
    }
  });

  var arr = [];
  if (!isNaN(id)) {
    vm.healthDataArray = [];
    ProfileService.getHealthEvents(id, arr).then(function(data) {
      var events = data.data;
      for (var i = 0; i < events.length; i++) {
        vm.healthDataArray.push(events[i]);
      }
    });
    ProfileService.getHealthCategories(id, arr).then(function(data) {
      // vm.healthCategoriesArray = data.data;
      var categories = data.data;
      for (var i = 0; i < categories.length; i++) {
        vm.healthDataArray.push(categories[i]);
      }
    });
  }

  function filterTimeline(min, max) {
    vm.healthDataArray = [];
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
    console.log(id);
    ProfileService.submitRelationProfile(id, user).then(function(res) {
      // console.log(res);
    });
  }

  //Only get relation profiles if relation_id exists and is NaN
  if (!isNaN(relation_id)) {
    var arr = [];
    // console.log(relation_id);
    //run profile code
    vm.relationHealthEventsArray = [];
    ProfileService.getRelationProfile(id, relation_id, arr).then(function(data) {
      // console.log(data.data);
      var events = data.data;
      for (var i = 0; i < events.length; i++) {
        vm.relationHealthEventsArray.push(events[i]);
      }
      ProfileService.getRelationCategories(id, relation_id, arr).then(function(data) {
        // console.log(data);
        var categories = data.data;
        for (var i = 0; i < categories.length; i++) {
          vm.relationHealthEventsArray.push(categories[i]);
        }
        ProfileService.getRelationship(id, relation_id).then(function(data) {
          // console.log(data.data[0]);
          vm.relationName = data.data[0].name;
          vm.relationship = data.data[0];

          ProfileService.getRelationHeightWeight(id, relation_id).then(function(data) {

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
                // console.log(recentRecord);
                vm.relationHWData = recentRecord;
                vm.relationFeet = convertToFeet(recentRecord.height)[0];
                vm.relationInches = convertToFeet(recentRecord.height)[1];
              }
            }
          });
        });
      });
    });
  }


  function updateRelationProfile(data) {
    // console.log(data);
    // vm.relationProfileData.name = data.name;
    ProfileService.updateRelationProfile(id, relation_id, data).then(function(res) {
      // console.log(res);

      //TODO is there a better solution to reload page so the db updates???
      $route.reload();
    });
  }

  function submitRelationHWProfile(data) {
    // console.log(data);
    var height = convertToInches(data.feet, data.inches);
    var d = new Date();
    var user = {
      id: id,
      relation_id: relation_id,
      height: height,
      weight: data.weight,
      date: d
    };
    ProfileService.submitRelationHWProfile(id, relation_id, user).then(function(res) {
      // console.log(res);
      $mdDialog.hide();
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

  // ---Filter Relations Timeline ---
  var array = [];

  function filterRelationsTimeline(min, max) {
    vm.relationHealthEventsArray = [];
    // console.log(min);
    //get profile of user
    FamilyService.getFamilyMember(id, relation_id).then(function(data) {
      // console.log(data);
      //get birth year from user's profile
      var year = parseDate(data.data[0].dob);
      // set input years for filter
      var start = parseInt(year) + parseInt(min);
      var end = parseInt(year) + parseInt(max);
      array.push(start, end);
      // console.log(year);
      console.log(array);
      ProfileService.getRelationCategories(id, relation_id, array).then(function(data) {
        var events = data.data;
        console.log(events);
        for (var i = 0; i < events.length; i++) {
          vm.relationHealthEventsArray.push(events[i]);
        }
        ProfileService.getRelationProfile(id, relation_id, array).then(function(data) {
          vm.healthCategoriesArray = data.data;
          var categories = data.data;
          for (var i = 0; i < categories.length; i++) {
            vm.relationHealthEventsArray.push(categories[i]);
          }
          array = [];
        });
      });
    });
  }

}









// ---------- Family --------------

function FamilyController($routeParams, $location, $rootScope, $mdToast, FamilyService, CheckSignedIn, FamilyTree) {
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

  var fullFamilyArray = [];
  //for addEventDialog
  vm.chooseFamilyMember = false;
  var names = [];
  var relationsObj = [];

  FamilyService.getImmediateFamily(id).then(function(data) {
    // console.log(id);
    console.log(data.data);
    if (data.data !== 'null') {
      console.log(data.data);
    }
    vm.familyArray = data.data;
    // console.log(data.data);
    fullFamilyArray.push(data.data);
    pushNames(data.data);

  }).then(function() {
    FamilyService.getMothersSide(id).then(function(data) {
      // console.log(data);
      vm.mothersSideArray = data.data;
      fullFamilyArray.push(data.data);
      pushNames(data.data);
    });
  }).then(function() {
    FamilyService.getFathersSide(id).then(function(data) {
      console.log(data);
      vm.fathersSideArray = data.data;
      fullFamilyArray.push(data.data);
      pushNames(data.data);
      //make array of strings into a string that is comma-separated
      var stringNames = stringify(names);
      vm.names = loadNames(stringNames);
    });

  });

  function pushNames(arr) {
    for (var i = 0; i < arr.length; i++) {
      var items = arr;
      if (names.indexOf(items[i].name) === -1) {
        // console.log(items[i].name);
        names.push(items[i].name);
        relationsObj.push(items[i]);
      }
    }
  }

  function loadNames(str) {
    return str.split(/, +/g).map(function(name) {
      var id;
      for (var i = 0; i < relationsObj.length; i++) {
        if (relationsObj[i].name === name) {
          id = relationsObj[i].id;
        }
      }
      return {
        name: name,
        id: id
      };
    });
  }

  vm.relationsOptions = ('mother father sister brother').split(' ').map(function(m) {
    return {
      abbrev: m
    };
  });

  // --Toast to let user know family member was added --
    var vm = this;
    var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    vm.toastPosition = angular.extend({}, last);
    vm.getToastPosition = function() {
      sanitizePosition();
      return Object.keys(vm.toastPosition)
        .filter(function(pos) {
          return vm.toastPosition[pos];
        })
        .join(' ');
    };

    function sanitizePosition() {
      var current = vm.toastPosition;
      if (current.bottom && last.top) current.top = false;
      if (current.top && last.bottom) current.bottom = false;
      if (current.right && last.left) current.left = false;
      if (current.left && last.right) current.right = false;
      last = angular.extend({}, current);
    }
    vm.showMemberAddToast = function(name) {
      var pinTo = vm.getToastPosition();
      $mdToast.show(
        $mdToast.simple()
        .textContent(name + ' has been to your family!')
        .position(pinTo)
        .hideDelay(3000)
      );
    };


}

// ---Search bar on family view page---
function SearchCtrl($mdDialog, $timeout, $q, RelationEventsCategories, FamilyService) {
  var vm = this;
  var id = localStorage.getItem('signedInUserID');

  var allNames = [];
  var allRelationsObj = [];
  RelationEventsCategories.getAllEventNames(id).then(function(data) {
    // console.log(data.data);
    //only add unique items to the array
    pushUniqueNames(data.data);
  }).then(function() {
    RelationEventsCategories.getAllCategoryNames(id).then(function(data) {
      //only add unique items to the array
      pushUniqueNames(data.data);
      // console.log(allNames);
      //make array of strings into a string that is comma-separated
      var stringNames = stringify(allNames);
      vm.names = loadAll(stringNames);
    });
  });

  function pushUniqueNames(arr) {
    for (var i = 0; i < arr.length; i++) {
      var items = arr;
      // console.log(arr);
      //TODO add error handling if user inserts a null value
      // if (items[i].name === 'undefined') {
      //   console.log(items[i]);
      // }
      if (allNames.indexOf(items[i].name) === -1) {
        allNames.push(items[i].name);
        allRelationsObj.push(items[i]);
      }
    }
  }

  // list of `name` value/display objects
  vm.querySearch = querySearch;
  // ******************************
  // Template methods
  // ******************************
  vm.cancel = function($event) {
    $mdDialog.cancel();
  };
  vm.find = function($event, term) {
    var filteredArray = [];
    vm.filteredArray = [];
    RelationEventsCategories.getRelationsByEvent(id, term).then(function(data) {
      filteredArray = data.data;
      //find family member with that issue
      findFamilyMember(filteredArray);
      RelationEventsCategories.getRelationsByCategory(id, term).then(function(data) {
        filteredArray = data.data;
        //find family member with that issue
        findFamilyMember(filteredArray);
      });
    });
  };

  function findFamilyMember(arr) {
    for (var j = 0; j < arr.length; j++) {
      FamilyService.getFamilyMember(id, arr[j].relation_id).then(function(data) {
        // console.log(data);
        vm.filteredArray.push(data.data[0]);
      });
    }
  }

  function querySearch(query) {
    return query ? vm.names.filter(createFilterFor(query)) : vm.names;
  }

  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(name) {
      return (name.value.indexOf(lowercaseQuery) === 0);
    };
  }



}

/**
 * Build `names` list of key/value pairs
 */
function loadAll(str) {
  return str.split(/, +/g).map(function(name) {
    // console.log(name);
    return {
      value: name.toLowerCase(),
      display: name
    };
  });
}
//change array to one big string
function stringify(array) {
  var string = '';
  for (var i = 0; i < array.length; i++) {
    string += (array[i] + ', ');
  }
  //remove last comma and space from the end
  return string.slice(0, -2);
}
