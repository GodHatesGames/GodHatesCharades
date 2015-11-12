'use strict';
var userUtils = require('cloud/v2/userUtils.js');
var _ = require('underscore');

var DiscountObject = Parse.Object.extend('Discount');
var SuggestionObject = Parse.Object.extend('Suggestion');
var SetObject = Parse.Object.extend('Set');
var SetItemObject = Parse.Object.extend('SetItem');

exports.getAllSuggestions = getAllSuggestions;
exports.getAllSets = getAllSets;
exports.addCardToSet = addCardToSet;
exports.removeSetItem = removeSetItem;
exports.createSet = createSet;
exports.destroySet = destroySet;
exports.updateSuggestionText = updateSuggestionText;
exports.getAllDiscounts = getAllDiscounts;
exports.updateDiscount = updateDiscount;
exports.createDiscount = createDiscount;
exports.destroyDiscount = destroyDiscount;

function getAllSuggestions(request, response) {
	//to allow fetching owners
	Parse.Cloud.useMasterKey();

	// console.log('getAllSuggestions');
	var queryLimit = 1000;
	var allSuggestions = [];
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, response.error);
	} else {
		response.error('you must be logged in');
	}

	function fetchData(isAdmin) {
		// console.log('fetchData, isAdmin:');
		// console.log(isAdmin);
		if(isAdmin) {
			console.log('user is admin');
			var query = new Parse.Query(SuggestionObject);
			query.limit(queryLimit);
			query.equalTo('rejected', false);
			query.equalTo('moderated', true);
			query.include('owner');
			query.ascending('type');
			query.find({
				success: onSuccess,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}

	function onSuccess(suggestions) {
		if(suggestions.length > 0)
			allSuggestions = allSuggestions.concat(suggestions);


		if(suggestions.length < queryLimit) {
			// console.log('found suggetions: ' + allSuggestions.length);

			_.each(allSuggestions, function(suggestion) {
			    userUtils.stripPrivateData(suggestion.attributes.owner);
			});
			response.success(allSuggestions);
		} else {
			// console.log('fetching more suggestions');
			fetchData(true, allSuggestions.length);
		}
	}
}

function getAllSets(request, response) {
	var allSets = [];
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, response.error);
	} else {
		response.error('you must be logged in');
	}

	function fetchData(isAdmin) {
		// console.log('fetchData, isAdmin:');
		// console.log(isAdmin);
		if(isAdmin) {
			// console.log('user is admin');
			var query = new Parse.Query(SetObject);
			query.find({
				success: onSuccess,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}

	function onSuccess(sets) {
		if(sets.length > 0)
			allSets = allSets.concat(sets);
		response.success(allSets);
	}
}

function addCardToSet(request, response) {
	console.log('addCardToSet');
	Parse.Cloud.useMasterKey();
	var cardId = request.params.card;
	var setId = request.params.set;
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, response.error);
	} else {
		response.error('you must be logged in');
	}

	function saveData(isAdmin) {
		// console.log('addCardToSet saveData');
		if(isAdmin) {
			// console.log('user is admin');
			// mock suggestion
			var suggestion = new SuggestionObject();
			suggestion.id = cardId;
			// mock set
			var SetObject = Parse.Object.extend('Set');
			var set = new SetObject();
			set.id = setId;
			// create new setitem and add setitem to set
			var SetItemObject = Parse.Object.extend('SetItem');
			var newSetItem = new SetItemObject();
			newSetItem.set('card', suggestion);
			newSetItem.set('owner', set);
			newSetItem.save({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}
}

function removeSetItem(request, response) {
	// console.log('removeSetItem');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(destroyItem, response.error);
	} else {
		response.error('you must be logged in');
	}

	function destroyItem(isAdmin) {
		// console.log('removeSetItem destroyItem');
		if(isAdmin) {
			// console.log('user is admin');
			// create new setitem and add setitem to set
			var itemToDelete = new SetItemObject();
			itemToDelete.id = request.params.id;
			itemToDelete.destroy({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}
}

function createSet(request, response) {
	// console.log('createSet');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(createNewSet, response.error);
	} else {
		response.error('you must be logged in');
	}

	function createNewSet(isAdmin) {
		// console.log('createSet createNewSet');
		if(isAdmin) {
			// console.log('user is admin');
			var newSet = new SetObject();
			newSet.save({
				name: request.params.name
			}, {
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}
}

function destroySet(request, response) {
	console.log('destroySet');
	Parse.Cloud.useMasterKey();
	console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(destroyItem, response.error);
	} else {
		response.error('you must be logged in');
	}

	function destroyItem(isAdmin) {
		console.log('destroySet destroyItem');
		if(isAdmin) {
			console.log('user is admin');
			// create new setitem and add setitem to set
			var setToDelete = new SetObject();
			setToDelete.id = request.params.id;
			setToDelete.destroy({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}

}

function updateSuggestionText(request, response) {
	// console.log('updateSuggestionText');
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, response.error);
	} else {
		response.error('you must be logged in');
	}

	function saveData(isAdmin) {
		// console.log('updateSuggestionText saveData');
		if(isAdmin) {
			// console.log('user is admin');
			var suggestionId = request.params.suggestionId;
			// mock suggestion
			var suggestion = new SuggestionObject();
			suggestion.id = suggestionId;
			suggestion.set('text', request.params.text);
			suggestion.set('legal', request.params.legal);
			suggestion.set('spite', request.params.spite);
			suggestion.save({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}
}

function getAllDiscounts(request, response) {
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(fetchData, response.error);
	} else {
		response.error('you must be logged in');
	}

	function fetchData(isAdmin) {
		// console.log('fetchData, isAdmin:');
		// console.log(isAdmin);
		if(isAdmin) {
			// console.log('user is admin');
			var query = new Parse.Query(DiscountObject);
			query.find({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to get discounts.');
		}
	}
}

function updateDiscount(request, response) {
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(saveData, response.error);
	} else {
		response.error('you must be logged in');
	}

	function saveData(isAdmin) {
		if(isAdmin) {
			// mock discount
			var discount = new DiscountObject();
			discount.id = request.params.id;
			discount.set('code', request.params.code);
			discount.set('paramKey', request.params.paramKey);
			discount.set('paramValue', request.params.paramValue);
			discount.set('feature', request.params.feature);
			discount.save({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}
}

function createDiscount(request, response) {
	// console.log('createSet');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(createNewDiscount, response.error);
	} else {
		response.error('you must be logged in');
	}

	function createNewDiscount(isAdmin) {
		// console.log('createSet createNewDiscount');
		if(isAdmin) {
			// console.log('user is admin');
			var newDiscount = new DiscountObject();
			newDiscount.save({
				code: request.params.code,
				paramKey: request.params.paramKey,
				paramValue: request.params.paramValue,
				feature: request.params.feature
			}, {
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}

}

function destroyDiscount(request, response) {
	console.log('destroyDiscount');
	Parse.Cloud.useMasterKey();
	if(request.user) {
		userUtils.isUserAdmin(request.user.id)
			.then(destroyItem, function(err) {
				console.log('err');
				console.log(err);
				response.error(err);
			});
	} else {
		response.error('you must be logged in');
	}

	function destroyItem(isAdmin) {
		if(isAdmin) {
			// create new setitem and add setitem to set
			var discountToDelete = new DiscountObject();
			discountToDelete.id = request.params.id;
			discountToDelete.destroy({
				success: response.success,
				error: response.error
			});
		} else {
			console.log('user is not admin');
			response.error('You need to be an admin to access this page.');
		}
	}
}