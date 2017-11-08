game.Services = game.Services || {};
game.Services.GameEntitiesService = {
	getAll: function(content) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.gameentities_endpoint).then(function(r) {
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
