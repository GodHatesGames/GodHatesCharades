'use strict';
app.controller('elementsView', function($scope, $compile, $timeout) {
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
          description: 'used in analytics to describe where in a given page the signup happened, unless there are multiple on the page use signup_section.'
        },
        class: {
          value: 'bg-dark',
          title: 'class',
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
          title: 'location',
          description: 'used in analytics to describe where in a given page the preorder happened, unless there are multiple on the page use preorder_section.'
        },
        class: {
          value: 'bg-light-bright',
          title: 'class',
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