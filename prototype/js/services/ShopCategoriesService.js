game.Services = game.Services || {};
game.Services.ShopCategoriesService = {
	getAll: function() {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
      $.get(conf.shopcategories_endpoint).then(function(r) {
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
