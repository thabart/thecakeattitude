'use strict';
var ProductClient = {
  search: function(content) { // Search products.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.products_endpoint + "/.search", {
	      method: 'POST',
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
