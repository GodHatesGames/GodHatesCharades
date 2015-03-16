app.directive('codeHolder', function($timeout) {
  return {
    restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
    templateUrl: 'components/codeHolder.html',
    replace: true,
    scope: {
      section: '='
    },
    controller: function($scope, $element) {
      $scope.$watch('section.id', _onIdUpdated);
      $scope.$watch('section.lastUpdated', _onCodeUpdated);
      function _onIdUpdated(newId) {
        $scope.id = newId + '_holder';
      }

      function _onCodeUpdated() {
        $scope.section.formattedCode = htmlEncode($scope.section.code);
        $timeout(function() {
          var parent = angular.element(document.getElementById($scope.id));
          $scope.section.htmlCode = parent.contents().contents().text();
        }, 100);
      }
    }
  }
});