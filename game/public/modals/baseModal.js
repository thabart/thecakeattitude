var BaseModal = function() { };
BaseModal.prototype = {
  create: function(html) {
    var self = this;
    self.modal = $(html);
    $(Constants.gameSelector).append(self.modal);
    $(self.modal).find('.close').click(function() {
      $(self.modal).toggle();
    });
  },
  toggle() {
    $(this.modal).toggle();
  }
};
