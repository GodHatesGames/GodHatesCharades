app.factory('Set', function (DS, $q, Suggestion, SetItem, ParseData) {
	// vars
	var definition = {
		name: 'set',
		defaultAdapter: 'setAdapter',
		relations: {
			hasMany: {
				setItem: {
					localField: 'setItems',
					foreignKey: 'ownerId'
				}
			}
		},
		beforeInject: ParseData.flattenAttrsBeforeInject,
		afterInject: _afterInject,
		methods: {
			// Instance methods
			addCard: _addCard,
			updateLinks: _updateLinks
		}
	}
	var setPromises = {};

	// Adapter
	DS.adapters.setAdapter = {
		find: _find,
		findAll: _findAll
	};

	// Constants
	var RELATIONS = ['setItem'];

	// init
	var Set = DS.defineResource(definition);

	// Static Methods
	Set.getAllSetsAndItems = _getAllSetsAndItems;

	return Set;

	// methods

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(Set, RELATIONS, this);
	}

	function _find(resource, id) {
		var cachedSet = Set.get(id);
		if(cachedSet)
			return $q.when(cachedSet);
		else{
			return _findAll()
			.then(function(allSets) {
				return Set.get(id);
			});
		}
	}

	function _findAll() {
		console.log('sets loadData');
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSets',
			{},
			{
				success: deferred.resolve,
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _getAllSetsAndItems() {
		return _findAll()
		.then(Set.inject)
		.then(_getAllSetItemsForSets);
	}

	function _getAllSetItemsForSets(allSets) {
		var setItemPromises = [];
		_.each(allSets, function(set) {
			setItemPromises.push(SetItem.getSetItemsForSet(set));
		});
		return $q.all(setItemPromises);
	}

	function _addCard(card) {
		var deferred = $q.defer();
		var set = this;
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'addCardToSet',
			{
				card: card.id,
				set: set.id
			},
			{
				success: function(setItem) {
					// update data
					SetItem.inject(setItem);
					set.updateLinks();
					card.updateLinks();
					deferred.resolve(setItem);
				},
				error: function(err) {
					deferred.reject(err);
				}
			}
		);
		return deferred.promise;
	}

});