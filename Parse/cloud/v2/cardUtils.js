'use strict';
var _ = require('lodash');
var userUtils = require('./userUtils.js');

exports.examples = _examples;
exports.getCardsForSet = _getCardsForSet;
exports.getCardById = _getCardById;
exports.getCardsForSuggestion = _getCardsForSuggestion;

// Use Parse.Cloud.define to define as many cloud functions as you want.
function _examples(request, response) {
	//Parse.Cloud.useMasterKey();
	var setId = request.params.id;
	_loadSetItems();

	function _loadSetItems() {
		var query = _buildCardsQuery();
		var SetObject = Parse.Object.extend('Set');
		var mockSet = new SetObject();
		mockSet.id = setId;
		query.equalTo('owner', mockSet);
		query.include('card.owner');
		query.find({
			success: _onSuggestionsLoaded,
			error: _onError
		});
	}

	function _onSuggestionsLoaded(setItems) {
		var card;
		var zeroSuggestions = [];
		var oneSuggestions = [];

		_.each(setItems, function stripData(item) {
			card = item.attributes.card;
			userUtils.stripPrivateData(card.attributes.owner);
			if (card.attributes.type === 0) {
				zeroSuggestions.push(card);
			} else {
				oneSuggestions.push(card);
			}
		});

		response.success({
			zero: zeroSuggestions,
			one: oneSuggestions
		});
	}

	function _onError(error) {
		console.log('examples Error');
		response.error(error);
	}

}

function _getCardsForSet(request, response) {
	// console.log('getCardsForSet');
		//Parse.Cloud.useMasterKey();
	var setId = request.params.id;
	var includeOwner = request.params.includeOwner;

	if(setId !== undefined) {
		// console.log('getCardsForSet fetchData');
		var query = _buildCardsQuery(setId);
		var SetObject = Parse.Object.extend('Set');
		var mockSet = new SetObject();
		mockSet.id = setId;
		query.equalTo('owner', mockSet);
		if(includeOwner === true) {
			query.include('card.owner');
		} else {
			query.include('card');
		}
		query.find({
			success: _onSuccess,
			error: _onError
		});
	} else {
		response.error('you must pass a set id to get');
	}

	function _onSuccess(setItems) {
		// console.log('setItems found:' + setItems.length);
		var card;
		_.each(setItems, function(item) {
			card = item.attributes.card;
			userUtils.stripPrivateData(card.attributes.owner);
		});
		response.success(setItems);
	}

	function _onError(error) {
		console.log('getAllSets Error');
		response.error(error);
	}

}

function _getCardById(request, response) {
	//Parse.Cloud.useMasterKey();
	var cardId = request.params.id;
	if(cardId !== undefined) {
		// console.log('getCardsForSet fetchData');
		var SuggestionObject = Parse.Object.extend('Suggestion');
		var query = new Parse.Query(SuggestionObject);
		query.include('owner');
		query.get(request.params.id, {
			success: _onSuccess,
			error: _onError
		});
	} else {
		response.error('you must pass a set id to get');
	}

	function _onSuccess(card) {
		userUtils.stripPrivateData(card.attributes.owner);
		response.success(card);
	}

	function _onError(error) {
		console.log('getCard Error');
		response.error(error);
	}

}

function _getCardsForSuggestion(request, response) {
	// console.log('getCardsForSet');
		//Parse.Cloud.useMasterKey();
	var suggestionId = request.params.id;
	var includeOwner = request.params.includeOwner;

	if(suggestionId !== undefined) {
		// console.log('getCardsForSet fetchData');
		var SuggestionObject = Parse.Object.extend('Suggestion');
		var mockSuggestion = new SuggestionObject();
		mockSuggestion.id = suggestionId;

		// actor query
		var query = _buildCardsQuery();
		query.equalTo('card', mockSuggestion);
		includeOwner ? query.include('card.owner') : query.include('card');

		query.find({
			success: _onSuccess,
			error: _onError
		});
	} else {
		response.error('you must pass a suggestion id to get');
	}

	function _onSuccess(setItems) {
		// console.log('setItems found:' + setItems.length);
		var card;
		_.each(setItems, function(item) {
			card = item.attributes.card;
			userUtils.stripPrivateData(card.attributes.owner);
		});
		response.success(setItems);
	}

	function _onError(error) {
		console.log('getAllSets Error');
		response.error(error);
	}

}

function _buildCardsQuery() {
	var SetItemObject = Parse.Object.extend('SetItem');
	var query = new Parse.Query(SetItemObject);
	query.limit(1000);
	return query;
}