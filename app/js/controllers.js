'use strict';

app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', ['signUpService', accountController]);

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

function accountController(signUpService){
  var vm = this;
  var testUser = {
    firstname: 'sally',
    lastname: 'smith',
    email: 'sally@email.com',
    password: 'password7'
  };
vm.submit = signUpService.signUp(testUser);
}
