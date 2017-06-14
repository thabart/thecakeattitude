var ProfileMenuFloating = function() { };
ProfileMenuFloating.prototype = {
  init: function() {
  	var self = this,
  		editYourAccount = $.i18n('editYourAccount'),
      disconnect = $.i18n('disconnect'),
  		welcome = $.i18n('welcome').replace('{0}', 'th');
  	self.floatingMenu = $("<div class='floating-options-top-left' id='account-floating'>"+
  		"<ul class='floating-options'>"+
  			"<li class='dark-blue floating-option profile' id='map-option'><i class='fa fa-user'></i></li>"+
  		"</ul>"+
  		"<div class='tooltip tooltip-top'>"+
  			"<div class='tooltip-content'>"+
  				"<span>"+welcome+"</span>"+
  				"<ul class='no-style'>"+
  					"<li><button class='action-btn lg-action-btn'>"+editYourAccount+"</button></li>"+
  					"<li><button class='action-btn lg-action-btn'>"+disconnect+"</button></li>"+
  				"</ul>"+
  			"</div>"+
  		"</div>"+
  	"</div>");
  	self.floatingMenu.find('.profile').click(function() {
  		$(self.floatingMenu).find('.tooltip').toggle();
  	});
  	$(self.floatingMenu).find('.tooltip').hide();
    $(Constants.gameSelector).append(self.floatingMenu);
  },
  remove: function() {
    $(this.floatingMenu).remove();
  }
};
