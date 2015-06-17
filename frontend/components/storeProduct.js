app.directive('storeProduct', function() {
  return {
    templateUrl: 'components/storeProduct.html',
    replace: true,
    scope: {
      storeItem: '=',
      increment: '=',
      decrement: '=',
      setQuantity: '=',
      quantity: '@'
    },
    controller: function($scope, $element) {
      $scope.product = $scope.storeItem.product;
      $scope.currentImage = $scope.product.images[0];
      $scope.selectImage = _selectImage;
      $scope.productQuantity = _productQuantityGetterSetter;

      function _selectImage (newImage) {
        $scope.currentImage = newImage;
      }

      function _productQuantityGetterSetter(newQuantity) {
        if(angular.isDefined(newQuantity) && $scope.setQuantity) {
          console.log('set quantity', newQuantity);
          $scope.setQuantity(newQuantity, $scope.product);
        }

        return $scope.quantity;
      }
    }
  }
});