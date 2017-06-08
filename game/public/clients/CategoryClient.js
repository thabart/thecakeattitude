var CategoryClient = {
	getCategory: function(id) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shopcategories_endpoint).then(function(cats) {
				dfd.resolve(cats);
			});
		});
		
		return dfd;
	}
};
