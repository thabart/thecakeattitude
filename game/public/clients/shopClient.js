var ShopClient = {
	searchShops: function(content) { // Search shops.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
      $.ajax(conf.shops_endpoint + '/.search', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(content)
      }).then(function (r) {
				dfd.resolve(r);
      }).fail(function (e) {
				if (e.status === 404) dfd.resolve({_embedded: []});
        dfd.reject(e);
      });
		}).fail(function(e) {
			dfd.reject(e);
		});

		return dfd;
	},
	getMineShops: function(accessToken) { // Get shops of current user.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/me', {
	      method: 'GET',
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
	},
	removeShop: function(accessToken, shopId) { // Remove shop.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/' + shopId, {
	      method: 'DELETE',
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
