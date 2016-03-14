'use strict';

app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['AuthService', accountController]);

function mainController($mdDialog) {
  var vm = this;
  vm.title = "Hello World";

  vm.release = function() {
    $mdDialog.show($mdDialog.alert({
      title: 'Test',
      textContent: 'This is a dialog box',
      ok: 'Okay'
    }));
  };
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
