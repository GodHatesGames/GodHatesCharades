'use strict';
app.directive('downloader', function(cardService, $compile) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/downloader.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			var csvData = [];
			var item;
			_.each($scope.suggestions, function(value, key) {
				item = {
					'text': value.attributes.text,
					'type': value.attributes.type,
					'totalVotes': value.attributes.totalVotes,
					'skipped': value.attributes.skipped,
					'rejected': value.attributes.rejected,
					'kdr': value.attributes.kdr,
					'moderated': value.attributes.moderated
				};
				csvData.push(item);
			});
			$scope.csvHeaders = [
				'text',
				'type',
				'totalVotes',
				'skipped',
				'rejected',
				'kdr',
				'moderated'
			];
			$scope.csvData = csvData;

			// Private methods

			// Public Methods

			// Watch
		}
	};
});