'use strict';

app.service('dbURL', [dbURL]);
app.service('AuthService', ['$http', 'dbURL', Auth]);

function dbURL() {
  return {
    url: 'http://localhost:3000'
  };
}

function Auth($http, dbURL) {
  return {
    signUp: function(user) {
      console.log(user);
      $http.post(dbURL.url + '/signup', user).then(function(res) {
        // res.send(res);
        console.log('Success!');
      }, function(res) {
        // res.send(res);
        console.log('ERROR: ' + res);
      });
    },
    signIn: function(user) {

    }
  };
}
