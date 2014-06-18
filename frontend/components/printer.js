'use strict';
app.directive('printer', function(cardService, $compile, $window, prismic, sets, $timeout) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.extraItems = [];
			$scope.rulesHtml = null;
			$scope.instructionsHtml = null;
			$scope.loadedSets = [];
			$scope.cardsBySet = {};
			var itemsPerPage = 9;

			_.each(sets.data, function loadSet(set, index) {
				sets.getSetItemsForSet(set)
				.then(function(setItems) {
					$scope.loadedSets.push(set);
					var attributes = _.pluck(setItems, 'attributes'); 
					var cards = _.pluck(attributes, 'card');
					$scope.cardsBySet[set.id] = cards;
				})
			});

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
				$scope.setItems = sets.setItemsById[set.id];
				if($scope.extraItems.length > 0)
					$scope.extraItems = [];
				var extraCount = itemsPerPage - ($scope.setItems.length % itemsPerPage);
				var newItem, itemType;
				for(var i = 0; i < extraCount; i++) {
					itemType = i % 2;
					newItem = {
						type: itemType
					};
					$scope.extraItems.push(newItem);
				}
			}

			function print() {
				// time to breathe
				$timeout($window.print, 100);
			}

			// Public Methods
			$scope.printColor = function(set) {
				setupPrint(set);
				$element.removeClass('colorless');
				print();
			};

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
				if(sets.setItemsById[set.id])
					return sets.setItemsById[set.id].length;
				else
					return 'loading';
			}

		}
	};
});