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
		},
		computed: {
			suggestions: ['setItems', _updateSuggestions]
		}
	}

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

	function _updateSuggestions(setItems, that) {
		if(setItems)
			return _.pluck(setItems, 'card');
	}

	function _find(resource, id) {
		var cachedSet = Set.get(id);
		if(cachedSet)
			return $q.when(cachedSet);
		else{
			return Set.findAll()
			.then(function(allSets) {
				return Set.get(id);
			});
		}
	}

	function _findAll() {
		var cached = Set.getAll();
		if(!_.isEmpty(cached)) {
			return $q.when(cached);
		} else {
			console.log('sets loadData');
			var deferred = $q.defer();
			Parse.Cloud.run(
				CONFIG.PARSE_VERSION + 'getAllSets',
				{},
				{
					success: function(sets) {
						deferred.resolve(sets);
					},
					error: deferred.reject
				}
			);
			return deferred.promise;
		}
	}

	function _getAllSetsAndItems() {
		var sets;
		return Set.findAll()
		.then(function(allSets) {
			// save sets
			sets = allSets;
			return sets;
		})
		.then(_getAllSetItemsForSets)
		.then(function() {
			return sets;
		});
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