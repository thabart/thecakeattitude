game.Services = game.Services || {};
game.Services.ShopsService = {
	search: function(content) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/.search', {
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
	getAll: function() {
		var dfd = jQuery.Deferred();		
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shops_endpoint).then(function(r) {
				dfd.resolve(r);
			}).fail(function(e) {
				dfd.reject(e);
			});
		}).fail(function(e) {
			dfd.reject(e);
		});
	    return dfd;
	},
	get: function(id) {
		var dfd = jQuery.Deferred();		
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shops_endpoint + '/' + id).then(function(r) {
				dfd.resolve(r);
			}).fail(function(e) {
				dfd.reject(e);
			});
		}).fail(function(e) {
			dfd.reject(e);
		});
	    return dfd;		
	},
	update: function(id, content) {
		var dfd = jQuery.Deferred();
		var accessToken = sessionStorage.getItem(Constants.sessionName);
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/' + id, {
				method: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify(content),
		      	headers: {
		        	'Authorization': 'Bearer ' + accessToken
		      	}
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