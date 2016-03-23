'use strict';

// app.directive('swFamilyForm', FamilyForm);
app.directive('swRelationSelector', RelationSelector);
app.directive('swHealthIcons', HealthIcons);

// app.directive('swFamilyTree', 'd3Service', FamilyTree);

function RelationSelector() {
  return {
    template: '<md-option ng-repeat="parent in family.relationsOptions" value="{{parent.abbrev}}">{{parent.abbrev}}</md-option>'
  };
}

function HealthIcons() {
  return {
    templateUrl: 'views/health-icons.html'

  };
}

// function FamilyTree(d3Service) {
//   return {
//     restrict: 'A',
//     template: '<div id="chart"></div>'
//     // scope: {},
//     // link: function(scope, element, attrs) {
//     //   d3Service.d3().then(function(d3) {
//     //     // d3 is the raw d3 object
//     //
//     //   });
//     // }
//   };
// }
