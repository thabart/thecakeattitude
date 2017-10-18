game.ChatForm = me.Object.extend({
  init: function() {
      var self = this;
      self.chatForm = $("<form id='chat-input-form'>"+
        "<div id='chat-input-form-left'>"+
          "<i class='icon chatbubbles'></i>"+
        "</div>"+
        "<input id='chat-input' placeholder='Type here to chat...' >"+
      "</form>");
      $(document.body).append(self.chatForm);
      this.addListeners();
  },
  addListeners: function() {
    var self = this;
    $(self.chatForm).submit(function(e) {
      e.preventDefault();
      var message = $(self.chatForm).find('input').val();
      ShopStore.displayMessage(message);
      $(self.chatForm).find('input').val('');
    });
  }
});
