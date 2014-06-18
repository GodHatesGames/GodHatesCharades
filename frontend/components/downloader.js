'use strict';
app.directive('downloader', function(cardService) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/downloader.html',
		replace: true,
		scope: {
			items: '=items'
		},
		controller: function($scope) {
			// public vars
			$scope.cardService = cardService;
			$scope.csvHeaders = [
				'text',
				'type',
				'totalVotes',
				'skipped',
				'rejected',
				'kdr',
				'moderated'
			];

			// generate all cards CSV


			$scope.$watch('items', generateSetData);
			
			function generateSetData(newValue) {
				var allCsvData = [];
				var item;
				_.each(newValue, function(value, key) {
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
					allCsvData.push(item);
				});
				$scope.allCsvData = allCsvData;
			}

			// Private methods

			// Public Methods

			// Watch
		}
	};
});