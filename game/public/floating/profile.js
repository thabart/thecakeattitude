var ProfileMenuFloating = function() { };
ProfileMenuFloating.prototype = {
  init: function() {
    var user = GameStateStore.getUser();
    var name = user.name || $.i18n('unknown');
  	var self = this,
  		editYourAccount = $.i18n('editYourAccount'),
      disconnect = $.i18n('disconnect'),
  		welcome = $.i18n('welcome').replace('{0}', name);
    self.editProfileModal = new EditProfileModal(); // Add edit profile modal window.
    self.editProfileModal.init();
  	self.floatingMenu = $("<div class='floating-options-top-left' id='account-floating'>"+
  		"<ul class='floating-options'>"+
  			"<li class='dark-blue floating-option profile' id='map-option'><i class='fa fa-user'></i></li>"+
  		"</ul>"+
  		"<div class='tooltip tooltip-top'>"+
  			"<div class='tooltip-content'>"+
  				"<span>"+welcome+"</span>"+
  				"<ul class='no-style'>"+
  					"<li><button class='action-btn lg-action-btn edit-profile'>"+editYourAccount+"</button></li>"+
  					"<li><button class='action-btn lg-action-btn disconnect'>"+disconnect+"</button></li>"+
  				"</ul>"+
  			"</div>"+
  		"</div>"+
  	"</div>");
  	self.floatingMenu.find('.profile').click(function() {
  		$(self.floatingMenu).find('.tooltip').toggle();
  	});
    self.floatingMenu.find('.edit-profile').click(function() {
  		$(self.floatingMenu).find('.tooltip').toggle();
      self.editProfileModal.show();
    });
  	$(self.floatingMenu).find('.tooltip').hide();
    $(self.floatingMenu).find('.disconnect').click(function() {
      GameStateStore.setUser(null);
      sessionStorage.removeItem(Constants.sessionName);
      $(self).trigger('disconnect');
    });
    $(Constants.gameSelector).append(self.floatingMenu);
  },
  remove: function() {
    $(this.floatingMenu).remove();
    this.editProfileModal.remove();
  }
};
