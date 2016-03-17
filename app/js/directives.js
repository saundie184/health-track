'use strict';

// app.directive('swFamilyForm', FamilyForm);
app.directive('swRelationSelector', RelationSelector);

// function FamilyForm(){
//   return {
//     templateUrl: 'views/family-form.html'
//   };
// }

function RelationSelector(){
  return {
    template: '<md-option ng-repeat="parent in family.relationsOptions" value="{{parent.abbrev}}">{{parent.abbrev}}</md-option>'
  };
}
