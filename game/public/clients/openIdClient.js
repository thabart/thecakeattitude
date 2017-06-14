var OpenIdClient = {
  postToken: function(content) { // Post token to token endpoint.
		var dfd = jQuery.Deferred();
    var self = this;
    $.get(Constants.openIdWellKnownConfiguration).then(function(configuration) {
      $.ajax(configuration.token_endpoint, {
        data: content,
        method: 'POST',
        dataType: 'json'
      }).then(function(r) {
        self.introspect({
          client_id : Constants.ClientId,
          client_secret : Constants.ClientSecret,
          token : r.access_token,
          token_type_hint : 'access_token'
        }).then(function(r) {
          dfd.resolve(r);
        }).fail(function() {
          dfd.reject();
        });
      }).fail(function() {
        dfd.reject();
      });
    }).fail(function() {
      dfd.fail();
    });
    return dfd;
  },
  introspect: function(content) { // Introspect identity token or access token.
		var dfd = jQuery.Deferred();
    $.get(Constants.openIdWellKnownConfiguration).then(function(configuration) {
      $.ajax(configuration.introspection_endpoint, {
        data: content,
        method: 'POST',
        dataType: 'json'
      }).then(function(r) {
        if (!r.active) dfd.reject();
        dfd.resolve(r);
      }).fail(function() {
        dfd.reject();
      });
    }).fail(function() {
      dfd.reject();
    });

    return dfd;
  }
};
