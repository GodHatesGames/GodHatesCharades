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

			function _selectImage (newImage) {
				$scope.currentImage = newImage;
			}
		}
	}
});