game.Services = game.Services || {};
game.Services.ProductsService = {
	search: function(content) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.products_endpoint + '/.search', {
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(content)
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
	get: function(productId) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.products_endpoint + '/' + productId).then(function(r) {
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
