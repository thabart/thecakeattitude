game.Menu = game.Menu || {};
game.Menu.ChangeLookBox = me.Object.extend({
  init: function() {
    var player = game.Stores.UserStore.getCurrentUser();
    var playersStyle = me.loader.getJSON("players");
    var menHeadsSelector = $("<ul class='no-style items-selector heads-selector men-heads-selector' style='display: none;'></ul>");
    var womenHeadsSelector = $("<ul class='no-style items-selector heads-selector women-heads-selector' style='display: none;'></ul>");
    var headColorsSelector = $("<ul class='no-style colors-selector head-colors-selector'></ul>");

    var menHairCutsSelector = $("<ul class='no-style items-selector haircuts-selector men-haircuts-selector' style='display: none;'><li data-id='-1'><span class='img' style='background: url(/img/icons/icon_cross.gif) no-repeat; margin: 9px 0px 0px 10px;'></span></li></ul>");
    var womenHairCutsSelector = $("<ul class='no-style items-selector haircuts-selector women-haircuts-selector' style='display: none;'><li data-id='-1'><span class='img' style='background: url(/img/icons/icon_cross.gif) no-repeat; margin: 9px 0px 0px 10px;'></span></li></ul>");
    var hairCutColorSelector = $("<ul class='no-style colors-selector haircut-colors-selector'></ul>");

    var menUppersSelector = $("<ul class='no-style items-selector uppers-selector men-uppers-selector' style='display: none;'><li data-id='-1'><span class='img' style='background: url(/img/icons/icon_cross.gif) no-repeat; margin: 9px 0px 0px 10px;'></span></li></ul>");
    var womenUppersSelector = $("<ul class='no-style items-selector uppers-selector women-uppers-selector' style='display: none;'><li data-id='-1'><span class='img' style='background: url(/img/icons/icon_cross.gif) no-repeat; margin: 9px 0px 0px 10px;'></span></li></ul>");
    var uppersColorsSelector = $("<ul class='no-style colors-selector upper-colors-selector'></ul>");

    var menLowersSelector = $("<ul class='no-style items-selector lowers-selector men-lowers-selector' style='display: none;'></ul>");
    var womenLowersSelector = $("<ul class='no-style items-selector lowers-selector women-lowers-selector' style='display: none;'></ul>");
    var lowersColorsSelector = $("<ul class='no-style colors-selector lower-colors-selector'></ul>");
    playersStyle.heads.content.forEach(function(head) {
      var selector = head.sex === 'm' ? menHeadsSelector : womenHeadsSelector;
      selector.append("<li data-id='"+head.id+"'><span class='img' style='background: url("+head.url+") -5px -13px no-repeat;'></span></li>");
    });
    playersStyle.heads.colors.forEach(function(headColor) {
      headColorsSelector.append("<li data-id='"+headColor.id+"'><span class='color' style='background-color: "+headColor.color+";'></span></li>");
    });
    playersStyle.hairCuts.content.forEach(function(hairCut) {
      var selector = hairCut.sex === 'm' ? menHairCutsSelector : womenHairCutsSelector;
      selector.append("<li data-id='"+hairCut.id+"'><span class='img' style='background: url("+hairCut.url+") -5px -13px no-repeat;'></span></li>");
    });
    playersStyle.hairCuts.colors.forEach(function(hairCutColor) {
      hairCutColorSelector.append("<li data-id='"+hairCutColor.id+"'><span class='color' style='background-color: "+hairCutColor.color+";'></span></li>");
    });
    playersStyle.uppers.content.forEach(function(upper) {
      var selector = upper.sex === 'm' ? menUppersSelector : womenUppersSelector;
      selector.append("<li data-id='"+upper.id+"'><span class='img' style='background: url("+upper.url+") -5px -39px no-repeat;'></span></li>");
    });
    playersStyle.uppers.colors.forEach(function(upperColor) {
      uppersColorsSelector.append("<li data-id='"+upperColor.id+"'><span class='color' style='background-color: "+upperColor.color+";'></span></li>");
    });
    playersStyle.lowers.content.forEach(function(lower) {
      var selector = lower.sex === 'm' ? menLowersSelector : womenLowersSelector;
      selector.append("<li data-id='"+lower.id+"'><span class='img' style='background: url("+lower.url+") -5px -59px no-repeat;'></span></li>");

    });
    playersStyle.lowers.colors.forEach(function(lowerColor) {
      lowersColorsSelector.append("<li data-id='"+lowerColor.id+"'><span class='color' style='background-color: "+lowerColor.color+";'></span></li>");
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
                  "<li data-target='.player-upper-tab'><span class='player-shirt'></span></li>"+
                  "<li data-target='.player-lower-tab'><span class='player-jean'></span></li>"+
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
                "<div class='col-8 player-head-tab tab'>"+ // Player HAIRCUT.
                  "<div>"+
                    menHairCutsSelector[0].outerHTML+
                    womenHairCutsSelector[0].outerHTML+
                  "</div>"+
                  "<div>"+
                    hairCutColorSelector[0].outerHTML+
                  "</div>"+
                "</div>"+
                "<div class='col-8 player-upper-tab tab'>"+ // Player UPPER.
                  "<div>"+
                    menUppersSelector[0].outerHTML+
                    womenUppersSelector[0].outerHTML+
                  "</div>"+
                  "<div>"+
                    uppersColorsSelector[0].outerHTML+
                  "</div>"+
                "</div>"+
                "<div class='col-8 player-lower-tab tab'>"+ // Player LOWER.
                  "<div>"+
                    menLowersSelector[0].outerHTML+
                    womenLowersSelector[0].outerHTML+
                  "</div>"+
                  "<div>"+
                    lowersColorsSelector[0].outerHTML+
                  "</div>"+
                "</div>"+ 
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
    var figure = this.parseFigure(player.figure);
    $(this.changeLookBox).find(".heads-selector li[data-id='"+figure.hd.id+"']").addClass('active');
    $(this.changeLookBox).find(".head-colors-selector "+ (figure.hd ? "li[data-id='"+figure.hd.color+"']" : "li:first-child")).addClass('active');
    $(this.changeLookBox).find(".haircuts-selector li[data-id='"+ (!figure.hr ? '-1' : figure.hr.id) +"']").addClass('active');
    $(this.changeLookBox).find(".haircut-colors-selector "+ (figure.hr ? "li[data-id='"+figure.hr.color+"']" : "li:first-child")).addClass('active');
    $(this.changeLookBox).find(".uppers-selector li[data-id='"+ (!figure.ch ? '-1' : figure.ch.id) +"']").addClass('active');
    $(this.changeLookBox).find(".upper-colors-selector "+ (figure.ch ? "li[data-id='"+figure.ch.color+"']" : "li:first-child")).addClass('active');
    $(this.changeLookBox).find(".lowers-selector li[data-id='"+ figure.lg.id +"']").addClass('active');
    $(this.changeLookBox).find(".lower-colors-selector "+ (figure.lg ? "li[data-id='"+figure.lg.color+"']" : "li:first-child")).addClass('active');
    var userUrl = this.getUserUrl();
    $(this.changeLookBox).find(".player-image").append("<img src='"+this.getUserUrl()+"' />");
    console.log(figure);
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
      $(self.changeLookBox).find('.haircuts-selector').hide();
      $(self.changeLookBox).find('.uppers-selector').hide();
      $(self.changeLookBox).find('.lowers-selector').hide();
      $(self.changeLookBox).find('.sex-selector li').removeClass('active');
      var sex = $(this).data('sex');
      var headsSelector = sex === 'f' ? '.women-heads-selector' : '.men-heads-selector';
      var hairCutsSelector = sex === 'f' ? '.women-haircuts-selector' : '.men-haircuts-selector';
      var upperSelector = sex === 'f' ? '.women-uppers-selector' : '.men-uppers-selector';
      var lowerSelector = sex === 'f' ? '.women-lowers-selector' : '.men-lowers-selector';
      $(self.changeLookBox).find(headsSelector).show();
      $(self.changeLookBox).find(hairCutsSelector).show();
      $(self.changeLookBox).find(upperSelector).show();
      $(self.changeLookBox).find(lowerSelector).show();
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
    $(self.changeLookBox).find('.lowers-selector li').click(function() {
      $(self.changeLookBox).find('.lowers-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.uppers-selector li').click(function() {
      $(self.changeLookBox).find('.uppers-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.haircut-colors-selector li').click(function() {
      $(self.changeLookBox).find('.haircut-colors-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.upper-colors-selector li').click(function() {
      $(self.changeLookBox).find('.upper-colors-selector li').removeClass('active');
      $(this).addClass('active');
      self.updateUserImage();
    });
    $(self.changeLookBox).find('.lower-colors-selector li').click(function() {
      $(self.changeLookBox).find('.lower-colors-selector li').removeClass('active');
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
    return "https://www.habbo.de/habbo-imaging/avatarimage?figure="+figure+"&direction=3&head_direction=3&action=std&gesture=std&size=n&frame=0&img_format=png"
  },
  getUserFigure: function() { // Get the user figure.
    var self = this;
    var headId = $(self.changeLookBox).find('.heads-selector li.active').data('id');
    var headColorId = $(self.changeLookBox).find('.head-colors-selector li.active').data('id');
    var hairCutId = $(self.changeLookBox).find('.haircuts-selector li.active').data('id');
    var hairCutColorId = $(self.changeLookBox).find('.haircut-colors-selector li.active').data('id');
    var upperId = $(self.changeLookBox).find('.uppers-selector li.active').data('id');
    var upperColorId = $(self.changeLookBox).find('.upper-colors-selector li.active').data('id');
    var lowerId = $(self.changeLookBox).find('.lowers-selector li.active').data('id');
    var lowerColorId = $(self.changeLookBox).find('.lower-colors-selector li.active').data('id');
    var result = "hd-"+headId+"-"+headColorId;
    if (hairCutId != '-1') {
      result += ".hr-"+hairCutId+"-"+hairCutColorId;
    }

    if (upperId !== '-1') {
      result += '.ch-' + upperId + '-' + upperColorId;
    }

    result += '.lg-'+lowerId+'-'+lowerColorId+'.sh-305-62'
    return result;
  },
  parseFigure: function(figure) {
    var result = {};
    figure.split('.').map(function(kvp) {
      var values = kvp.split('-');
      result[values[0]] = {
        id: values[1],
        color: values[2]
      };
      return {};
    });
    return result;
  },
  toggle: function() { // Toggle the box.
    $(this.changeLookBox).toggle();
  },
  destroy: function() {
    if (this.changeLookBox) $(this.changeLookBox).remove();
  }
});
