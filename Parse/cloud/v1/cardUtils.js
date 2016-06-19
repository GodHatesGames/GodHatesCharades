'use strict';
var _ = require('lodash');
var userUtils = require('./userUtils.js');

exports.examples = examples;
exports.getCardsForSet = getCardsForSet;
exports.getCardById = getCardById;

// Use Parse.Cloud.define to define as many cloud functions as you want.
function examples(request, response) {
	//Parse.Cloud.useMasterKey();
	var setId = request.params.id;
	loadSetItems();

	function loadSetItems() {
		var query = buildCardsForSetQuery(setId);
		query.include('card.owner');
		query.find({
			success: onSuggestionsLoaded,
			error: onError
		});
	}

	function onSuggestionsLoaded(setItems) {
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

	function onError(error) {
		console.log('examples Error');
		response.error(error);
	}

}

function getCardsForSet(request, response) {
	// console.log('getCardsForSet');
		//Parse.Cloud.useMasterKey();
	var setId = request.params.id;
	var includeOwner = request.params.includeOwner;

	if(setId !== undefined) {
		// console.log('getCardsForSet fetchData');
		var query = buildCardsForSetQuery(setId);
		if(includeOwner === true) {
			query.include('card.owner');
		} else {
			query.include('card');
		}
		query.find({
			success: onSuccess,
			error: onError
		});
	} else {
		response.error('you must pass a set id to get');
	}

	function onSuccess(setItems) {
		// console.log('setItems found:' + setItems.length);
		var card;
		_.each(setItems, function(item) {
			card = item.attributes.card;
			userUtils.stripPrivateData(card.attributes.owner);
		});
		response.success(setItems);
	}

	function onError(error) {
		console.log('getAllSets Error');
		response.error(error);
	}

}

function buildCardsForSetQuery(id) {
	var SetObject = Parse.Object.extend('Set');
	var mockSet = new SetObject();
	mockSet.id = id;
	var SetItemObject = Parse.Object.extend('SetItem');
	var query = new Parse.Query(SetItemObject);
	query.equalTo('owner', mockSet);
	return query;
}

function getCardById(request, response) {
	//Parse.Cloud.useMasterKey();
	var cardId = request.params.id;
	if(cardId !== undefined) {
		// console.log('getCardsForSet fetchData');
		var SuggestionObject = Parse.Object.extend('Suggestion');
		var query = new Parse.Query(SuggestionObject);
		query.include('owner');
		query.get(request.params.id, {
			success: onSuccess,
			error: onError
		});
	} else {
		response.error('you must pass a set id to get');
	}

	function onSuccess(card) {
		userUtils.stripPrivateData(card.attributes.owner);
		response.success(card);
	}

	function onError(error) {
		console.log('getCard Error');
		response.error(error);
	}

}