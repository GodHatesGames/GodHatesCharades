'use strict';
app.service('sets', function($q, $rootScope) {
	// console.log('instantiate sets');
	var sets = {
		data: [],
		getAllSets: getAllSets,
		getAllSetsAndItems: getAllSetsAndItems,
		getSet: getSet,
		byId: {},
		setItemsBySetId: {},
		setIdsByCardId: {},
		deleteSet: deleteSet,
		createSet: createSet,
		getSetItemsForSet: getSetItemsForSet,
		addCardToSet: addCardToSet,
		removeSetItem: removeSetItem,
		removeCardFromSet: removeCardFromSet
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

	function getAllSetsAndItems(scope) {
		return getAllSets().then(_getAllSetItemsForSets);

		function _getAllSetItemsForSets(allSets) {
			var setItemPromises = [];
			_.each(sets.byId, function(set) {
				setItemPromises.push(getSetItemsForSet(set));
			});
			return $q.all(setItemPromises)
			.then(function() {
				return sets.setIdsByCardId;
			});
		}
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
						_.each(setItems, cacheSetItem);
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

	function cacheSetItem(setItem) {
		var setId = setItem.get('owner').id;
		var cardId = setItem.get('card').id;
		// index sets by Card Id
		if(!sets.setIdsByCardId[cardId]) {
			sets.setIdsByCardId[cardId] = [];
		}
		if(sets.setIdsByCardId[cardId].indexOf(setId) === -1) {
			sets.setIdsByCardId[cardId].push(setId);
		}
		// index setItem by Card Id
		if(!sets.setItemsBySetId[cardId]) {
			sets.setItemsBySetId[cardId] = {};
		}
		sets.setItemsBySetId[cardId][setId] = setItem;
	}

	function removeSetItemCache(setItem) {
		var cardId = setItem.get('card').id;
		var setId = setItem.get('owner').id;
		delete sets.setItemsBySetId[cardId][setId];

		var setList = sets.setIdsByCardId[cardId];
		var index = setList.indexOf(setId);
		if(index !== -1) {
			setList.splice(index, 1);
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
					cacheSetItem(setItem);
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
					// cleanup indexes
					removeSetItemCache(setItem);
					deferred.resolve(success);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

	function removeCardFromSet(card, set) {
		var setItem = sets.setItemsBySetId[card.id][set.id];
		return removeSetItem(setItem);
	}

	return sets;
});