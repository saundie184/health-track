'use strict';

// app.directive('swFamilyForm', FamilyForm);
app.directive('swRelationSelector', RelationSelector);
app.directive('swHealthIcons', HealthIcons);

function RelationSelector(){
  return {
    template: '<md-option ng-repeat="parent in family.relationsOptions" value="{{parent.abbrev}}">{{parent.abbrev}}</md-option>'
  };
}

function HealthIcons(){
  return{
    templateUrl: 'views/health-icons.html'
  };
}
