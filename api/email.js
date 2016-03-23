'use strict';
var sendgrid = require('sendgrid');
var sendgrid_client = sendgrid(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

module.exports.sendSingleCardMessage = _sendSingleCardMessage;

function _sendSingleCardMessage(req, res) {
  var email = _getMessage(req.params.recipient, req.params.email, req.params.card);
  email.addFilter('templates', 'enable', 1);
  email.addFilter('templates', 'template_id', 'e38a52db-8da7-4db9-9ee9-5da87f18b451');

  sendgrid.send(email, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
};

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