'use strict';
app.controller('rulesView', function(rulesDoc, $scope, prismic, $window) {
	$window.scrollTo(0, 0);
	var structuredText = rulesDoc.getStructuredText('doc.content');
	$scope.rulesHtml = structuredText.asHtml();
});