app.factory('Suggestion', function (DS, $q, Slug, $urlMatcherFactory, $state, $filter, ParseData) {
	// vars
	var definition = {
		name: 'suggestion',
		defaultAdapter: 'suggestionAdapter',
		relations: {
		},
		computed: {
			ownerId: ['owner', _updateOwnerId],
			votes: ['totalVotes', ParseData.defaultValueHandler(0)],
			skips: ['skipped', ParseData.defaultValueHandler(0)],
			views: ['votes', 'skips', _updateViews],
			slug: ['text', _updateSlug],
			link: ['slug', 'id', _updateLink],
			kdr: ['votes', 'skips', _updateKdr],
			typeClass: ['type', _updateTypeClass],
			typeDisplay: ['type', _updateTypeDisplay],
			url: ['url', _updateUrl],
			imageUrl: ['type', _updateImageUrl]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks,
			linkSetItems: _linkSetItems
		},
		beforeInject: _beforeInject
	}

	// Adapter
	DS.adapters.suggestionAdapter = {
		find: _find
	};

	// Constants
	var TYPE_DISPLAY_CHARACTER = 'Actor';
	var TYPE_DISPLAY_SCENARIO = 'Scenario';
	var TYPE_CLASS_CHARACTER = 'character';
	var TYPE_CLASS_SCENARIO = 'scenario';
	var RELATIONS = ['user'];
	var INJECT_OPTIONS = {
	};

	var Suggestion = DS.defineResource(definition);
	// Static Methods
	Suggestion.getBlankCardByType = _getBlankCardByType;
	Suggestion.getTypeDisplayByType = _getTypeDisplayByType;
	Suggestion.getTypeClassByType = _getTypeClassByType;
	Suggestion.getImageByType = _getImageByType;
	Suggestion.getExamples = _getExamples;
	Suggestion.getUnmoderatedSuggestions = _getUnmoderatedSuggestions;
	Suggestion.getSuggestionPairs = _getSuggestionPairs;
	Suggestion.getAllApprovedSuggestions = _getAllApprovedSuggestions;

	return Suggestion;

	// methods

	function _beforeInject(resourceName, parseObject, cb){
		if(parseObject.attributes) {
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject, cb);
		} else {
			// console.log('injecting non-parse suggestion or pre-cleaned suggestion');
		}
		if(parseObject.owner) {
			// inject user if needed
			var cachedOwner = DS.get('user', parseObject.owner.id);
			if(cachedOwner) {
				parseObject.owner = cachedOwner;
			} else {
				parseObject.owner = DS.inject('user', parseObject.owner);
			}
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		// if(!relations) relations = RELATIONS;
		ParseData.linkRelationsAfterInject(Suggestion, RELATIONS, this);
		// Suggestion.linkInverse(this.id);
	}

	function _updateOwnerId(owner) {
		if(owner)
			return owner.id;
		else {
			console.log('why no owner');
		}
	}

	function _updateTypeDisplay(type) {
		return Suggestion.getTypeDisplayByType(type);
	}

	function _updateTypeClass(type) {
		return Suggestion.getTypeClassByType(type);
	}

	function _updateSlug(text) {
		return Slug.slugify(text);
	}

	function _updateLink(slug, id) {
		return {
			cardid: id,
			slug: slug
		};
	}

	function _updateImageUrl(type) {
		return Suggestion.getImageByType(type);
	}

	function _updateUrl(link) {
		var cardState = $state.get('card').url;
		var matcher = $urlMatcherFactory.compile(cardState);
		var path = matcher.format(link);
		return [
			'http://godhatescharades.com',
			path
		].join('');
	}

	function _updateKdr(votes, skips) {
		if(!votes) votes = 1;
		if(!skips) skips = 1;

		var kdr = votes / skips;
		return kdr.toFixed(2);
	}

	function _updateViews(votes, skips) {
		var views = 0;
		if(votes) views += votes;
		if(skips) views += skips;
		return views;
	}

	function _linkSetItems() {
		var params = {
			where: {
				cardId: {
					'==': this.id
				}
			}
		};
		this.setItems = DS.filter('setItem', params);
		this.sets = _.pluck(this.setItems, 'owner');
	}

	// class methods
	function _getBlankCardByType(type) {
		return {
			type: type
		};
	}

	function _getImageByType(type) {
		switch(type) {
			case 0 :
				return 'img/actor_skull.svg';
			case 1 :
				return 'img/scenario_ball.svg';
		}
	}

	function _getTypeClassByType(type) {
		switch(type) {
			case 0 :
				return TYPE_CLASS_CHARACTER;
			case 1 :
				return TYPE_CLASS_SCENARIO;
			default :
				console.log('unhandled card type:', type);
				break;
		}
	}

	function _getTypeDisplayByType(type) {
		switch(type) {
			case 0 :
				return TYPE_DISPLAY_CHARACTER;
			case 1 :
				return TYPE_DISPLAY_SCENARIO;
		}
	}


	function _getAllApprovedSuggestions() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getAllSuggestions',
			{},
			{
				success: _onSuggestionListSuccess.bind(deferred),
				error: deferred.reject
			}
		);
		return deferred.promise;
	}

	function _getExamples() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'examples',
			{
				id: CONFIG.EXAMPLE_SET_ID
			},
			{
				success: function(examples) {
					// _cache(suggestions);
					//TODO: Setup injection
					// DS.inject(definition.name, examples);
					deferred.resolve(examples);
				},
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _getUnmoderatedSuggestions() {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getUnmoderatedSuggestions',
			{}, 
			{
				success: _onSuggestionListSuccess.bind(deferred),
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	function _onSuggestionListSuccess(suggestions) {
		suggestions = Suggestion.inject(suggestions);
		this.resolve(suggestions);
		// ParseData.safeInject('suggestion', suggestions)
		// .then(this.resolve);
	}

	function _getSuggestionPairs(skip) {
		var deferred = $q.defer();
		Parse.Cloud.run(
			CONFIG.PARSE_VERSION + 'getRandomSuggestionPairs',
			{
				skip: skip
			}, 
			{
				success: function(pairs) {
					_.each(pairs, function(pair) {
						pair['0'] = Suggestion.inject(pair['0']);
						pair['1'] = Suggestion.inject(pair['1']);
					})
					deferred.resolve(pairs);
				},
				error: deferred.reject
			}
		);

		return deferred.promise;
	}

	// adapter methods

	function _find(resource, id) {
		var cached = Suggestion.get(id);

		if(cached) {
			return $q.when(cached);
		} else {
			// else fetch data
			var options = {
				id: id
			};
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getCardById', options);
		}
	}
});