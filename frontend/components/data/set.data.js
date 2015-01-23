app.factory('Set', function (DS, $q, Suggestion, SetItem, ParseData) {
	// vars
	var definition = {
		name: 'set',
		defaultAdapter: 'setAdapter',
		methods: {
			// Instance methods
			addSetItems: _addSetItems,
			addSetItem: _addSetItem,
			removeSetItem: _removeSetItem,
			removeSetItems: _removeSetItems
		},
		computed: {
			suggestions: ['setItems', _updateSuggestions]
		}
	}

	// Adapter
	DS.adapters.setAdapter = {
		find: _find,
		findAll: _findAll,
		destroy: _destroy,
		create: _create
	};

	// Constants
	var RELATIONS = ['setItem'];

	// init
	var Set = DS.defineResource(definition);

	// Static Methods
	Set.getAllSetsAndItems = _getAllSetsAndItems;

	return Set;

	// methods

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
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getAllSets', {});
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
			var params = {
				setId: set.id
			};
			setItemPromises.push(SetItem.findAll(params));
		});
		return $q.all(setItemPromises);
	}

	function _addSetItems(setItems) {
		_.each(setItems, this.addSetItem);
	}

	function _addSetItem(setItem) {
		if(!this.setItems) {
			this.setItems = [setItem];
			this.suggestions = [setItem.card];
		} else {
			if(this.setItems.indexOf(setItem) === -1) {
				this.setItems.push(setItem);
			}
			if(this.suggestions.indexOf(setItem.card) === -1) {
				this.suggestions.push(setItem.card);
			}
		}
	}

	function _removeSetItems(setItems) {
		_.each(setItems, this.removeSetItems);
	}

	function _removeSetItem(setItem) {
		if(this.setItems) {
			var index = this.setItems.indexOf(setItem);
			if(index > -1) {
				this.setItems.splice(index, 1);
			}
			index = this.suggestions.indexOf(setItem.card);
			if(index > -1) {
				this.suggestions.splice(index, 1);
			}
		}
	}

	function _destroy(resource, id) {
		var set = Set.get(id);

		var itemPromises = [];
		_.each(set.setItems, function(setItem) {
			itemPromises.push(setItem.DSDestroy());
		});

		return $q.all(itemPromises)
		.then(function() {
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'destroySet', set);
		});
	}

	function _create(resource, setData) {
		return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'createSet', setData);
	}

});