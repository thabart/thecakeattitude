var CategoryClient = {
	getCategory: function(id) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shopcategories_endpoint + '/' + id).then(function(cats) {
				dfd.resolve(cats);
			});
		});

		return dfd;
	},
	getCategories: function() {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shopcategories_endpoint).then(function(cats) {
				dfd.resolve(cats);
			});
		});

		return dfd;
	},
	getCategoryParents: function() {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shopcategories_endpoint + '/parents').then(function(cats) {
				dfd.resolve(cats);
			});
		});

		return dfd;
	}
};
