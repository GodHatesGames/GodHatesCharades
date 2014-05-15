app.controller('cardView', function($scope, $state, $stateParams, $location, $window, cardService) {
	$scope.cardid = $stateParams.cardid;

	var card = cardService.getCard($scope.cardid)
	.then(function(card) {
		//set meta title
		$state.current.title = card.get('text');

		// set meta description
		$state.current.description = ['"',
		                              card.get('text'),
		                              '" is a ',
		                              cardService.getTypeDisplay(card),
		                              ' card submitted by ',
		                              card.get('owner').get('name')].join('');
	});

	// DISQUS
	/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
	var disqus_shortname = 'godhatescharades'; // required: replace example with your forum shortname
	var disqus_url = $location.absUrl();
	var disqus_identifier = $stateParams.cardid;
	// console.log('url:', disqus_url);

	/* * * DON'T EDIT BELOW THIS LINE * * */
	(function() {
		var dsq = document.createElement('script');
		dsq.type = 'text/javascript';
		dsq.async = true;
		dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
	/* END DISQUS */
})