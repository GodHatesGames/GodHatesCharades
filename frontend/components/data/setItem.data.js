app.factory('SetItem', function (DS, $q, Suggestion, ParseData) {
	// vars
	var definition = {
		name: 'setItem',
		defaultAdapter: 'setItemAdapter',
		relations: {
			belongsTo: {
				set: {
					localField: 'owner',
					localKey: 'ownerId'
				},
				suggestion: {
					localField: 'card',
					localKey: 'cardId'
				}
			}
		},
		beforeInject: _beforeInject,
		afterInject: _afterInject,
		computed: {
			ownerId: ['owner', _updateOwnerId],
			cardId: ['card', _updateCardId]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks
		}
	}

	// Adapter
	DS.adapters.setItemAdapter = {
		destroy: _destroy
	};

	// constants
	var RELATIONS = ['set', 'suggestion'];

	// init
	var SetItem = DS.defineResource(definition);

	// Static Methods
	SetItem.getSetItemsForSet = _getSetItemsForSet;
	SetItem.getSetItemsForSuggestion = _getSetItemsForSuggestion;

	return SetItem;

	// methods

	function _beforeInject(resourceName, parseObject, cb){
		if(parseObject.attributes) {
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject, cb);
		} else {
			console.log('injecting non-server set item');
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(SetItem, RELATIONS, this);
		SetItem.linkInverse(this.id);
	}

	function _updateOwnerId(owner) {
		return this.owner.id;
	}

	function _updateCardId(card) {
		return this.card.id;
	}

	function _getSetItemsForSet(set) {
		console.log('setItem getSetItemsForSet');
		var deferred = $q.defer();
		// save promise if needed
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getCardsForSet',
			{
				id: set.id,
				includeOwner: true
			},
			{
				success: function(setItems) {
					ParseData.safeInject('setItem', setItems)
					.then(deferred.resolve);
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _getSetItemsForSuggestion(suggestion) {
		console.log('setItem getSetItemsForSet');
		var deferred = $q.defer();
		// save promise if needed
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getCardsForSuggestion',
			{
				id: suggestion.id,
				includeOwner: true
			},
			{
				success: function(setItems) {
					setItems = SetItem.inject(setItems);
					suggestion.setItems = setItems;
					deferred.resolve(setItems);
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _destroy(resource, id) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'removeSetItem',
			{
				id: id
			},
			{
				success: function() {
					SetItem.eject(id);
					deferred.resolve();
				},
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

});