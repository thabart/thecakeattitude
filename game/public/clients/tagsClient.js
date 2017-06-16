var TagsClient = {
  getAll: function() {
  	var dfd = jQuery.Deferred();
  	$.get(Constants.apiConfigurationUrl).then(function(conf) {
  		$.get(conf.tags_endpoint).then(function(tags) {
  			dfd.resolve(tags);
  		});
  	});

  	return dfd;
  },
  search: function(content) {
		var dfd = jQuery.Deferred();
		$.get(Constants.apiConfigurationUrl).then(function(conf) {
      $.ajax(conf.tags_endpoint + '/.search', {
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(content)
      }).then(function (r) {
				dfd.resolve(r);
      }).fail(function (e) {
        dfd.reject(e);
      });
		});

		return dfd;
  }
};
