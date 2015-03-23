'use strict';
app.controller('blogDetailView', function(post, $scope, $sce, $compile, $state, $location, $window) {
	$window.scrollTo(0, 0);
	$scope.post = post;

	// TODO: Make this part of the prismic data handler
	var structuredText = post.getStructuredText('blog.body');
	var htmlString = structuredText.asHtml();
	var bodyElement = angular.element(htmlString);
	_.each(bodyElement, function(child, index, list) {
		if(_.contains(child.classList, 'html')) {
			var childElement = angular.element(child);
			var htmlText = childElement.text();
			var htmlElement = angular.element(htmlText);
			// childElement.append(htmlElement);
			list.splice(index, 1, htmlElement[0]);
		}
	});
	var container = angular.element('<div>').append(bodyElement);
	$scope.bodyHtml = container.html();
	$scope.mainImage = post.getImageView('blog.image', 'main');
	$scope.mainEmbed = post.getHtml('blog.embed');
	$scope.mainYoutube = post.getText('blog.youtube');
	
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
		url: 'http://godhatescharades.com' + $location.url(),
		show: allowComments || true
	};

	$scope.backToBlog = function() {
		$state.go('blog');
		$window.scrollTo(0, 0);
	};
});