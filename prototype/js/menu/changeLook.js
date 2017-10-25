game.ChangeLook = me.Object.extend({
  init: function() {
    this.changeLookBox =$("<div class='blue-modal changelook-box'>"+
      "<div class='top'>"+
        "<span data-i18n='change_look_title'></span> <div class='close'></div>"+
      "</div>"+
      "<div class='body'>"+
        "<div>"+
          // HEADER.
          "<div class='header'>"+
            "<div class='title'><h2>THABART</h2></div>"+
            "<ul class='no-style tabs gray menu'>"+
              "<li class='active'><span class='player-body'></span></li>"+
              "<li><span class='player-head'></span></li>"+
              "<li><span class='player-shirt'></span></li>"+
              "<li><span class='player-jean'></span></li>"+
            "</ul>"+
          "</div>"+
          // CONTENT.
          "<div class='player-body-tab' style='padding: 10px;'>"+
            "<div class='col-8'>"+
              "<ul class='no-style sex'>"+
                "<li><span class='sex-mal active'></span> <span data-i18n='mal'></span></li>"+
                "<li><span class='sex-femal'></span> <span data-i18n='femal'></span></li>"+
              "</ul>"+
              // CHOOSE HEAD.
              "<div>"+
                "<ul class='no-style items-selector'>"+
                  "<li><span class='img' style='background: url(resources/players/heads/hd180.png) -5px -13px no-repeat;'></span></li>"+
                  "<li><span class='img' style='background: url(resources/players/heads/hd185.png) -5px -13px no-repeat;'></span></li>"+
                  "<li class='active'><span class='img' style='background: url(resources/players/heads/hd190.png) -5px -13px no-repeat;'></span></li>"+
                "</ul>"+
              "</div>"+
              // CHOOSE COLOR.
              "<div>"+
              "</div>"+
            "</div>"+
            "<div class='col-4'>"+

            "</div>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='bottom'>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.changeLookBox);
    $(this.changeLookBox).draggable({ "handle": ".top" });
    this.addListeners();
    // $(this.changeLookBox).hide();
  },
  addListeners: function() {
    this.listenClose();
  },
  listenClose: function() {
    var self = this;
    $(this.changeLookBox).find('.close').click(function() {
      $(self.changeLookBox).hide();
    });
  },
  toggle: function() {
    $(this.changeLookBox).toggle();
  }
});
