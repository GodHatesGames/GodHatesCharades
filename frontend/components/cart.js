app.directive('cart', function($timeout, cartService) {
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

      // default to true so we can hack/preload the cart image
      $scope.cart.empty = !$scope.cart.empty;
      $timeout(function() {
        $scope.cart.empty = !$scope.cart.empty;
      }, 50);

      function _getSway() {
        // HACK: returning no sway until i can fix the skull-fuck situation
        return '';

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
    }
  }
});