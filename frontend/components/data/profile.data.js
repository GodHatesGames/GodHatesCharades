app.factory('Profile', function (DS, $q, ParseData) {
	// vars
	var definition = {
		name: 'profile',
		defaultAdapter: 'profileAdapter',
		beforeInject: _beforeInject,
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

	function _beforeInject(resourceName, parseObject){
		ParseData.linkProperty(parseObject, 'user', 'owner');
		ParseData.linkProperty(parseObject, 'suggestion', 'suggestions');
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
			return Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getProfile', options);
		}
	}

	// class methods

	// instance methods




});