var UserClient = {
  updateClaims:  function(content, accessToken) { // Update the claims.
		var dfd = jQuery.Deferred();
    $.ajax(Constants.userClaims, {
      data: JSON.stringify(content),
      method: 'PUT',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(function() {
      dfd.resolve();
    }).fail(function() {
      dfd.reject();
    });
    return dfd;
  },
  getClaims: function(accessToken) { // Get claims.
		var dfd = jQuery.Deferred();
    $.ajax(Constants.userClaims, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    }).then(function(r) {
      dfd.resolve(r);
    }).fail(function(e) {
      dfd.reject(e);
    });
    return dfd;
  },
  getPublicClaims: function(sub) { // Get public claims.
    var dfd = jQuery.Deferred();
    $.get(Constants.userPublicClaims.replace('{id}', sub)).then(function(r) {
      dfd.resolve(r);
    }).fail(function(e) {
      dfd.reject(e);
    });

    return dfd;
  }
};
