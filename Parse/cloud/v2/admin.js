'use strict';
var userUtils = require('cloud/v2/userUtils.js');
var _ = require('underscore');
var config = require('cloud/config.js');
var Discount = require('cloud/v2/discount.js');

var DiscountObject = Parse.Object.extend('Discount');
var SuggestionObject = Parse.Object.extend('Suggestion');
var SetObject = Parse.Object.extend('Set');
var SetItemObject = Parse.Object.extend('SetItem');

exports.setupRoles = _setupRoles;
exports.getAllSuggestions = userUtils.isAdminRole.bind(this, _getAllSuggestions);
exports.getAllSets = userUtils.isAdminRole.bind(this, _getAllSets);
exports.addCardToSet = userUtils.isAdminRole.bind(this, _addCardToSet);
exports.removeSetItem = userUtils.isAdminRole.bind(this, _removeSetItem);
exports.createSet = userUtils.isAdminRole.bind(this, _createSet);
exports.destroySet = userUtils.isAdminRole.bind(this, _destroySet);
exports.updateSuggestionText = userUtils.isAdminRole.bind(this, _updateSuggestionText);
exports.getAllDiscounts = userUtils.isAdminRole.bind(this, _getAllDiscounts);
exports.updateDiscount = userUtils.isAdminRole.bind(this, _updateDiscount);
exports.createDiscount = userUtils.isAdminRole.bind(this, _createDiscount);
exports.destroyDiscount = userUtils.isAdminRole.bind(this, _destroyDiscount);

function _setupRoles(request, response) {
	Parse.Cloud.useMasterKey();

	Parse.Config.get()
	.then(function(config) {
		console.log(config);
		var admins = config.get('ADMINS');

		var query = new Parse.Query(Parse.Role);
		query.equalTo('name', 'Administrator');
		query.first()
		.then(_assignAdmins.bind(this, admins));
	});

	function _assignAdmins(admins, role) {
		console.log('found role: ' + role.get('name'));
		console.log('users: ' + admins);
		var relation = role.getUsers();
		for(var index in admins) {
			console.log('add: ' + admins[index]);
			var admin = new Parse.User();
			admin.id = admins[index];
			relation.add(admin);
		}
		role.save()
		.then(response.success, response.error);
	}
}

function _getAllSuggestions(request, response) {
	//to allow fetching owners
	Parse.Cloud.useMasterKey();

	// console.log('getAllSuggestions');
	var queryLimit = 1000;
	var allSuggestions = [];
	// console.log('request.user.id:' + request.user.id);
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

function _getAllSets(request, response) {
	var allSets = [];
	// console.log('request.user.id:' + request.user.id);
	var query = new Parse.Query(SetObject);
	query.find({
		success: onSuccess,
		error: response.error
	});

	function onSuccess(sets) {
		if(sets.length > 0)
			allSets = allSets.concat(sets);
		response.success(allSets);
	}
}

function _addCardToSet(request, response) {
	console.log('addCardToSet');
	Parse.Cloud.useMasterKey();
	var cardId = request.params.card;
	var setId = request.params.set;
	// console.log('request.user.id:' + request.user.id);
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
}

function _removeSetItem(request, response) {
	// console.log('removeSetItem');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	// create new setitem and add setitem to set
	var itemToDelete = new SetItemObject();
	itemToDelete.id = request.params.id;
	itemToDelete.destroy({
		success: response.success,
		error: response.error
	});
}

function _createSet(request, response) {
	// console.log('createSet');
	Parse.Cloud.useMasterKey();
	// console.log('request.user.id:' + request.user.id);
	// console.log('user is admin');
	var newSet = new SetObject();
	newSet.save({
		name: request.params.name
	}, {
		success: response.success,
		error: response.error
	});
}

function _destroySet(request, response) {
	console.log('destroySet');
	Parse.Cloud.useMasterKey();
	console.log('request.user.id:' + request.user.id);
	// create new setitem and add setitem to set
	var setToDelete = new SetObject();
	setToDelete.id = request.params.id;
	setToDelete.destroy({
		success: response.success,
		error: response.error
	});
}

function _updateSuggestionText(request, response) {
	// console.log('updateSuggestionText');
	Parse.Cloud.useMasterKey();
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
}

function _getAllDiscounts(request, response) {
	console.log('getAllDiscounts');
	// console.log('user is admin');
	var query = new Parse.Query(DiscountObject);
	query.find({
		success: response.success,
		error: response.error
	});
}

function _updateDiscount(request, response) {
	Parse.Cloud.useMasterKey();
	// mock discount
	var discount = new DiscountObject();
	discount.id = request.params.id;
	_.each(Discount.props, function(prop) {
		discount.set(prop, request.params[prop]);
	});
	discount.save({
		success: response.success,
		error: response.error
	});
}

function _createDiscount(request, response) {
	// console.log('createSet');
	Parse.Cloud.useMasterKey();
	var newDiscount = new DiscountObject();
	var newDiscountData = _.pick(request.params, Discount.props);
	newDiscount.save(newDiscountData, {
		success: response.success,
		error: response.error
	});
}

function _destroyDiscount(request, response) {
	console.log('destroyDiscount');
	Parse.Cloud.useMasterKey();
	// create new setitem and add setitem to set
	var discountToDelete = new DiscountObject();
	discountToDelete.id = request.params.id;
	discountToDelete.destroy({
		success: response.success,
		error: response.error
	});
}