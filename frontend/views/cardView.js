app.controller('cardView', function(suggestion, $scope, $state, $location, cardService) {
	$scope.suggestion = suggestion;
	//set meta title
	$state.current.title = suggestion.get('text');

	// set meta description
	$state.current.description = ['"',
	                              suggestion.get('text'),
	                              '" is a ',
	                              suggestion.getTypeDisplay(),
	                              ' card submitted by ',
	                              suggestion.get('owner').get('name')].join('');

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: suggestion.id,
		url: 'http://godhatescharades.com' + $location.url()
	};
})