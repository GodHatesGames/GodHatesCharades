'use strict';
app.controller('blogView', function(posts, $scope, prismic) {
	$scope.blogPosts = posts.results;
	$scope.linkResolver = prismic.linkResolver;
});