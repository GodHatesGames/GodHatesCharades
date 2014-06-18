'use strict';
app.directive('printer', function(cardService, $compile, $window, prismic) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.extraItems = [];
			$scope.rulesHtml = null;
			$scope.instructionsHtml = null;
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

			

			$scope.$watch('setItems', onSetItemsChanged);

			function onSetItemsChanged(newValue) {
				if($scope.extraItems.length > 0)
					$scope.extraItems = [];
				var extraCount = itemsPerPage - (newValue.length % itemsPerPage);
				var newItem, itemType;
				for(var i = 0; i < extraCount; i++) {
					itemType = i % 2;
					newItem = {
						type: itemType
					};
					$scope.extraItems.push(newItem);
				}
			}

			// Private methods
			function print() {
				$window.print();
			}

			// Public Methods
			$scope.printColor = function() {
				$element.removeClass('colorless');
				print();
			};

			$scope.printBlack = function() {
				$element.addClass('colorless');
				print();
			};

			$scope.guestimatePages = function() {
				//start with 3 for instructions
				var guestimation = 3;
				guestimation += Math.ceil($scope.setItems.length / itemsPerPage);
				return guestimation;
			};


			// Watch
		}
	};
});