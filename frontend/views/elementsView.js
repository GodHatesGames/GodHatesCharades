'use strict';
app.controller('elementsView', function($scope) {
  $scope.sections = [
    {
      title: 'Signup Section',
      code: '<signup-section location="signup_section" class="bg-dark"></signup-section>',
      props: [
        {
          title: 'location',
          description: 'used in analytics to describe where in a given page the signup happened, unless there are multiple on the page use signup_section.'
        },
        {
          title: 'class',
          description: 'standard html attribute, for this component use to add a background color. backgrounds listed on the <a ui-sref="admin.components">Components</a> page.'
        }
      ]
    }
  ];
});