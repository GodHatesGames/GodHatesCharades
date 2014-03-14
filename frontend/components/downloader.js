'use strict';
app.directive('downloader', function(cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/downloader.html',
		replace: true,
		scope: true,
		controller: function($scope) {
			// public vars
			$scope.cardService = cardService;
			var csvData = [];
			var item;
			_.each($scope.allSuggestions, function(value, key) {
				var text = value.attributes.text;
				// fix bad qoutes and escape them too
				text = text.replace(/[”“"’]/g, '\'');
				item = {
					'text': text,
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