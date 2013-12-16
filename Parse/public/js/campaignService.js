define([
	'app'
	], 
	function(app) {

		app.service('campaignService', [function() {
			var campaignService = {
				campaignsById: {
					ks2013: {
						done: function() {
							return Boolean(this.deadline() <= 0);
						},
						deadline: function getDeadline() {
							// 1388534400000: Jan 1 2014 GMT
							return (1388534400000 - new Date().getTime());
						}
					}
				}
			}

			return campaignService;
		}]);
	}
);