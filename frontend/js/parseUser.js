'use strict';
var parseUser = angular.module('parse.user', []);

parseUser.service('parseUser', function factory($rootScope, $q, $location, leanplum, cardService) {
	var user = {
		loggedin: false,
		dataloaded: false,
		isAdmin: isAdmin,
		isAnon: isAnon,
		isReal: isReal,
		isBetaUser: isBetaUser,
		isCurrentUser: isCurrentUser,
		data: null,
		createAnonUser: createAnonUser,
		connect: connect,
		logout: logout,
		signupAnonUser: signupAnonUser,
		save: save,
		getProfileById: getProfileById
	};

	var cache = {};
	var fetching = {};
	var profiles = {};

	// check login status
	var currentUser = Parse.User.current();
	if (currentUser) {
		console.log('logged in', currentUser);
		user.data = currentUser;
		cache[user.data.id] = user.data;
		user.loggedin = true;
		leanplum.startLeanPlum(user.data)
	} else {
		console.log('not logged in');
		user.loggedin = false;
		// create parse user to be used for suggestions and voting
		createAnonUser();
	}

	function createAnonUser() {
		console.log('creating anon user');
		
		var newUser = new Parse.User();
		newUser.set('username', randString());
		newUser.set('password', randString());
		newUser.set('name', 'Anonymous');

		return newUser.signUp(null, {
			success: onUserConnected,
			error: onUserError
		});

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
		//track in leanplum
		leanplum.startLeanPlum(user.data);

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

	function signupAnonUser(username, password, email, name) {
		user.data.set('username', username);
		user.data.set('password', password);
		user.data.set('email', email);
		user.data.set('name', name);
		return user.data.save(null, {
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
				console.log('could not save:', error);
			}
		);
		return promise;
	}

	// returns true if current user is not Anonymous
	function isReal() {
		return !isAnon();
	}

	// returns true if current user is Anonymous
	function isAnon() {
		if(user.data === null)
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

	function isCurrentUser(userid) {
		if (user.loggedin &&
			userid === user.data.id) {
			return true;
		} else {
			return false;
		}
	}

	function getProfileById(id, options) {
		if (id === undefined || id === null) {
			console.log('you must provide a userid');
			return $q.reject();
		}

		if (!options) {
			options = {
				userid: id
			};
		} else {
			options.userid = id;
		}

		var deffered = $q.defer();
		if(fetching[id]) {
			console.log('returning existing promise');
			return fetching[id];
		} else if(profiles[id]) {
			console.log('delivering cached user');
			deffered.resolve(profiles[id]);
		} else {
			console.log('fetching user');
			// $scope.loading = true;
			var callbacks = {
				success: onProfileFound,
				error: onProfileError
			};
			Parse.Cloud.run(CONFIG.PARSE_VERSION + 'getProfile', options, callbacks);
			fetching[id] = deffered.promise;
		}

		return deffered.promise;

		function onProfileFound(profile) {
			delete fetching[id];
			var user = profile.owner;
			profiles[user.id] = profile;
			cardService.cache(profile.suggestions);
			deffered.resolve(profile);
		}

		function onProfileError(user, error) {
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