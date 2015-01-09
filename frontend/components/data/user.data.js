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
		beforeInject: ParseData.flattenAttrsBeforeInject,
		methods: {
			// Instance methods
			logout: _logout
		}
	}

	// Adapter
	DS.adapters.userAdapter = {
	};

	// init
	var User = DS.defineResource(definition);
	User.login = _login;

	return User;

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
		userData.loggedin = true;

		console.log('Welcome', userData.username);
		console.log(userData);
	}

	function _onUserError(user, error) {
		// The login failed. Check error to see why.
		console.log('Login failed:', error);
		$rootScope.$broadcast('alert', {
			message: error.message
		});
	}

	// instance methods

	function _logout() {
		var user = this;
		Parse.User.logOut()
		.then(_onLoggedOut);

		function _onLoggedOut() {
			user.unlinkInverse();
			DS.eject(definition.name, user.id);
			user.loggedin = false;
		}
	}



});