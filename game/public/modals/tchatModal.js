var TchatModal = function() {};
TchatModal.prototype = {
  init: function() {
    var self = this;
    self.messages = [];
    self.modal = $("<div class='game-tchat'>" +
      "<div class='header'>" +
        "<i class='fa fa-comments'></i><span class='title'>Tchat</span>" +
        "<div class='options'>"+
          "<button class='option minify'><i class='fa fa-minus'></i></button>"+
          "<button class='option close'><i class='fa fa-times'></i></button>"+
        "</div>"+
      "</div>"+
      "<div class='content'>" +
        "<div class='body'>" +
          "<ul class='messages'>"+
          "</ul>" +
        "</div>" +
        "<div class='footer'>"+
          "<form class='sendMessageForm'>" +
            "<input type='text' class='input' />" +
            "<button class='action-btn'>Send</button>" +
          "</form>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(Constants.gameSelector).append(self.modal);
    $(self.modal).draggable({ handle: '.header' });
    $(self.modal).resizable();
    $(self.modal).find('.close').click(function() {
      $(self.modal).toggle();
    });
    $(self.modal).find('.minify').click(function() {
      $(self.modal).find('.content').slideToggle();
      var icon = $(self).find('.fa');
      if ($(icon).hasClass('fa-minus')) {
        $(icon).removeClass('fa-minus');
        $(icon).addClass('fa-plus');
      } else {
        $(icon).removeClass('fa-plus');
        $(icon).addClass('fa-minus');
      }
    });
    $(self.modal).find('.input').keypress(function() {
      console.log('coucou');
    });
    $(self.modal).find('.sendMessageForm').submit(function(e) {
      e.preventDefault();
      var text = $(self.modal).find('.message').val();
      $(self).trigger('message', text);
      self.messages.push({
        pseudo: 'Name',
        content: text,
        type: 'me'
      });
      self.refresh();
    });
  },
  toggle() {
    $(this.modal).toggle();
  },
  refresh() {
    var self = this;
    var ul = $(self.modal).find('.messages');
    $(ul).empty();
    self.messages.forEach(function(message) {
      var cl = message.type === 'me' ? 'my-message' : 'external-message';
      var li = "<li class='"+cl+"'><b>"+message.pseudo+"</b> "+message.content+"</li>";
      $(ul).append(li);
    });
  }
};
