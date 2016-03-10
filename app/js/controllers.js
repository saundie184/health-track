'use strict';

app.controller('MainController', ['$mdDialog', mainController]);
app.controller('AccountCtrl', [accountController]);

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

function accountController(){
  var vm = this;
  
}
