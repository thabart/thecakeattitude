game.ChangeLook = me.Object.extend({
  init: function() {
    this.changeLookBox =$("<div class='blue-modal changelook-box'>"+
      "<div class='top'>"+
        "<span data-i18n='change_look_title'></span> <div class='close'></div>"+
      "</div>"+
      "<div class='body' style='width: 500px; padding: 0px 1px 0px 1px;'>"+
        "<div>"+
          // HEADER.
          "<div style='background-color: rgb(14,63,82);'>"+
            "<div style='color: white; text-align: center; height: 100px; line-height: 80px;'><h2 style='margin: 0; padding: 0;'>THABART</h2></div>"+
            "<ul class='no-style tabs gray' style='padding-left: 5px; height: 37px;'>"+
              "<li class='active'><span class='player-body' style='display: block;'></span></li>"+
              "<li><span class='player-head' style='display: block;'></span></li>"+
              "<li><span class='player-shirt' style='display: block;'></span></li>"+
              "<li><span class='player-jean' style='display: block;'></span></li>"+
            "</ul>"+
          "</div>"+
          // CONTENT.
          "<div class='player-body-tab' style='padding: 10px;'>"+
            "<div class='col-8'>"+
              "<ul class='no-style sex'>"+
                "<li style='display: inline-block;'><span class='sex-mal active' style='display: inline-block;'></span> <span data-i18n='mal'></span></li>"+
                "<li style='display: inline-block;'><span class='sex-femal' style='display: inline-block;'></span> <span data-i18n='femal'></span></li>"+
              "</ul>"+
              // CHOOSE HEAD.
              "<div>"+
                "<ul class='no-style'>"+
                  "<li style='display: inline-block;'><span style='display: block; background: url(resources/players/heads/hd180.png) -5px -13px no-repeat; width:58px; height: 58px;'></span></li>"+
                  "<li style='display: inline-block;'><span style='display: block; background: url(resources/players/heads/hd185.png) -5px -13px no-repeat; width:58px; height: 58px;'></span></li>"+
                  "<li style='display: inline-block;'><span style='display: block; background: url(resources/players/heads/hd190.png) -5px -13px no-repeat; width:58px; height: 58px;'></span></li>"+
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
