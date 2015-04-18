app.controller('cardView', function(suggestion, $scope, $state, $location) {
	$scope.suggestion = suggestion;
	//set meta title
	$state.current.title = suggestion.text;

	// set meta description
	$state.current.description = ['"',
	                              suggestion.text,
	                              '" is a ',
	                              suggestion.typeDisplay,
	                              ' card submitted by ',
	                              suggestion.owner.name].join('');

	// DISQUS
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: suggestion.id,
		url: suggestion.url
	};
})