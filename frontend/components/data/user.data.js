app.factory('User', function (DS, $q, ParseData) {
	// vars
	var definition = {
		name: 'user',
		defaultAdapter: 'userAdapter',
		relations: {
			hasMany: {
				suggestion: {
					localField: 'suggestions',
					foreignKey: 'ownerId'
				}
			}
		},
		beforeInject: _beforeInject,
		methods: {
			// Instance methods
			logout: _logout,
			updateLinks: _updateLinks
		}
	}

	// Adapter
	DS.adapters.userAdapter = {
	};

	// Constants
	var RELATIONS = ['suggestion'];

	// init
	var User = DS.defineResource(definition);
	User.login = _login;
	User.current;
	var currentUser = Parse.User.current();
	if(currentUser) {
		_onUserConnected(currentUser);
	}

	return User;

	// definition methods

	function _beforeInject(resourceName, parseObject, cb) {
		if(parseObject.attributes) {
			if(!parseObject.attributes.admin) parseObject.attributes.admin = false;
			if(!parseObject.attributes.beta) parseObject.attributes.beta = false;
			ParseData.flattenAttrsBeforeInject(resourceName, parseObject, cb);
		}
	}

	function _afterInject(resourceName, parseObject, cb) {
		parseObject.updateLinks();
	}

	function _updateLinks() {
		ParseData.linkRelationsAfterInject(User, RELATIONS, this);
	}

	// class methods
	function _login(username, password) {
		var deferred = $q.defer();
		//returns Parse.Promise
		Parse.User.logIn(username, password, {
			success: _onUserConnected,
			error: _onUserError
		})
		.then(deferred.resolve, deferred.reject);

		return deferred.promise;
	}

	function _onUserConnected(userData) {
		userData = User.inject(userData);
		User.current = userData;

		console.log('Welcome', userData.username);
		console.log(userData);
	}

	function _disconnectUser() {
		User.current.unlinkInverse();
		DS.eject(definition.name, User.current.id);
		User.current = null;
	}

	function _onUserError(user, error) {
		// The login failed. Check error to see why.
		console.log('Login failed:', error);
		$rootScope.$broadcast('alert', {
			message: error.message
		});
	}

	function _getCurrent() {
		return User.current;
	}

	// instance methods

	function _logout() {
		var user = this;
		Parse.User.logOut()
		.then(_disconnectUser);a
	}



});