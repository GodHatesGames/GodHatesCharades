app.factory('Profile', function (DS, $q, ParseData) {
	// vars
	var definition = {
		name: 'profile',
		defaultAdapter: 'profileAdapter',
		beforeInject: _beforeInject,
		afterInject: _afterInject,
		relations: {
		},
		computed: {
			id: ['owner', _updateId]
		},
		methods: {
			// Instance methods
			updateLinks: _updateLinks
		}
	}
	var RELATIONS = ['user', 'suggestion'];

	// Adapter
	DS.adapters.profileAdapter = {
		find: _find
	};

	// init
	var Profile = DS.defineResource(definition);

	return Profile;

	// definition methods
	function _updateId(owner) {
		return this.owner.id;
	}

	function _beforeInject(resourceName, parseObject, cb){
		if(parseObject.owner) {
			// inject user if needed
			var cachedOwner = DS.get('user', parseObject.owner.id);
			if(cachedOwner) {
				parseObject.owner = cachedOwner;
			} else {
				parseObject.owner = DS.inject('user', parseObject.owner);
			}
		}

		if(parseObject.suggestions) {
			// inject user if needed
			parseObject.suggestions = DS.inject('suggestion', parseObject.suggestions);
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		// if(!relations) relations = RELATIONS;
		ParseData.linkRelationsAfterInject(Profile, RELATIONS, this);
		// Suggestion.linkInverse(this.id);
	}

	// adapter methods
	function _find(resource, id) {
		var cached = Profile.get(id);

		if(cached) {
			return $q.when(cached);
		} else {

			var options = {
				userid: id,
				pageSize: 1000
			};

			var deferred = $q.defer();
			console.log('fetching user');
			// $scope.loading = true;
			var callbacks = {
				success: deferred.resolve,
				error: deferred.reject
			};
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getProfile', options, callbacks);

			return deferred.promise;
		}
	}

	// class methods

	// instance methods




});