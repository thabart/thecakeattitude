game.Menu = game.Menu || {};
game.Menu.ParametersModal = me.Object.extend({
  init: function() {
    var i18n = $.i18n();
    var frChecked = i18n.locale === 'fr' ? 'checked="checked"': '';
    var ukChecked = i18n.locale === 'en' ? 'checked="checked"': '';
    var nlChecked = i18n.locale === 'nl' ? 'checked="checked"': '';
    this.parametersModal = $("<div class='gray-modal parameters-modal' style='display: none;'>"+
      "<div class='header'></div>"+
      "<div class='body'>"+
        "<div class='title' data-i18n='updateParametersTitle'></div>"+
        "<div class='content'>"+
          "<input type='radio' name='language' value='fr' "+ frChecked +" ><img src='/img/icons/fr.png' /> <span data-i18n='fr'></span><br/>"+
          "<input type='radio' name='language' value='en' "+ ukChecked +" ><img src='/img/icons/uk.png' /><span data-i18n='en'></span><br/>"+
          "<input type='radio' name='language' value='nl' "+ nlChecked +" ><img src='/img/icons/nl.png' /><span data-i18n='nl'></span><br/>"+
          "<div class='actions'>"+
            "<button class='button button-gray back' data-i18n='back'></button>"+
            "<button class='button button-gray ok' data-i18n='ok'></button>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='footer'></div>"+
    "</div>");
    $(document.body).append(this.parametersModal);
    $(this.parametersModal).i18n();
    this.addListeners();
  },
  toggle: function() {
    $(this.parametersModal).toggle();
  },
  addListeners: function() {
    var self = this;
    $(self.parametersModal).find('.back').click(function() {
      $(self.parametersModal).toggle();
    });
    $(self.parametersModal).find('.ok').click(function() {
      var val = $(self.parametersModal).find('input[type="radio"]:checked').val();
      var i18n = $.i18n();
      i18n.locale = val;
      i18n.load('/js/i18n/'+ i18n.locale +'.json', i18n.locale).done(function() {
        $(document.body).i18n();
      });
    });
  },
  destroy: function() {
    if (this.parametersModal) $(this.parametersModal).remove();
  }
});
