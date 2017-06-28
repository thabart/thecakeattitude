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
	removeShop: function(accessToken, shopId, commonId) { // Remove shop.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/' + shopId, {
	      method: 'DELETE',
	      headers: {
	        'Authorization': 'Bearer ' + accessToken,
					'CommonId': commonId
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
	addShop: function(accessToken, content, commonId) { // Add a shop.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint, {
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
	},
	getShop: function(shopId) { // Get a shop.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.get(conf.shops_endpoint + '/' + shopId).then(function(r) {
				dfd.resolve(r);
			}).fail(function(e) {
				dfd.reject(e);
			});
		}).fail(function(e) {
			dfd.reject(e);
		});

		return dfd;
	},
	searchComments: function(shopId, content) { // Search comments.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/' + shopId + '/comments', {
	      method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(content)
			}).then(function(r) {
				dfd.resolve(r);
			}).fail(function() {
				dfd.reject(e);
			});
		}).fail(function(e) {
			dfd.reject(e);
		});

		return dfd;
	},
	updateShop: function(shopId, content, accessToken, commonId) { // Update the shop.
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
			$.ajax(conf.shops_endpoint + '/' + shopId, {
	      method: 'PUT',
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
