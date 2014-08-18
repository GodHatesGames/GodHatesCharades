var _ = require('underscore');
var userUtils = require('cloud/v2/userUtils.js');
var MAX_FETCH = 300;

exports.topPairs = topPairs;
exports.calculateStats = calculateStats;

function topPairs(request, response) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	var PairObject = Parse.Object.extend('Pair');
	var query = new Parse.Query(PairObject);

	query.exists('controversy');
	query.exists('kdr');

	// extra protection with max of 100 items
	var itemsRemaining = MAX_FETCH - request.params.skipIndex;
	if(itemsRemaining <= 0) {
		response.success([]);
	} else {
		var pageSize = Math.min(request.params.pageSize, itemsRemaining);
		var skipIndex = request.params.skipIndex;
		query.limit(pageSize);
		query.skip(skipIndex);
		// include owner so we can display their details
		query.include('actor.owner');
		query.include('scenario.owner');
		// only use pairs that have been seen a lot
		query.find({
			success: onPairsLoaded,
			error: onPairsError
		});
	}

	function onPairsLoaded(pairs) {
		var pair;
		for(var i = 0; i < pairs.length; i++) {
			pair = pairs[i];
			userUtils.stripPrivateData(pair.attributes.actor.attributes.owner);
			userUtils.stripPrivateData(pair.attributes.scenario.attributes.owner);
		}

		response.success(pairs);
	}

	function onPairsError(error) {
		response.reject(error);
	}
}

function calculateStats(request, status) {
	// to allow fetching owners
	Parse.Cloud.useMasterKey();

	console.log('calculateStats started');
	var promises = [];
	var counter = 0;
	var limit = 300;

	// Query for all pairs
	var PairObject = Parse.Object.extend('Pair');
	var query = new Parse.Query(PairObject);
	query.descending('displayed');
	query.limit(limit);
	query.find()
	.then(function(pairs) {
		console.log(pairs.length + ' found');
		_.each(pairs, function(pair) {
			// Update to plan value passed in
			// user.set('plan', request.params.plan);

			setKDR(pair);
			setControversy(pair);
			// Save Pair
			var savePromise = pair.save(null, {
				success: function(savedPair) {
					// console.log('kdr saved');
					if (counter % 10 === 0) {
						// Set the  job's progress status
						status.message('calculateStats: ' + counter + ' pairs processed.');
						console.log('calculateStats: ' + counter + ' pairs processed.');
					}
					counter += 1;
					if(counter === limit) {
						console.log('counter:' + counter);
						finishedSaving();
					}
				},
				error: function(error) {
					console.log('error fetching pair:', error);
					status.message('error fetching pair:', error);
					errorSaving(error);
				}
			});
			promises.push(savePromise);
		});
		return Parse.Promise.when(promises);
	});


	function finishedSaving() {
		// Set the job's success status
		var message = 'calculateStats completed successfully. ' + counter + ' pairs updated.';
		status.success(message);
		console.log(message);
	}

	function errorSaving(error) {
		// Set the job's error status
		var message = 'error: calculateStats failed.' + JSON.stringify(error);
		status.error(message);
		console.log(message);
	}
}

function setKDR(pair) {
	var chosen = pair.get('chosen');
	if(!chosen) chosen = 1;
	var skipped = pair.get('skipped');
	if(!skipped) skipped = 1;

	var kdr = chosen / skipped;
	pair.set('kdr', kdr);
}

function setControversy(pair) {
	var chosen = pair.get('chosen');
	if(!chosen) chosen = 0;
	var skipped = pair.get('skipped');
	if(!skipped) skipped = 0;

	var controversy = Math.abs(Math.abs(chosen) - Math.abs(skipped));
	pair.set('controversy', controversy);
}