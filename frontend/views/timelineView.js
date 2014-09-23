'use strict';
app.controller('timelineView', function(timelineDoc) {
	var structuredText = timelineDoc.getStructuredText('doc.content');
	$scope.timelineHtml = structuredText.asHtml();
});