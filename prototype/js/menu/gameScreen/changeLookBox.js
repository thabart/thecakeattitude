game.Menu = game.Menu || {};
game.Menu.ChangeLookBox = me.Object.extend({
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
      { id: "600", url: "resources/players/heads/female/hd600.png", sex: "f" },
      { id: "605", url: "resources/players/heads/female/hd605.png", sex: "f" },
      { id: "610", url: "resources/players/heads/female/hd610.png", sex: "f" },
      { id: "615", url: "resources/players/heads/female/hd615.png", sex: "f" },
      { id: "620", url: "resources/players/heads/female/hd620.png", sex: "f" },
      { id: "625", url: "resources/players/heads/female/hd625.png", sex: "f" },
      { id: "626", url: "resources/players/heads/female/hd626.png", sex: "f" },
      { id: "627", url: "resources/players/heads/female/hd627.png", sex: "f" },
      { id: "628", url: "resources/players/heads/female/hd628.png", sex: "f" }
    ];
    var hairCuts = [
      { id: "100", url: "resources/players/haircuts/mal/hr100.png", sex: "m" },
      { id: "105", url: "resources/players/haircuts/mal/hr105.png", sex: "m" },
      { id: "110", url: "resources/players/haircuts/mal/hr110.png", sex: "m" },
      { id: "115", url: "resources/players/haircuts/mal/hr115.png", sex: "m" }
    ];
    var hairCutColors = [
      { id: "31", color: "rgb(255, 214, 169)" },
      { id: "32", color: "rgb(223, 166, 111)" },
      { id: "33", color: "rgb(209, 128, 58)" },
      { id: "34", color: "rgb(255, 238, 185)" },
      { id: "35", color: "rgb(246, 208, 89)" },
      { id: "36", color: "rgb(242, 177, 29)" },
      { id: "37", color: "rgb(154, 93, 46)" },
      { id: "38", color: "rgb(172, 83, 0)" },
      { id: "39", color: "rgb(120, 52, 0)" },
      { id: "40", color: "rgb(216, 211, 217)" }
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
    var menHairCutsSelector = $("<ul class='no-style items-selector haircuts-selector men-haircuts-selector' style='display: none;'></ul>");
    var womenHairCutsSelector = $("<ul class='no-style items-selector haircuts-selector women-haircuts-selector' style='display: none;'></ul>");
    var headColorsSelector = $("<ul class='no-style colors-selector head-colors-selector'></ul>");
    var hairCutColorSelector = $("<ul class='no-style colors-selector haircut-colors-selector'></ul>");
    heads.forEach(function(head) {
      var selector = head.sex === 'm' ? menHeadsSelector : womenHeadsSelector;
      selector.append("<li data-id='"+head.id+"'><span class='img' style='background: url("+head.url+") -5px -13px no-repeat;'></span></li>");
    });
    headColors.forEach(function(headColor) {
      headColorsSelector.append("<li data-id='"+headColor.id+"'><span class='color' style='background-color: "+headColor.color+";'></span></li>");
    });
    hairCuts.forEach(function(hairCut) {
      var selector = hairCut.sex === 'm' ? menHairCutsSelector : womenHairCutsSelector;
      selector.append("<li data-id='"+hairCut.id+"'><span class='img' style='background: url("+hairCut.url+") -5px -13px no-repeat;'></span></li>");
    });
    hairCutColors.forEach(function(hairCutColor) {
      hairCutColorSelector.append("<li data-id='"+hairCutColor.id+"'><span class='color' style='background-color: "+hairCutColor.color+";'></span></li>");
    });
    this.changeLookBox =$("<div class='modal blue lg changelook-box'>"+
      "<div class='container'>"+
        "<div class='content'>"+
          "<div class='top'>"+
            "<span data-i18n='change_look_title'></span> <div class='close'></div>"+
          "</div>"+
          "<div class='body'>"+          
              // HEADER.
              "<div class='header'>"+
                "<div class='title'><h2>THABART</h2></div>"+
                "<ul class='no-style tabs gray menu'>"+
                  "<li data-target='.player-body-tab'><span class='player-body'></span></li>"+
                  "<li data-target='.player-head-tab'><span class='player-head'></span></li>"+
                  "<li data-target='.player-shirt-tab'><span class='player-shirt'></span></li>"+
                  "<li data-target='.player-jean-tab'><span class='player-jean'></span></li>"+
                "</ul>"+
              "</div>"+
              // CONTENT.
              "<div style='padding: 10px;'>"+
                "<div class='col-8 player-body-tab tab'>"+ // Player BODY.
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
                "<div class='col-8 player-head-tab tab'>"+
                  "<div>"+
                    menHairCutsSelector[0].outerHTML+
                  "</div>"+
                  "<div>"+
                    hairCutColorSelector[0].outerHTML+
                  "</div>"+
                "</div>"+ // Player HEAD.
                "<div class='col-8 player-shirt-tab tab'></div>"+ // Player SHIRT.
                "<div class='col-8 player-jean-tab tab'></div>"+ // Player JEAN.
                "<div class='col-4'>"+
                  "<div class='player-image'></div>"+
                  "<button class='button button-gray change-look' data-i18n='ok'></button>"+
                "</div>"+
              "</div>"+
          "</div>"+
          "<div class='bottom'>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(document.body).append(this.changeLookBox);
    $(this.changeLookBox).i18n();
    $(this.changeLookBox).hide();
    $(this.changeLookBox).draggable({ "handle": ".top" });
    this.addListeners();
    $(this.changeLookBox).find('.tabs li:first-child').click();
    $(this.changeLookBox).find('.sex-selector li[data-sex="m"]').click();
  },
  addListeners: function() {
    this.listenClose();
    this.listenTabs();
    this.listenSelectors();
  },
  listenClose: function() { // Listen close button.
    var self = this;
    $(this.changeLookBox).find('.close').click(function() {
      $(self.changeLookBox).hide();
    });
  },
  listenTabs: function() { // Change active tab.
    var self = this;
    $(self.changeLookBox).find('.tabs li').click(function() {
      var target = $(this).data('target');
      $(self.changeLookBox).find('.tabs li').removeClass('active');
      $(self.changeLookBox).find('.tab').hide();
      $(self.changeLookBox).find(target).show();
      $(this).addClass('active');
    });
  },
  listenSelectors: function() { // Listen all the selectors.
    var self = this;
    $(self.changeLookBox).find('.sex-selector li').click(function() {
      $(self.changeLookBox).find('.heads-selector').hide();
      $(self.changeLookBox).find('.sex-selector li').removeClass('active');
      var sex = $(this).data('sex');
      var headsSelector = sex === 'f' ? '.women-heads-selector' : '.men-heads-selector';
      var hairCutsSelector = sex === 'f' ? '.women-haircuts-selector' : '.men-haircuts-selector';
      $(self.changeLookBox).find(headsSelector).show();
      $(self.changeLookBox).find(hairCutsSelector).show();
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
    $(self.changeLookBox).find('.haircuts-selector li').click(function() {
      $(self.changeLookBox).find('.haircuts-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.haircut-colors-selector li').click(function() {
      $(self.changeLookBox).find('.haircut-colors-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.change-look').click(function() {
      var figure = self.getUserFigure();
      $(self.changeLookBox).find('.change-look').prop('disabled', true);
      var currentPlayer = game.Stores.UserStore.getCurrentUser();
      game.Services.PlayerService.addSprite(figure).then(function(r) {
        me.loader.load({ name: currentPlayer.pseudo, src: r.sprite, type: 'image' }, function() {
          game.Stores.UserStore.updateCurrentUser({ figure: figure });
          $(self.changeLookBox).find('.change-look').prop('disabled', false);
        });
      }).catch(function() {
        $(self.changeLookBox).find('.change-look').prop('disabled', false);
      });
    });
  },
  updateUserImage: function() { // Update the user image.
    var self = this;
    var playerImage = $(self.changeLookBox).find('.player-image');
    playerImage.empty();
    playerImage.append("<img src='"+self.getUserUrl()+"' />")
  },
  getUserUrl: function() { // Get the user url.
    var figure = this.getUserFigure();
    // http://labs.habox.org/avatarimage.php?figure=&action=std&gesture=std&direction=4&head_direction=4&size=n&img_format=png
    return "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction=3&head_direction=3&action=std&gesture=std&size=n&frame=0&img_format=png"
  },
  getUserFigure: function() { // Get the user figure.
    var self = this;
    var headId = $(self.changeLookBox).find('.heads-selector li.active').data('id');
    var headColorId = $(self.changeLookBox).find('.head-colors-selector li.active').data('id');
    var hairCutId = $(self.changeLookBox).find('.haircuts-selector li.active').data('id');
    var hairCutColorId = $(self.changeLookBox).find('.haircut-colors-selector li.active').data('id');
    return "hd-"+headId+"-"+headColorId+".hr-"+hairCutId+"-"+hairCutColorId+".ch-255-66.lg-280-110.sh-305-62";
  },
  toggle: function() { // Toggle the box.
    $(this.changeLookBox).toggle();
  },
  destroy: function() {
    if (this.changeLookBox) $(this.changeLookBox).remove();
  }
});
