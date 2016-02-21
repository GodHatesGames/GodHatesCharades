app.directive('storeProduct', function($animate, cartService) {
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
      $scope.productQuantity = _productQuantityGetterSetter;
      $scope.cart = cartService.getCart($scope.cartKey);

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