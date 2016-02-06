app.controller('productView', function(collection, product, $scope, $state, $location) {
  $scope.collection = collection;
	$scope.product = product;
	//set meta title
	$state.current.title = product.title;

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: product.id,
		url: $location.absUrl()
	};
})