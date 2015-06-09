var _ = require('lodash');
var request = require('request');

var util = require('util');
var Aftership = require('aftership')(process.env.AFTERSHIP_API_KEY);
module.exports.shipmentStats = _getShipmentStats;

function _getShipmentStats(req, res) {
  if(req.params.supersecret === process.env.AFTERSHIP_SECRET) {
    Aftership.getTrackings({}, _onTrackingsRecieved);
  } else {
    res.send(401);
  }

  function _onTrackingsRecieved(error, results) {
    if(error) {
      res.status(500).send(error);
    } else {
      var statuses = {
        Delivered: {
          type: 'integer',
          value: 0,
          label: 'Delivered',
          order: 3
        },
        OutForDelivery: {
          type: 'integer',
          value: 0,
          label: 'Out For Delivery',
          order: 2
        },
        InTransit: {
          type: 'integer',
          value: 0,
          label: 'In Transit',
          order: 1
        },
        InformationReceived: {
          type: 'integer',
          value: 0,
          label: 'Information Received',
          order: 0
        },
        FailedAttempt: {
          type: 'integer',
          value: 0,
          label: 'Failed Attempt',
          order: 4
        },
        Exception: {
          type: 'integer',
          value: 0,
          label: 'Exception',
          order: 5
        }
      };
      _.each(results.trackings, function(tracking) {
        if(statuses[tracking.tag])
          statuses[tracking.tag].value++;
        else {
          console.log('_onTrackingsRecieved error: Status', tracking.tag, 'not found');
        }
      });
      res.status(200).send(statuses);
    }
  }
}