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
        dfd.resolve(r);
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
  },
  getUserInformation: function(accessToken) { // Get user information.
    var dfd = jQuery.Deferred();
    $.get(Constants.openIdWellKnownConfiguration).then(function(configuration) {
      $.ajax(configuration.userinfo_endpoint, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }).then(function(r) {
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
