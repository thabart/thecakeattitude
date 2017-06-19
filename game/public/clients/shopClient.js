var ShopClient = {
	searchShops: function(content) {
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
        dfd.fail(e);
      });
		});

		return dfd;
	},
	getMineShops: function(accessToken) {
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
				dfd.fail(e);
			});
		});

		return dfd;
	}
};
