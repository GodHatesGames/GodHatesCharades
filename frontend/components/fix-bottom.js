app.directive('fixBottom', ['$window', function ($window) {
  return {
    scope: {
      followPoint: '=followPoint'
    },
    link: function(scope, element, attrs) {
      element.addClass('fix-bottom');

      _setFollowCss();

      // angular.element($window).bind('scroll', _onScroll);

      // methods
      function _setFollowCss () {
        element.addClass('active');
      }

    }
  }
}]);