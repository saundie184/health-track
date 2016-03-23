'use strict';

// app.directive('swFamilyForm', FamilyForm);
app.directive('swRelationSelector', RelationSelector);
app.directive('swHealthIcons', HealthIcons);

// app.directive('swFamilyTree','FamilyTree', FamilyTreeFunc);

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
//
// function FamilyTreeFunc(FamilyTree) {
//   var link = function ($scope, $el, $attrs){
// console.log($el);
//   };
//   return {
//     restrict: 'E',
//     replace: true,
//     template: '<div id="chart"></div>',
//     link: link
//   };
// }
