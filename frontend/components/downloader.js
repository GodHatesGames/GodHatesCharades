'use strict';
app.directive('downloader', function($filter) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/downloader.html',
		replace: true,
		scope: {
			items: '=',
			filename: '@'
		},
		controller: function($scope) {
			// public vars
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
			$scope.csvName = [$scope.filename || 'Cards',
			                  '_',
			                  $filter('date')(new Date(), 'short'),
			                  '.csv'].join('');


			$scope.$watch('items', generateSetData);
			
			function generateSetData(newValue) {
				var allCsvData = [];
				var item;
				_.each(newValue, function(value, key) {
					var text = value.text;
					// fix bad qoutes and escape them too
					text = text.replace(/[”“"’]/g, '\'');
					// remove line breaks and replace them with a space
					text = text.replace(/(\r\n|\n|\r)/gm,' ');
					item = {
						'text': text,
						'type': value.type,
						'totalVotes': value.totalVotes,
						'skipped': value.skipped,
						'rejected': value.rejected,
						'kdr': value.kdr,
						'moderated': value.moderated
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