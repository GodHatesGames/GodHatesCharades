'use strict';
app.controller('blogView', function(posts, $scope, prismic, $sce) {
	$scope.trust = $sce.trustAsHtml;
	$scope.blogPosts = posts.results;
	$scope.linkResolver = prismic.linkResolver;
});