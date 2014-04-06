'use strict';
app.directive('printer', function(cardService, $compile, $window) {
	return {
		restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
		templateUrl: 'components/printer.html',
		replace: true,
		scope: true,
		controller: function($scope, $element) {
			// public vars
			$scope.cardService = cardService;
			$scope.extraItems = [];
			var itemsPerPage = 9;

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
				//start with 2 for instructions
				var guestimation = 2;
				guestimation += Math.ceil($scope.setItems.length / itemsPerPage);
				return guestimation;
			};


			// Watch
		}
	};
});