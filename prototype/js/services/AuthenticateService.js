game.Services = game.Services || {};
game.Services.AuthenticateService = {
	authenticate: function(login, password) {
		var dfd = jQuery.Deferred();
	    var self = this;
		$.ajax({
			url: '/login',
	        data: JSON.stringify({ 'login': login, 'password': password }),
	        method: 'POST',
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json'
	    }).then(function(r) {
	    	dfd.resolve(r);
	    }).fail(function() {
	    	dfd.reject();
	    });
	    return dfd;
	}
};