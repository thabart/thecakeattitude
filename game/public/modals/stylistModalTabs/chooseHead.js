'use strict';
var StylistModalChooseHeadTab = function() { };
StylistModalChooseHeadTab.prototype = {
  render: function() {
    var self = this;
    var chooseHairCut = $.i18n('chooseHairCut'),
      chooseHairColor = $.i18n('chooseHairColor');
    var hairColorsSliderContent = "";
    var hairCutsSliderContent = "";
    var hairCuts = Constants.playerConfiguration['male'].hairCuts;
    var i = 0;
    hairCuts.forEach(function(hairCut) { // Set hair cuts.
      var cl = i === 0 ? "cell cell-active" : "cell";
      hairColorsSliderContent += "<div><div class='cell-container'><div class='"+cl+"'>"+$.i18n(hairCut.colorKey)+"</div></div></div>";
      i++;
    });
    i = 0;
    hairCuts[0].faces.forEach(function(face) { // Set faces.
      var cl = i === 0 ? "cell cell-active" : "cell";
      hairCutsSliderContent += "<div><div class='cell-container'><div class='"+cl+"'><img src='"+face.overviewImage+"' /></div></div></div>";
      i++;
    });
    self.tab = $("<div>"+
      "<div>"+
        "<label>"+chooseHairColor+"</label>"+
        "<div class='slider-container'>" +
          "<div class='haircolors-slider'>"+hairColorsSliderContent+"</div>"+
        "</div>"+
      "</div>"+
      "<div>"+
        "<label>"+chooseHairCut+"</label>"+
        "<div class='slider-container'>" +
          "<div class='haircuts-slider'>"+hairCutsSliderContent+"</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.tab).find('.haircolors-slider .cell').click(function() {
      $(self.tab).find('.haircolors-slider .cell').removeClass('cell-active');
      $(this).addClass('cell-active');
    });
    $(self.tab).find('.haircuts-slider .cell').click(function() {
      $(self.tab).find('.haircuts-slider .cell').removeClass('cell-active');
      $(this).addClass('cell-active');
    });
    return self.tab;
  },
  show: function() {
    var self = this;
    if (self.isInit) return;
    var hairCutsSlider = $(self.tab).find('.haircuts-slider'),
      hairColorsSlider = $(self.tab).find('.haircolors-slider');
    hairCutsSlider.slick({
      infinite: false,
      accessibility: false,
      slidesToShow: 3,
      slidesToScroll: 3
    });
    hairColorsSlider.slick({
      infinite: false,
      accessibility: false,
      slidesToShow: 3,
      slidesToScroll: 3
    });
    $(self.modal).find('.slick-prev').trigger('click');
    self.isInit = true;
  }
};
