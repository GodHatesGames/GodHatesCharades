app.directive('storeProduct', function($animate, cartService, StoreProduct) {
  return {
    templateUrl: 'components/storeProduct.html',
    replace: true,
    scope: {
      product: '=',
      cartKey: '@'
    },
    controller: function($scope, $element) {
      $scope.currentImage = $scope.product.images[0];
      $scope.selectImage = _selectImage;
      $scope.onIncrement = _onIncrement;
      $scope.onDecrement = _onDecrement;
      $scope.soldOut = _soldOut;
      $scope.productQuantity = _productQuantityGetterSetter;
      $scope.cart = cartService.getCart($scope.cartKey);

      function _soldOut() {
        if($scope.product.bundle) {
          var soldOutProducts = StoreProduct.filter({
            where: {
              'mainVariantBarcode': {
                in: $scope.product.bundle
              },
              soldOut: true
            }
          })
          if(soldOutProducts.length > 0) {
            return true;
          } else {
            return false;
          }
        } else if($scope.product.soldOut) {
          return true;
        } else {
          return false;
        }
      }

      function _selectImage (newImage) {
        $scope.currentImage = newImage;
      }

      function _productQuantityGetterSetter(newQuantity) {
        if(angular.isDefined(newQuantity)) {
          console.log('set quantity', newQuantity);
          $scope.cart.setQuantity(newQuantity, $scope.product);
        }

        return $scope.cart.getCountById($scope.product.mainVariantId);
      }

      function _onIncrement(event, product) {
        _animateButton(event.currentTarget);
        $scope.cart.increment(product);
      }

      function _onDecrement(event, product) {
        _animateButton(event.currentTarget);
        $scope.cart.decrement(product);
      }

      function _animateButton (button) {
        if(!button.classList.contains('click-satisfaction')) {
          $animate.addClass(button, 'click-satisfaction', function () {
              button.classList.remove('click-satisfaction');
          });
        }
      }
    }
  }
});