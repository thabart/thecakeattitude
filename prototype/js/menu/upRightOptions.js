game.UpRightOptions = me.Object.extend({
  init: function() {
      this.options = $("<div class='up_right_options'>"+
        "<span class='help'>Help</span>"+
        "<span class='quit'></span>"+
        "<span class='settings'></span>"+
      "</div>");
      $(document.body).append(this.options);
  }
});
