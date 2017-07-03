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
	},
  get: function(id) { // Get the product.
    var dfd = jQuery.Deferred();
    $.get(Constants.apiConfigurationUrl).then(function(conf) {
      $.get(conf.products_endpoint + '/' + id).then(function(obj) {
        dfd.resolve(obj);
      }).fail(function(e) {
        dfd.reject(e);
      });
    }).fail(function(e) {
      dfd.reject(e);
    });

    return dfd;
  }
};
