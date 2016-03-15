'use strict';

app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', accountController]);
app.controller('DashboardCrtl', [DashboardController]);
app.controller('ProfileCrtl', [ProfileController]);

function mainController($mdDialog) {
  var vm = this;
  vm.title = "Hello World";
  vm.items = [1,2,3];

  // vm.signin = function() {
  //   $mdDialog.show($mdDialog.alert({
  //     title: 'Sign in',
  //     textContent: 'This is a dialog box',
  //     ok: 'Okay'
  //   }));
  // };
  vm.showSignin = showSignin;

  function showSignin($event) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      clickOutsideToClose: true,
      template: '<md-dialog aria-label="List dialog">' +
        '  <md-dialog-content>' +
        '<form name="signinForm">' +
        '<md-input-container class="md-block" flex-gt-sm>' +
          '<label>Email</label>' +
          '<input ng-model="email" value="email" name="email">' +
        '</md-input-container>' +
        '</form>' +
        '  </md-dialog-content>' +
        '  <md-dialog-actions>' +
        '    <md-button ng-click="closeDialog()" class="md-primary">' +
        '      Sign in' +
        '    </md-button>' +
        '  </md-dialog-actions>' +
        '</md-dialog>',
      locals: {
        items: vm.items
      },
      controller: DialogController
    });

    function DialogController($mdDialog, items) {
      var vm = this;
      vm.items = items;
      vm.closeDialog = function() {
        $mdDialog.hide();
      };
    }
  }
}










function accountController(AuthService) {
  var vm = this;
  // var testUser = {
  //   firstname: 'doug',
  //   lastname: 'jones',
  //   email: 'doug@email.com',
  //   password: 'password'
  // };
  vm.submit = submit;

  function submit(user) {
    AuthService.signUp(user);
  }
}

function ProfileController() {
  var vm = this;
  vm.title = 'Let\'s set up your health profile';
}

function DashboardController() {
  var vm = this;
  vm.title = 'Welcome to your Health Track Dashboard!';

}
