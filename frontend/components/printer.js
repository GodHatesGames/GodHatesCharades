'use strict';
app.directive('printer', function(Suggestion, $compile, $window, prismic, Set, $timeout, SetItem) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		controller: function($scope, $element) {
			// public vars
			$scope.extraItems = [];
			$scope.rulesHtml = null;
			$scope.instructionsHtml = null;
			$scope.loadedSets = [];
			$scope.cardsBySet = {};
			var itemsPerPage = 9;

			prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PRINT_RULES)
			.then(function onRulesLoaded(rules) {
				var structuredText = rules.getStructuredText('doc.content');
				$scope.rulesHtml = structuredText.asHtml();
			});

			prismic.getDocumentById(CONFIG.PRISMIC.DOCS.PRINT_INSTRUCTIONS)
			.then(function onInstructionsLoaded(instructions) {
				var structuredText = instructions.getStructuredText('doc.content');
				$scope.instructionsHtml = structuredText.asHtml();
			});

			// Private methods
			function setupPrint(set) {
				$scope.setItems = sets.setItemsBySetId[set.id];
				if($scope.extraItems.length > 0)
					$scope.extraItems = [];
				var extraCount = itemsPerPage - ($scope.setItems.length % itemsPerPage);
				var newItem, itemType;
				for(var i = 0; i < extraCount; i++) {
					itemType = i % 2;
					newItem = Suggestion.getBlankCardByType(itemType);
					$scope.extraItems.push(newItem);
				}
			}

			function print() {
				// time to breathe
				$timeout($window.print, 300);
			}

			// Public Methods
			$scope.printBlack = function(set) {
				setupPrint(set);
				$element.addClass('colorless');
				print();
			};

			$scope.guestimatePages = function() {
				//start with 3 for instructions
				if($scope.setItems) {
					var guestimation = 3;
					guestimation += Math.ceil($scope.setItems.length / itemsPerPage);
					return guestimation;
				} else {
					return 0;
				}
			};

			$scope.getCardCount = function(set) {
				if(sets.setItemsBySetId[set.id])
					return sets.setItemsBySetId[set.id].length;
				else
					return 'loading';
			}

		}
	};
});