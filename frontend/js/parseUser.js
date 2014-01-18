var parseUser = angular.module('parse.user', []);

parseUser.service('parseUser', function factory($rootScope, $q, $location) {
	var user = {
		loggedin: false,
		dataloaded: false,
		isAdmin: isAdmin,
		isAnon: isAnon,
		isReal: isReal,
		isBetaUser: isBetaUser,
		data: null,
		createAnonUser: createAnonUser,
		connect: connect,
		logout: logout,
		signup: signup,
		save: save,
		getUserById: getUserById,
		cacheUser: cacheUser
	}

	var cache = {};
	var fetching = {};

	// check login status
	var currentUser = Parse.User.current();
	if (currentUser) {
		console.log('logged in', currentUser);
		user.data = currentUser;
		cache[user.data.id] = user.data;
		user.loggedin = true;
	} else {
		console.log('not logged in');
		user.loggedin = false;
	}

	function createAnonUser() {
		console.log('creating anon user');
		return signup(randString(), randString(), null, 'Anonymous');

		function randString() {
			// copy pasta'd from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});
		}
	}

	function connect(username, password) {
		//returns Parse.Promise
		var promise = Parse.User.logIn(username, password, {
			success: onUserConnected,
			error: onUserError
		});

		return promise;
	}

	function onUserConnected(userData) {
		// Do stuff after successful login.
		console.log('Welcome', userData.get('username'));
		console.log(userData);

		user.data = userData;
		user.loggedin = true;
		$rootScope.$apply();
	}

	function onUserError(user, error) {
		// The login failed. Check error to see why.
		console.log('Login failed:', error);
		$rootScope.$broadcast('alert', {
			message: error.message
		});
	}

	function logout() {
		Parse.User.logOut();
		user.loggedin = false;
		$location.path('/');
		// TODO find a better solution for this
		setTimeout(function(){
			window.location.reload();
		}, 1000);
	}

	function signup(username, password, email, name) {
		var user = new Parse.User();
		user.set('username', username);
		user.set('password', password);
		if(email)
			user.set('email', email);
		if(name)
			user.set('name', name);

		return user.signUp(null, {
			success: onUserConnected,
			error: onUserError
		});
	}

	function save() {
		var promise = user.data.save();
		promise.then(function(user) {
				console.log('saved!');
				user.data = user;
				$rootScope.$apply();
			}, function(user, error) {
				console.log('could note save:', error);
			}
		);
		return promise;
	}

	// returns true if current user is not Anonymous
	function isReal() {
		if(!user.loggedin)
			return false;
		else
			return user.data !== null && user.data.attributes.email !== undefined;
	}

	// returns true if current user is Anonymous
	function isAnon() {
		if(!user.loggedin)
			return true;
		else if(user.data === null)
			return true;
		else if(user.data.attributes.email === undefined)
			return true;
		else
			return false;
	}

	function isAdmin() {
		if(user.loggedin)
			return Boolean(user.data.get('admin'));
		else
			return false;
	}

	function isBetaUser() {
		if(user.loggedin)
			return Boolean(user.data.get('beta'));
		else
			return false;
	}

	function getUserById(id) {
		var deffered = $q.defer();
		if(fetching[id]) {
			console.log('returning existing promise');
			return fetching[id];
		} else if(cache[id]) {
			console.log('delivering cached user');
			deffered.resolve(cache[id]);
		} else {
			console.log('fetching user');
			// $scope.loading = true;
			var query = new Parse.Query(Parse.User);
			query.get(id, {
				success: onUserFound,
				error: onUserError
			});
			fetching[id] = deffered.promise;
		}

		return deffered.promise;

		function onUserFound(user) {
			delete fetching[id];
			cache[user.id] = user;
			deffered.resolve(user);
		}

		function onUserError(user, error) {
			delete fetching[id];
			deffered.reject(error);
		}
	}

	function cacheUser(userToCache) {
		if(userToCache) {
			// dont override current user
			if(userToCache.id !== user.data.id)
				cache[userToCache.id] = userToCache;
		} else {
			console.log('must provide user to cache');
		}
	}

	return user;
});