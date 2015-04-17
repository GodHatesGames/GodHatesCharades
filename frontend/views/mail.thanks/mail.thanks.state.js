'use strict';

angular.module('app')
.config(function ($stateProvider) {
  $stateProvider.state('mail.thanks', {
    url: '/thanks',
    title: 'Subscription Confirmation',
    description: 'Thanks for subscribing to our mailing list.',
    templateUrl: 'views/mail.thanks/mail.thanks.html'
  });
});