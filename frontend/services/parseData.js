app.factory('ParseData', function () {
	var parseData = {
		flattenAttrsBeforeInject: _flattenAttrsBeforeInject,
		linkRelationsAfterInject: _linkRelationsAfterInject
	};

	return parseData;

	function _flattenAttrsBeforeInject(resourceName, parseObject, cb){
		_.extend(parseObject, parseObject.attributes);
		delete parseObject.attributes;
	}

	function _linkRelationsAfterInject(constructor, relations, parseObject) {
		constructor.link(parseObject.id, relations);
		constructor.linkInverse(parseObject.id);
	}
});