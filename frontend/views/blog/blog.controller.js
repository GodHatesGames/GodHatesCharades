'use strict';
app.controller('blogView', function(posts, $scope, prismic, $sce, $filter, $window) {
	$window.scrollTo(0, 0);
	$scope.trust = $sce.trustAsHtml;
	//reorder posts
	$scope.blogPosts = $filter('orderBy')(posts.results, getPostDate, true);
	$scope.linkResolver = prismic.linkResolver;

	function getPostDate(post) {
		var date = post.getDate('blog.date');
		if (date) {
			return date.getTime();
		} else {
			return 0;
		}
	}
});