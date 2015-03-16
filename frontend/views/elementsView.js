'use strict';
app.controller('elementsView', function($scope) {
  $scope.sections = [
    {
      title: 'Signup Section',
      code: '<signup-section location="homepage_signup_section" class="bg-dark"></signup-section>'
    }
  ];
});