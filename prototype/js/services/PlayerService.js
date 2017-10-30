game.Services = game.Services || {};
game.Services.PlayerService = {
	addSprite: function(figure) {
		var dfd = jQuery.Deferred();
	    var self = this;
		$.ajax({
			url: '/player',
	        data: JSON.stringify({ 'figure': figure }),
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