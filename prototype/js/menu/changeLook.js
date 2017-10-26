game.ChangeLook = me.Object.extend({
  init: function() {
    var heads = [
      { id: "180", url: "resources/players/heads/man/hd180.png", sex: "m" },
      { id: "185", url: "resources/players/heads/man/hd180.png", sex: "m" },
      { id: "190", url: "resources/players/heads/man/hd185.png", sex: "m" },
      { id: "190", url: "resources/players/heads/man/hd190.png", sex: "m" },
      { id: "195", url: "resources/players/heads/man/hd195.png", sex: "m" },
      { id: "200", url: "resources/players/heads/man/hd200.png", sex: "m" },
      { id: "205", url: "resources/players/heads/man/hd205.png", sex: "m" },
      { id: "206", url: "resources/players/heads/man/hd206.png", sex: "m" },
      { id: "207", url: "resources/players/heads/man/hd207.png", sex: "m" },
      { id: "208", url: "resources/players/heads/man/hd208.png", sex: "m" },
      { id: "209", url: "resources/players/heads/man/hd209.png", sex: "m" },
      { id: "600", url: "resources/players/heads/female/hd600.png", sex: "f" }
    ];
    var headColors = [
      { id: "1", color: "rgb(211,188,177)" },
      { id: "2", color: "rgb(221,189,166)" },
      { id: "3", color: "rgb(221,189,166)" },
      { id: "4", color: "rgb(174, 119, 72)" },
      { id: "5", color: "rgb(148, 92, 47)" },
      { id: "7", color: "rgb(255, 198, 128)" },
      { id: "8", color: "rgb(244, 172, 84)" },
      { id: "9", color: "rgb(220, 155, 76)" },
      { id: "10", color: "rgb(255, 219, 193)" },
      { id: "11", color: "rgb(255, 182, 150)" }
    ];
    var menHeadsSelector = $("<ul class='no-style items-selector heads-selector men-heads-selector' style='display: none;'></ul>");
    var womenHeadsSelector = $("<ul class='no-style items-selector heads-selector women-heads-selector' style='display: none;'></ul>");
    var headColorsSelector = $("<ul class='no-style colors-selector head-colors-selector'></ul>");
    heads.forEach(function(head) {
      var selector = head.sex === 'm' ? menHeadsSelector : womenHeadsSelector;
      selector.append("<li data-id='"+head.id+"'><span class='img' style='background: url("+head.url+") -5px -13px no-repeat;'></span></li>");
    });
    headColors.forEach(function(headColor) {
      headColorsSelector.append("<li data-id='"+headColor.id+"'><span class='color' style='background-color: "+headColor.color+";'></span></li>");
    });
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
              "<ul class='no-style sex-selector'>"+
                "<li data-sex='m'><span class='sex-mal'></span> <span data-i18n='mal'></span></li>"+
                "<li data-sex='f'><span class='sex-femal'></span> <span data-i18n='femal'></span></li>"+
              "</ul>"+
              // CHOOSE HEAD.
              "<div>"+
                menHeadsSelector[0].outerHTML +
                womenHeadsSelector[0].outerHTML +
              "</div>"+
              // CHOOSE COLOR.
              "<div>"+
                headColorsSelector[0].outerHTML +
              "</div>"+
            "</div>"+
            "<div class='col-4'>"+
              "<div class='player-image'></div>"+
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
    $(this.changeLookBox).find('.sex-selector li[data-sex="m"]').click();
  },
  addListeners: function() {
    this.listenClose();
    this.listenBodyTab();
  },
  listenClose: function() {
    var self = this;
    $(this.changeLookBox).find('.close').click(function() {
      $(self.changeLookBox).hide();
    });
  },
  listenBodyTab: function() {
    var self = this;
    $(self.changeLookBox).find('.sex-selector li').click(function() {
      $(self.changeLookBox).find('.heads-selector').hide();
      $(self.changeLookBox).find('.sex-selector li').removeClass('active');
      var sex = $(this).data('sex');
      var selector = sex === 'f' ? '.women-heads-selector' : '.men-heads-selector';
      $(self.changeLookBox).find(selector).show();
      $(this).addClass('active');
    });
    $(self.changeLookBox).find('.heads-selector li').click(function() {
      $(self.changeLookBox).find('.heads-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.head-colors-selector li').click(function() {
      $(self.changeLookBox).find('.head-colors-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
  },
  updateUserImage: function() {
    var self = this;
    var playerImage = $(self.changeLookBox).find('.player-image');
    playerImage.empty();
    playerImage.append("<img src='"+self.getUserUrl()+"' />")
  },
  getUserUrl: function() {
    var self = this;
    var headId = $(self.changeLookBox).find('.heads-selector li.active').data('id');
    var headColorId = $(self.changeLookBox).find('.head-colors-selector li.active').data('id');
    // http://labs.habox.org/avatarimage.php?figure=&action=std&gesture=std&direction=4&head_direction=4&size=n&img_format=png
    return "https://www.habbo.de/habbo-imaging/avatarimage?figure=hd-"+headId+"-"+headColorId+".hr-828-61.ha-1012-110.ch-255-66.lg-280-110.sh-305-62&direction=3&head_direction=3&action=std&gesture=std&size=n&frame=0&img_format=png"
  },
  toggle: function() {
    $(this.changeLookBox).toggle();
  }
});
