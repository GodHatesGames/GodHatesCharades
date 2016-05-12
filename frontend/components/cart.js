app.directive('cart', function($rootScope, $timeout, $window, cartService) {
  return {
    templateUrl: 'components/cart.html',
    replace: true,
    scope: {
      collection: '=',
      key: '@',
      collapsed: '='
    },
    controller: function($scope, $element) {
      $scope.cart = cartService.getCart($scope.key);
      $scope.getProductLayer = _getProductLayer;
      $scope.getSway = _getSway;
      $scope.showCart = true;

      // default to true so we can hack/preload the cart image
      $scope.cart.empty = !$scope.cart.empty;
      $timeout(function() {
        $scope.cart.empty = !$scope.cart.empty;
      }, 50);

      // _checkCartVisibility()
      // angular.element($window).bind('scroll', _checkCartVisibility);

      function _getSway() {
        if($scope.cart.items.length > 5) {
          //sway big
          return 'sway-a-lot';
        } else {
          //no sway
          return '';
        }
      }

      function _getProductLayer(store, index) {
        return {
          'z-index': _.size(store) - index
        };
      }

      // function _checkCartVisibility() {
      //   var cartHeight = 300;
      //   var parentRect = $element.parent()[0].getBoundingClientRect();
      //   // var inView = this.pageYOffset >= (rect.top + 325);
      //   var inView = (parentRect.top - cartHeight) < 0 && (parentRect.top + parentRect.height - cartHeight) > 0;
      //   console.log(this.pageYOffset)
      //   console.log(parentRect)
      //   if (inView) {
      //     $scope.showCart = true;
      //   } else {
      //     $scope.showCart = false;
      //   }
      //   if(!$rootScope.$$phase) { $scope.$digest(); }
      // }
    }
  }
});