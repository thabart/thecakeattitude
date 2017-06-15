var BackMenuFloating = function() { };
BackMenuFloating.prototype = {
  init: function() {
  	var self = this;
  	self.floatingMenu = $("<ul class='floating-options floating-options-bottom-left' id='back-floating'>"+
  		"<li class='orange floating-option back'><i class='fa fa-chevron-left'></i></li>"+
  	"</ul>");
    $(Constants.gameSelector).append(self.floatingMenu);
  	$(self.floatingMenu).find('.back').click(function() {
      $(self).trigger('back');
  	});
  },
  remove: function() {
    $(this.floatingMenu).remove();
  }
};
