'use strict';
var AnnounceClient = {
  addAnnounce: function(accessToken, content, commonId) { // Add an announce.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.announcements_endpoint, {
	      method: 'POST',
	      headers: {
	        'Authorization': 'Bearer ' + accessToken,
					'CommonId': commonId
	      },
				data: JSON.stringify(content),
        contentType: 'application/json'
			}).then(function(r) {
				dfd.resolve(r);
			}).fail(function(e) {
				dfd.reject(e);
			});
		}).fail(function(e) {
			dfd.reject(e);
		});

		return dfd;
	}
};
