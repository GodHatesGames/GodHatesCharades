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
			var allCsvData = [];
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
				allCsvData.push(item);
			});
			$scope.allCsvData = allCsvData;


			$scope.$watch('setItems', generateSetData);
			
			function generateSetData() {
				// generate set cards CSV
				var setCsvData = [];
				var item;
				_.each($scope.setItems, function(value, key) {
					var card = value.get('card');
					var text = card.get('text');
					// fix bad qoutes and escape them too
					text = text.replace(/[”“"’]/g, '\'');
					item = {
						'text': text,
						'type': card.attributes.type,
						'totalVotes': card.attributes.totalVotes,
						'skipped': card.attributes.skipped,
						'rejected': card.attributes.rejected,
						'kdr': card.attributes.kdr,
						'moderated': card.attributes.moderated
					};
					setCsvData.push(item);
				});
				$scope.setCsvData = setCsvData;
			}

			// Private methods

			// Public Methods

			// Watch
		}
	};
});