'use strict';
app.service('sets', function($q, $rootScope) {
	// console.log('instantiate sets');
	var sets = {
		data: [],
		getAllSets: getAllSets,
		getSet: getSet,
		byId: {},
		setItemsById: {},
		deleteSet: deleteSet,
		createSet: createSet,
		getSetItemsForSet: getSetItemsForSet,
		addCardToSet: addCardToSet,
		removeSetItem: removeSetItem
	};

	function getAllSets(scope) {
		console.log('sets loadData');
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSets',
			{},
			{
				success: function(setData) {
					// save data
					sets.data = setData;
					//index by id
					sets.byId = _.indexBy(setData, 'id');
					// resolve deffered
					deferred.resolve(setData);
					// digest if scope is passed in
					if(scope) {
						scope.$digest();
					} else {
						$rootScope.$digest();
					}
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

	function getSet(id) {
		var cachedSet = sets.byId[id];
		if(cachedSet) {
			return $q.when(cachedSet);
		} else {
			var deferred = $q.defer();
			getAllSets()
			.then(function(allSets) {
				var theSet = sets.byId[id];
				if(theSet) {
					deferred.resolve(theSet);
				} else {
					deferred.reject({
						message: 'set not found'
					});
				}
			})
			return deferred.promise;
		}
	}

	function deleteSet(set) {
		var deferred = $q.defer();
		
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'destroySet',
			{
				id: set.id
			},
			{
				success: function(result) {
					// save data
					var oldSet = _.findWhere(sets.data, {id: set.id});
					var index = sets.data.indexOf(oldSet);
					sets.data.splice(index, 1);
					delete sets.byId[set.id];
					deferred.resolve(result);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);

		return deferred.promise;
	}

	function createSet(setData) {
		var deferred = $q.defer();
		
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'createSet',
			setData,
			{
				success: _onSetCreated,
				error: _onCreateError
			}
		);

		function _onSetCreated(newSet) {
			sets.data.push(newSet);
			sets.byId[newSet.id] = newSet;
			deferred.resolve(newSet);
		}

		function _onCreateError(err) {
			deferred.reject(err);
		}

		return deferred.promise;
	}

	var gettingSetItemsPromises = {};
	function getSetItemsForSet(set) {
		console.log('sets getSetItemsForSet');
		if (gettingSetItemsPromises[set.id]) {
			// return promise so we dont make the call twice
			return gettingSetItemsPromises[set.id];
		} else {
			var deferred = $q.defer();
			// save promise if needed
			gettingSetItemsPromises[set.id] = deferred.promise;
			Parse.Cloud.run(
				CONFIG.PARSE_VERSION + 'getCardsForSet',
				{
					id: set.id,
					includeOwner: true
				},
				{
					success: function(setItems) {
						delete gettingSetItemsPromises[set.id];
						sets.setItemsById[set.id] = setItems;
						deferred.resolve(setItems);
					},
					error: function(err) {
						delete gettingSetItemsPromises[set.id];
						deferred.reject(err);
						// if (scope)
						// 	scope.$digest();
					}
				}
			);
			return deferred.promise;
		}
	}

	function addCardToSet(card, set) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'addCardToSet',
			{
				card: card.id,
				set: set.id
			},
			{
				success: function(setItem) {
					// update data

					// sets.data = setItem;
					//index by id
					// sets.byId[setItem.id] = setItem;
					// resolve deffered
					deferred.resolve(setItem);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	function removeSetItem(setItem) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'removeSetItem',
			{
				id: setItem.id
			},
			{
				success: function(success) {
					deferred.resolve(success);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	return sets;
});