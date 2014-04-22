'use strict';
app.controller('blogDetailView', function(post, $scope, $sce) {
	$scope.trust = $sce.trustAsHtml;
	$scope.body = post.getStructuredText('blog.body');
});