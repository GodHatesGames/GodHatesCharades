app.directive('codeHolder', function($compile) {
  return {
    restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
    templateUrl: 'components/codeHolder.html',
    replace: true,
    scope: {
      code: '='
    },
    controller: function($scope, $element) {
      $scope.$watch('code', _onCodeUpdated);
      function _onCodeUpdated(newCode) {
        if(newCode) {
          var holder = $element.html(newCode);
          $compile($element.contents())($scope);
          console.log(holder);
        }
      }
    }
  }
});