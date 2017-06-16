var BaseModal = function() { };
BaseModal.prototype = {
  create: function(html) {
    var self = this;
    self.modal = $(html);
    $(Constants.gameSelector).append(self.modal);
    $(self.modal).find('.header .close').click(function() {
      $(self.modal).toggleClass('md-show');
    });
  },
  toggle() {
    $(this.modal).toggleClass('md-show');
  },
  hide() {
    $(this.modal).hide();
  },
  remove() {
    $(this.modal).remove();
  }
};
