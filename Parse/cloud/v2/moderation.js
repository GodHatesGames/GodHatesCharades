'use strict';
var _ = require('underscore');
var userUtils = require('cloud/v2/userUtils.js');
var config = require('cloud/config.js');
var sendgrid = require('sendgrid');
var sendgrid_client = sendgrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

exports.getUnmoderatedSuggestions = _getUnmoderatedSuggestions;
exports.approveSuggestion = _approveSuggestion;
exports.disapproveSuggestion = _disapproveSuggestion;

function _getUnmoderatedSuggestions(request, response) {
  //to allow fetching owners
  Parse.Cloud.useMasterKey();
  
  // console.log('request.user.id:' + request.user.id);
  if(request.user) {
    userUtils.isUserAdmin(request.user.id)
      .then(fetchData, onError);
  } else {
    onError();
  }

  function fetchData(isAdmin) {
    // console.log('fetchData, isAdmin:');
    // console.log(isAdmin);
    if(isAdmin) {
      // console.log('user is admin');
      var SuggestionObject = Parse.Object.extend('Suggestion');
      var query = new Parse.Query(SuggestionObject);
      query.limit(1000);
      query.notEqualTo('rejected', true);
      query.notEqualTo('moderated', true);
      query.include('owner');
      query.find({
        success: onSuccess,
        error: onError
      });
    } else {
      console.log('user is not admin');
      onError('You need to be an admin to access this page.');
    }
  }

  function onSuccess(suggestions) {
    // console.log('getUnmoderatedSuggestions Success');
    _.each(suggestions, function(suggestion) {
        userUtils.stripPrivateData(suggestion.attributes.owner);
    });
    response.success(suggestions);
  }

  function onError(error) {
    console.log('getUnmoderatedSuggestions Error');
    response.error(error);
  }

}

function _approveSuggestion(request, response) {
  // console.log('approveSuggestion');
  Parse.Cloud.useMasterKey();
  if(request.user) {
    userUtils.isUserAdmin(request.user.id)
      .then(saveData, onError);
  } else {
    onError();
  }

  function saveData(isAdmin) {
    // console.log('approveSuggestion saveData');
    if(isAdmin) {
      // console.log('user is admin');
      var card = request.params.card;

      // mock suggestion
      var SuggestionObject = Parse.Object.extend('Suggestion');
      var suggestion = new SuggestionObject();
      suggestion.id = card.id;
      suggestion.set('moderated', true);
      suggestion.set('rejected', false);
      suggestion.set('text', card.text);
      suggestion.set('legal', card.legal);
      suggestion.save({
        success: onDataSaved,
        error: onError
      });
    } else {
      console.log('user is not admin');
      onError('You need to be an admin to access this method.');
    }
  }

  function onDataSaved(suggestion) {
    _setCardImage(request.params.card, suggestion.get('type'));
    var email = _getMessage(request.params.recipient, request.params.email, request.params.card);
    email.addFilter('templates', 'enable', 1);
    email.addFilter('templates', 'template_id', 'e38a52db-8da7-4db9-9ee9-5da87f18b451');
    
    sendgrid.send(email, function(err, json) {
      if (err) {
        onError(err);
      } else {
        onSuccess(json)
      }
    });
  }

  function onSuccess(result) {
    // console.log('approveSuggestion saveData success');

    response.success(result);
  }

  function onError(error) {
    console.log('approveSuggestion saveData Error');
    response.error(error);
  }

}

function _disapproveSuggestion(request, response) {
  // console.log('disapproveSuggestion');
  Parse.Cloud.useMasterKey();
  if(request.user) {
    userUtils.isUserAdmin(request.user.id)
      .then(saveData, onError);
  } else {
    onError();
  }

  function saveData(isAdmin) {
    // console.log('disapproveSuggestion saveData');
    if(isAdmin) {
      // console.log('user is admin');
      var card = request.params.card;

      // mock suggestion
      var SuggestionObject = Parse.Object.extend('Suggestion');
      var suggestion = new SuggestionObject();
      suggestion.id = card.id;
      suggestion.set('moderated', true);
      suggestion.set('rejected', true);
      suggestion.save({
        success: onDataSaved,
        error: onError
      });
    } else {
      console.log('user is not admin');
      onError('You need to be an admin to access this method.');
    }
  }

  function onDataSaved(suggestion) {
    _setCardImage(request.params.card, suggestion.get('type'));
    var email = _getMessage(request.params.recipient, request.params.email, request.params.card);
    email.addFilter('templates', 'enable', 1);
    email.addFilter('templates', 'template_id', 'e38a52db-8da7-4db9-9ee9-5da87f18b451');

    sendgrid.send(email, function(err, json) {
      if (err) {
        onError(err);
      } else {
        onSuccess(json)
      }
    });
  }

  function onSuccess(suggestion) {
    // console.log('disapproveSuggestion saveData success');
    response.success(suggestion);
  }

  function onError(error) {
    console.log('disapproveSuggestion saveData Error');
    response.error(error);
  }

}

function _setCardImage(card, type) {
  if(type == 0) {
    card.image = 'http://godhatescharades.com/img/email/actor.png';
  } else {
    card.image = 'http://godhatescharades.com/img/email/scenario.png';
  }
}

function _getMessage(recipient, email, card) {
  var email = new sendgrid.Email({
    to: recipient.address,
    toname: recipient.name,
    from: process.env.LIST_EMAIL,
    fromname: process.env.LIST_COMPANY,
    subject: email.subject,
    text: email.message,
  });
  email.addSubstitution('card_url', card.url);
  email.addSubstitution('card_text', card.text);
  email.addSubstitution('card_image_url', card.image);
  email.addSubstitution('recipient_name', recipient.name);
  email.addUniqueArg('user_id', recipient.id);
  return email;
}