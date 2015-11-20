app.directive('feedbackIcon', function() {
  return {
    restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
    templateUrl: 'components/admin.feedbackIcon.html',
    replace: true,
    scope: {
      saving: '='
    },
    controller: function($scope, $element) {
      $scope.feedbackClass = function() {
        return $scope.saving ? 'glyphicon-refresh custom-spin' : 'glyphicon-floppy-disk';
      };

    }
  }
});