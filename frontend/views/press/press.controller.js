'use strict';
app.controller('pressView', function(pressDoc, $scope, prismic, $window) {
	$window.scrollTo(0, 0);
	var structuredText = pressDoc.getStructuredText('doc.content');
	$scope.pressHtml = structuredText.asHtml();
});