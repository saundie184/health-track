'use strict';

app.service('dbURL', [dbURL]);
app.service('AuthService', ['$http', 'dbURL', Auth]);
app.service('ProfileService', ['$http', 'dbURL', Profile]);
app.service('FamilyService', ['$http', 'dbURL', Family]);
app.service('AuthInterceptor', ['$window', '$location', '$q', AuthInterceptor]);
app.service('CheckSignedIn', ['$rootScope', CheckSignedIn]);
app.service('FamilyTree', [FamilyTree]);

function dbURL() {
  return {
    url: 'http://localhost:3000'
  };
}

// -----------Check if user is signed in------------
function CheckSignedIn($rootScope) {
  return {
    check: function() {
      //check localStorage for token
      var token = localStorage.getItem('Authorization');
      // console.log(localStorage);
      if (token) {
        //TODO add useremail to dashboard
        $rootScope.isSignedIn = true;
        return true;
      }
    }
  };
}

// --------------- Authorization -------------------

function AuthInterceptor($window, $location, $q) {
  return {
    request: function(config) {
      // prevent browser bar tampering for /api routes
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var token = localStorage.getItem("Authorization");
      // console.log(token);
      if (token)
        config.headers.Authorization = token;
      return $q.resolve(config);
    },
    responseError: function(err) {
      // if you mess around with the token, log them out and destroy it
      if (err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed") {
        $location.path("/signup");
        return $q.reject(err);
      }
      // if you try to access a user who is not yourself
      if (err.status === 401) {
        $location.path('/');
        return $q.reject(err);
      }
      return $q.reject(err);
    }
  };
}

function Auth($http, dbURL) {
  return {
    signUp: function(user) {
      console.log(user);
      return $http.post(dbURL.url + '/signup', user).then(function(res) {
        // res.send(res);
        console.log('Success!');
        return res;
      }, function(res) {
        // res.send(res);
        console.log('ERROR: ' + res);
        return res;
      });
    },
    signIn: function(user) {
      return $http.post(dbURL.url + '/signin', user).then(function(res) {
        //success logic goes here
        // console.log(res);
        return res;
      }, function(err) {
        //TODO failed authentication goes here
        console.log(err);
        return err;
      });

    }
  };
}

// --------------- Health Profiles -------------------

function Profile($http, dbURL) {
  return {
    getProfile: function(id) {
      return $http.get(dbURL.url + '/profile/' + id).then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log('You do not have access to this page');
        return err;
      });
    },
    getHeightWeight: function(id) {
      return $http.get(dbURL.url + '/profile/' + id + '/hw/').then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    getHealthEvents: function(id) {
      return $http.get(dbURL.url + '/profile/' + id + '/events/').then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    getHealthCategories: function(id) {
      return $http.get(dbURL.url + '/profile/' + id + '/categories/').then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    getRelationProfile: function(id, relation_id) {
      return $http.get(dbURL.url + '/family/' + id + '/profile/' + relation_id).then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log('User is not authorized.');
        return err;
      });
    },
    getRelationCategories: function(id, relation_id) {
      return $http.get(dbURL.url + '/family/' + id + '/categories/' + relation_id).then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log('User is not authorized.');
        return err;
      });
    },
    getRelationship: function(id, relation_id) {
      return $http.get(dbURL.url + '/family/' + id + '/relation/' + relation_id).then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    getRelationHeightWeight: function(id, relation_id) {
      return $http.get(dbURL.url + '/family/' + id + '/hw/' + relation_id).then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    updateRelationProfile: function(id, relation_id, data) {
      return $http.post(dbURL.url + '/family/' + id + '/edit/' + relation_id, data).then(function(res) {
        // console.log(data);
        return res;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    submitProfile: function(id, user) {
      // console.log(user);
      return $http.post(dbURL.url + '/profile/' + id, user).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitHeightWeight: function(id, user) {
      console.log(user);
      return $http.post(dbURL.url + '/profile/' + id + '/hw/', user).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitHealthEvents: function(id, user) {
      // console.log(user);
      return $http.post(dbURL.url + '/profile/' + id + '/events/', user).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitHealthCategories: function(id, user) {
      // console.log(user);
      return $http.post(dbURL.url + '/profile/' + id + '/categories/', user).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitRelationProfile: function(id, user) {
      // console.log(user);
      return $http.post(dbURL.url + '/family/' + id + '/events', user).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitRelationHWProfile: function(id, relation_id, data) {
      // console.log(data);
      return $http.post(dbURL.url + '/family/' + id + '/hw/' + relation_id, data).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitRelationEvents: function(id, relation_id, data) {
      // console.log(data);
      return $http.post(dbURL.url + '/family/' + id + '/events/' + relation_id, data).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    },
    submitRelationsCategories: function(id, relation_id, data) {
      // console.log(data);
      return $http.post(dbURL.url + '/family/' + id + '/categories/' + relation_id, data).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    }
  };
}


// --------------- Family Profiles -------------------
function Family($http, dbURL) {
  return {
    getImmediateFamily: function(id) {
      return $http.get(dbURL.url + '/family/' + id).then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    getMothersSide: function(id) {
      return $http.get(dbURL.url + '/family/' + id + '/mothers').then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    getFathersSide: function(id) {
      return $http.get(dbURL.url + '/family/' + id + '/fathers').then(function(data) {
        // console.log(data);
        return data;
      }, function(err) {
        //TODO failed authentication goes here
        // console.log(err);
        return err;
      });
    },
    // updateRelationProfile: function(id,relation_id, data){
    //   return $http.post(dbURL.url + '/family/' + id + '/edit/' + relation_id, data).then(function(data) {
    //     // console.log(data);
    //     return data;
    //   }, function(err) {
    //     //TODO failed authentication goes here
    //     console.log(err);
    //     return err;
    //   });
    // },
    submitFamilyMember: function(id, user) {
      return $http.post(dbURL.url + '/family/' + id, user).then(function(res) {
        // console.log(res);
        return res;
      }, function(err) {
        // console.log(err);
        return err;
      });
    }
  };
}

// ----------Family Tree------------

function FamilyTree() {
  return {
    draw: function() {
      var margin = {
          top: 0,
          right: 320,
          bottom: 0,
          left: 0
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      var tree = d3.layout.tree()
        .separation(function(a, b) {
          return a.parent === b.parent ? 1 : .5;
        })
        .children(function(d) {
          return d.parents;
        })
        .size([height, width]);
//TODO select element other than body to append to
      var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.json("tree.json", function(error, json) {
        if (error) throw error;

        var nodes = tree.nodes(json);

        var link = svg.selectAll(".link")
          .data(tree.links(nodes))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", elbow);

        var node = svg.selectAll(".node")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
          })

        node.append("text")
          .attr("class", "name")
          .attr("x", 8)
          .attr("y", -6)
          .text(function(d) {
            return d.name;
          });

        node.append("text")
          .attr("x", 8)
          .attr("y", 8)
          .attr("dy", ".71em")
          .attr("class", "about lifespan")
          .text(function(d) {
            return d.born + "–" + d.died;
          });

        node.append("text")
          .attr("x", 8)
          .attr("y", 8)
          .attr("dy", "1.86em")
          .attr("class", "about location")
          .text(function(d) {
            return d.location;
          });
      });

      function elbow(d, i) {
        return "M" + d.source.y + "," + d.source.x + "H" + d.target.y + "V" + d.target.x + (d.target.children ? "" : "h" + margin.right);
      }

    }
  };
}
