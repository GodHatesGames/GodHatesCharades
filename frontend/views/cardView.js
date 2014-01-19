app.controller('cardView', function(bitly, $scope, $stateParams, $location, $window) {
	$scope.cardid = $stateParams.cardid;
	$scope.bitly = bitly;

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

	/* ADD THIS */
	$window.addthis_share = {
		url: bitly,
		title: 'Help me support my charity:'
	};

	jQuery('body').append($('<script>var addthis_config = {"data_track_addressbar":true};</script><script src="http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-527852867cd289ce"></script>'));
	/* END ADD THIS */
})