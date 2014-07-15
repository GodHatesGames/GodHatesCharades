'use strict';
app.service('getAllSuggestions', function($q, cardService) {
	var getAllSuggestions = {
		data: {},
		reload: loadData
	};

	function loadData(scope) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSuggestions',
			{},
			{
				success: function(suggestions) {
					cardService.cache(suggestions);
					_.extend(getAllSuggestions.data, suggestions);
					deferred.resolve(getAllSuggestions);
					// if (scope)
					// 	scope.$digest();
				},
				error: function(err) {
					deferred.reject(err);
					// if (scope)
					// 	scope.$digest();
				}
			}
		);
		return deferred.promise;
	}

	return loadData();
});
