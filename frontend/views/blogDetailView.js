'use strict';
app.controller('blogDetailView', function(post, $scope, $sce, $compile) {
	$scope.post = post;
	$scope.bodyHtml = post.getStructuredText('blog.body').asHtml();
});