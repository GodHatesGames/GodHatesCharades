var ActiveCampaign = require('activecampaign');
var ac = new ActiveCampaign('https://godhatesgames.api-us1.com', process.env.ACTIVE_CAMPAIGN_API_KEY);
var disposable = require('is-disposable-email');

// ac.debug = process.env.ACTIVE_CAMPAIGN_DEBUG ? true : false;

module.exports.subscribe = subscribe;

function subscribe(req, res){
  var disposableEmail = disposable(req.body.email);
  var mailingListId = disposableEmail ? process.env.ACTIVE_CAMPAIGN_DISPOSABLE_LIST_ID : process.env.ACTIVE_CAMPAIGN_LIST_ID;
  var listId = 'p[' + mailingListId + ']';
  var statusId = 'status[' + mailingListId + ']';
  var data = {
    email: req.body.email
  };
  // add to list
  data[listId] = '2';
  // activate subscription
  data[statusId] = '1';
  console.log('data', data);
  ac.api('contact/add', data)
  .then(function(response) {
    console.log('contact/add returned');
    // console.log(response);
    // console.log(res);
    if (response.success === 1) {
      console.log('successful request');
      // successful request
      res.status(200).send('subscription successful');
    } else {
      // request error
      console.log('request error');
      res.status(400).send('Something went wrong, please use a different email or try again.');
    }
  });
};