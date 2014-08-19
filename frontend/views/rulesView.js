'use strict';
app.controller('rulesView', function($scope, prismic, $window) {
	$window.scrollTo(0, 0);
	prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_RULES)
	.then(function onRulesLoaded(rules) {
		var structuredText = rules.getStructuredText('doc.content');
		$scope.rulesHtml = structuredText.asHtml();
	});
});