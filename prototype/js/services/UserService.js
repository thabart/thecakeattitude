game.Services = game.Services || {};
game.Services.UserService = {
	getClaims: function(accessToken) {
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
	}
};