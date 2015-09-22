app.directive('cart', function(cartService, $timeout) {
  return {
    templateUrl: 'components/cart.html',
    replace: true,
    scope: {
      collection: '='
    },
    controller: function($scope, $element) {
      $scope.cartService = cartService;
      $scope.getProductLayer = _getProductLayer;
      $scope.getSway = _getSway;

      // default to true so we can hack/preload the cart image
      cartService.empty = !cartService.empty;
      $timeout(function() {
        cartService.empty = !cartService.empty;
      }, 50);

      function _getSway() {
        // HACK: returning no sway until i can fix the skull-fuck situation
        return '';

        if(cartService.items.length > 5) {
          //sway big
          collection: '='
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