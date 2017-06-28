'use strict';
var StylistModalChooseHeadTab = function() { };
StylistModalChooseHeadTab.prototype = {
  render: function() {
    var self = this;
    var chooseHairCut = $.i18n('chooseHairCut'),
      chooseHairColor = $.i18n('chooseHairColor');
    self.tab = $("<div>"+
      "<div>"+
        "<label>"+chooseHairColor+"</label>"+
        "<div class='slider-container haircolors-slider-container'></div>"+
      "</div>"+
      "<div>"+
        "<label>"+chooseHairCut+"</label>"+
        "<div class='slider-container haircuts-slider-container'></div>"+
      "</div>"+
    "</div>");
    return self.tab;
  },
  refresh: function(gender) { // Refresh the player style.
    var hairColorsSliderContent = "";
    var hairCutsSliderContent = "";
    var hairCuts = Constants.playerConfiguration[gender].hairCuts;
    var i = 0;
    var self = this;
    hairCuts.forEach(function(hairCut) { // Set hair cuts.
      var cl = i === 0 ? "cell cell-active" : "cell";
      hairColorsSliderContent += "<div><div class='cell-container'><div class='"+cl+"' data-haircut='"+hairCut.name+"'>"+$.i18n(hairCut.colorKey)+"</div></div></div>";
      i++;
    });
    i = 0;
    hairCuts[0].faces.forEach(function(face) { // Set faces.
      var cl = i === 0 ? "cell cell-active" : "cell";
      hairCutsSliderContent += "<div><div class='cell-container'><div class='"+cl+"' data-face='"+face.name+"'><img src='"+face.overviewImage+"' /></div></div></div>";
      i++;
    });
    $(self.tab).find('.haircolors-slider-container').empty();
    $(self.tab).find('.haircuts-slider-container').empty();
    var hairColorsSlider = $("<div class='haircolors-slider'>"+hairColorsSliderContent+"</div>");
    var hairCutsSlider = $("<div class='haircuts-slider'>"+hairCutsSliderContent+"</div>");
    $(self.tab).find('.haircolors-slider-container').append(hairColorsSlider);
    $(self.tab).find('.haircuts-slider-container').append(hairCutsSlider);
    $(self.tab).find('.haircolors-slider .cell').click(function() {
      $(self.tab).find('.haircolors-slider .cell').removeClass('cell-active');
      $(this).addClass('cell-active');
    });
    $(self.tab).find('.haircuts-slider .cell').click(function() {
      $(self.tab).find('.haircuts-slider .cell').removeClass('cell-active');
      $(this).addClass('cell-active');
    });
  },
  show: function() {
    var self = this;
    if (self.isInit) return;
    self.forceInit();
    self.isInit = true;
  },
  forceInit: function() {
    var self = this;
    var hairCutsSlider = $(self.tab).find('.haircuts-slider'),
      hairColorsSlider = $(self.tab).find('.haircolors-slider');
    var sl = hairCutsSlider.slick({
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
  },
  getHead: function() {
    var self = this;
    var hairCut = $(self.tab).find('.haircolors-slider .cell-active').data('haircut');
    var face = $(self.tab).find('.haircuts-slider .cell-active').data('face');
    return {
      hairCut: hairCut,
      face: face
    };
  }
};
