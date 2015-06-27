app.directive('storeProduct', function($animate, cartService) {
  return {
    templateUrl: 'components/storeProduct.html',
    replace: true,
    scope: {
      storeItem: '='
    },
    controller: function($scope, $element) {
      $scope.product = $scope.storeItem.product;
      $scope.currentImage = $scope.product.images[0];
      $scope.selectImage = _selectImage;
      $scope.onIncrement = _onIncrement;
      $scope.onDecrement = _onDecrement;
      $scope.productQuantity = _productQuantityGetterSetter;

      function _selectImage (newImage) {
        $scope.currentImage = newImage;
      }

      function _productQuantityGetterSetter(newQuantity) {
        if(angular.isDefined(newQuantity)) {
          console.log('set quantity', newQuantity);
          cartService.setQuantity(newQuantity, $scope.product);
        }

        return cartService.getCountById($scope.product.mainVariantId);
      }

      function _onIncrement(event, product) {
        _animateButton(event.currentTarget);
        cartService.increment(product);
      }

      function _onDecrement(event, product) {
        _animateButton(event.currentTarget);
        cartService.decrement(product);
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