'use strict';
app.controller('rulesView', function($scope, prismic) {
	prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PAGE_RULES)
	.then(function onRulesLoaded(rules) {
		var structuredText = rules.getStructuredText('doc.content');
		$scope.rulesHtml = structuredText.asHtml();
	});
});