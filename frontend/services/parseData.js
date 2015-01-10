app.factory('ParseData', function () {
	var parseData = {
		flattenAttrsBeforeInject: _flattenAttrsBeforeInject,
		linkRelationsAfterInject: _linkRelationsAfterInject,
		defaultValueHandler: _defaultValueHandler
	};

	return parseData;

	function _flattenAttrsBeforeInject(resourceName, parseObject, cb){
		_.extend(parseObject, parseObject.attributes);
		delete parseObject.attributes;
	}

	function _linkRelationsAfterInject(constructor, relations, parseObject) {
		constructor.link(parseObject.id, relations);
	}

	function _defaultValueHandler(defaultValue) {
		return function _defaultFunc(newValue) {
			return newValue || defaultValue;
		}
	}
});