'use strict';
app.controller('timelineView', function(timelineDoc, $scope) {
	var structuredText = timelineDoc.getStructuredText('doc.content');
	$scope.timelineHtml = structuredText.asHtml();
});