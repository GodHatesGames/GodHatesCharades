'use strict';
app.filter('property', function() {

	function parseString(input){
		return input.split('.');
	}

	function getValue(element, propertyArray){
		var value = element;

		_.forEach(propertyArray, function(property){
			value = value[property];
		});

		return value;
	}

	return function (array, propertyString, target){
		if(!target)
			return array;
		
		var properties = parseString(propertyString);
		var target = target.toLowerCase();

		return _.filter(array, function(item){
			return getValue(item, properties).toLowerCase().indexOf(target) > -1;
		});
	};
});