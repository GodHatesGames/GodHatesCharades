'use strict';
app.controller('blogDetailView', function(post, $scope, $sce, $compile, $state, $location) {
	$scope.post = post;

	var structuredText = post.getStructuredText('blog.body');
	$scope.bodyHtml = structuredText.asHtml();
	
	//set meta title
	$state.current.title = structuredText.getTitle().text;

	// set meta description
	var shortlede = post.getText('blog.shortlede');
	if (shortlede)
		$state.current.description = shortlede;

	var allowComments = post.get('blog.allow_comments');
	$scope.disqus = {
		shortname: 'godhatescharades',
		id: post.id,
		url: $location.absUrl(),
		show: allowComments
	};
});