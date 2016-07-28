'use strict';
app.directive('downloader', function($filter) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/admin.downloader.html',
		replace: true,
		scope: {
			items: '=',
			filename: '@'
		},
		controller: function($scope) {
			// public vars
			$scope.csvHeaders = [
				'id',
				'text',
				'author',
				'spite',
				'scenario',
				'actor',
				'votes',
				'skips',
				'views',
				'kdr'
			];

			// generate all cards CSV
			$scope.csvName = [$scope.filename || 'Cards',
			                  '_',
			                  $filter('date')(new Date(), 'short'),
			                  '.csv'].join('');


			$scope.$watch('items', generateSetData);
			
			function generateSetData(newValue) {
				var allCsvData = [];
				var item;
				_.each(newValue, function(value, key) {
					// if it's a set item then use the card
					var suggestion = value.card ? value.card : value;
					var text = suggestion.text;
					// fix bad qoutes and escape them too
					text = text.replace(/[”“"’]/g, '\'');
					// remove line breaks and replace them with a space
					text = text.replace(/(\r\n|\n|\r)/gm,' ');
					item = {
						'id': suggestion.id,
						'text': text,
						'author': suggestion.owner.id,
						'spite': suggestion.spite ? true : false,
						'scenario': suggestion.type === 1 && !suggestion.spite,
						'actor': suggestion.type === 0,
						'votes': suggestion.votes,
						'skipped': suggestion.skips,
						'views': suggestion.views,
						'kdr': suggestion.kdr
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