'use strict';
app.controller('elementsView', function($scope, $compile, $timeout) {
  $scope.backgroundColors = [
    'bg-light',
    'bg-dark',
    'bg-light-bright',
    'bg-dark-bright',
    'bg-heavens',
    'bg-vice'
  ];
  $scope.sections = [
    {
      id: 'signup-section',
      title: 'Signup Section',
      code: '<signup-section location="{{section.props.location.value}}" class="{{section.props.class.value}}"></signup-section>',
      formattedCode: '',
      lastUpdated: new Date(),
      props: {
        location: {
          value: 'signup-section',
          title: 'location',
          type: 'text',
          description: 'used in analytics to describe where in a given page the signup happened, unless there are multiple on the page use signup_section.'
        },
        class: {
          value: 'bg-light-bright',
          title: 'class',
          type: 'select',
          options: $scope.backgroundColors,
          description: 'standard html attribute, for this component use to add a background color. backgrounds listed on the <a ui-sref="admin.components">Components</a> page.'
        }
      }
    },
    {
      id: 'preorder-section',
      title: 'Preorder Section',
      code: '<preorder-section location="{{section.props.location.value}}" class="{{section.props.class.value}}"></preorder-section>',
      formattedCode: '',
      lastUpdated: new Date(),
      props: {
        location: {
          value: 'preorder-section',
          type: 'text',
          title: 'location',
          description: 'used in analytics to describe where in a given page the preorder happened, unless there are multiple on the page use preorder_section.'
        },
        class: {
          value: 'bg-light-bright',
          title: 'class',
          type: 'select',
          options: $scope.backgroundColors,
          description: 'standard html attribute, for this component use to add a background color. backgrounds listed on the <a ui-sref="admin.components">Components</a> page.'
        }
      }
    }
  ];
  $scope.formatCode = _formatCode;

  function _formatCode(section) {
    // var scope = $scope.$new(true);
    section.lastUpdated = new Date();
  }

});