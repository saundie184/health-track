'use strict';

app.service('dbURL', [dbURL]);
app.service('signUpService', ['$http', signUp]);

function dbURL() {
  return {
    url: 'http://localhost:3000'
  };
}

function signUp($http, dbURL) {
  return {
    signUp: function(user) {
console.log(user);
      $http.post(dbURL + '/signUp', user).then(function(res) {
        res.send(res);
        console.log('Success!');
      }, function(res) {
        res.send(res);
        console.log('ERROR');
      });
    }
  };
}
